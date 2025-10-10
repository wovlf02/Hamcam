const http = require("http");
const { Server } = require("socket.io");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

// HTTP 서버 생성 및 라우팅 처리
const server = http.createServer((req, res) => {
    // CORS 헤더 설정
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // OPTIONS 요청 처리 (CORS preflight)
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // 실시간 접속자 수 조회 엔드포인트
    if (req.url === '/room-counts' && req.method === 'GET') {
        const counts = {};
        rooms.forEach((room, roomId) => {
            counts[roomId] = room.participants.size;
        });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(counts));
        console.log(`📊 실시간 접속자 수 조회: ${Object.keys(counts).length}개 방`);
        return;
    }

    // 404 처리
    res.writeHead(404);
    res.end('Not Found');
});

// 동적으로 Spring API URL 설정
let SPRING_API_URL = "";
try {
    const apiUrlPath = path.join(__dirname, '..', 'front', 'src', 'api', 'apiUrl.js');
    const apiUrlFileContent = fs.readFileSync(apiUrlPath, 'utf8');
    const match = apiUrlFileContent.match(/export const API_BASE_URL_8080 = ["'`](.*)["'`];/);
    if (match && match[1]) {
        SPRING_API_URL = `${match[1]}/api`;
        console.log(`✅ Spring API URL을 동적으로 설정했습니다: ${SPRING_API_URL}`);
    } else {
        throw new Error("API_BASE_URL_8080 값을 찾을 수 없습니다.");
    }
} catch (error) {
    console.error("❌ apiUrl.js 파일 읽기 또는 파싱 실패. 기본 URL을 사용합니다.", error);
    SPRING_API_URL = "http://localhost:8080/api"; // Fallback URL
}

// 인메모리 방 상태 관리
const rooms = new Map();

const io = new Server(server, {
    cors: {
        origin: (origin, callback) => {
            // 로컬 개발 환경(localhost, 127.0.0.1, IP 주소) 및 ngrok 허용
            if (!origin || origin.startsWith("http://localhost") || origin.startsWith("http://127.0.0.1") || origin.startsWith("http://192.168.") || /\.ngrok-free\.app$/.test(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        methods: ["GET", "POST"],
        credentials: true
    }
});

io.on("connection", (socket) => {
    console.log(`✅ 사용자 연결됨: ${socket.id}`);

    // 방 입장 및 사용자 정보 초기화
    socket.on("join-room", async ({ roomId, token }) => {
        try {
            // Spring API로 사용자 정보 조회
            const response = await axios.get(`${SPRING_API_URL}/users/me`, {
                headers: { 'Cookie': socket.request.headers.cookie }
            });
            const user = response.data.data;

            if (!user) {
                throw new Error("사용자 정보를 가져올 수 없습니다.");
            }

            // 🔍 디버깅: API 응답의 모든 필드 확인
            console.log(`[join-room] 백엔드 API 응답:`, JSON.stringify(user, null, 2));
            console.log(`[join-room] user.userId:`, user.userId);
            console.log(`[join-room] user.profileImageUrl:`, user.profileImageUrl);

            socket.join(roomId);

            // 인메모리 상태 관리
            if (!rooms.has(roomId)) {
                rooms.set(roomId, {
                    participants: new Map(),
                    // 퀴즈방, 경쟁방 등 추가 상태 초기화
                });
            }
            const room = rooms.get(roomId);
            room.participants.set(socket.id, {
                user_id: user.user_id,  // snake_case 필드명 사용
                nickname: user.nickname,
                profileImageUrl: user.profile_image_url,  // snake_case 필드명 사용
                focusedSeconds: 0,
                score: 0
            });

            const otherParticipants = Array.from(room.participants.entries())
                .filter(([id, _]) => id !== socket.id)
                .map(([id, p]) => ({ socketId: id, ...p }));

            // 새 유저에게 기존 참여자 목록과 누적 시간 전송
            console.log(`[${roomId}] 새 유저 ${user.nickname}에게 기존 참여자 정보 전송:`,
                otherParticipants.map(p => `${p.nickname}: ${p.focusedSeconds}초`));
            socket.emit("all-users", otherParticipants);

            // 기존 유저에게 새 유저 합류 알림
            socket.to(roomId).emit("user-joined", { socketId: socket.id, ...room.participants.get(socket.id) });

            console.log(`[${roomId}] ${user.nickname}(${socket.id}) 님이 입장했습니다. (총 ${room.participants.size}명)`);

            // 🔹 전체 클라이언트에게 해당 방의 접속자 수 변경 브로드캐스트
            io.emit("room-count-update", {
                roomId: roomId,
                count: room.participants.size
            });
            console.log(`📊 [${roomId}] 접속자 수 업데이트 브로드캐스트: ${room.participants.size}명`);

        } catch (error) {
            console.error(`[ERROR] join-room 실패 (socketId: ${socket.id}):`, error.message);
            socket.emit("error", "방 입장에 실패했습니다.");
        }
    });

    // WebRTC 시그널링 중계
    socket.on("signal", ({ targetSocketId, sdp, candidate }) => {
        socket.to(targetSocketId).emit("signal", {
            fromSocketId: socket.id,
            sdp,
            candidate,
        });
    });

    // 채팅 메시지 중계
    socket.on("send-message", ({ roomId, message }) => {
        const room = rooms.get(roomId);
        const sender = room?.participants.get(socket.id);
        if (!sender) return;

        console.log(`[send-message] 발신자 정보:`, sender);
        console.log(`[send-message] profileImageUrl:`, sender.profileImageUrl);

        const chatMessage = {
            userId: sender.user_id,  // 채팅에서 사용할 userId 추가
            nickname: sender.nickname,
            profileImageUrl: sender.profileImageUrl,  // 프로필 이미지 추가
            message,
            timestamp: new Date()
        };

        console.log(`[send-message] 전송할 메시지:`, chatMessage);
        io.to(roomId).emit("new-message", chatMessage);
    });

    // --- 이전 STOMP 로직 대체 ---
    socket.on("start-problem", ({ roomId, subject, unit, level }) => {
        // TODO: 문제 선택 로직 구현 (Spring API 호출 또는 자체 DB)
        console.log(`[${roomId}] 문제 시작 요청: ${subject}, ${unit}, ${level}`);
        // const problem = ...
        // io.to(roomId).emit("new-problem", problem);
    });

    socket.on("submit-answer", ({ roomId, answer }) => {
        // TODO: 정답 확인 및 랭킹 업데이트 로직 구현
        console.log(`[${roomId}] 정답 제출: ${answer}`);
        // io.to(roomId).emit("ranking-update", newRanking);
    });

    socket.on("focus-time-update", ({ userId, time }) => {
        const roomIds = Array.from(socket.rooms);
        const roomId = roomIds.find(r => r !== socket.id);
        if (!roomId) return;

        const room = rooms.get(roomId);
        if (room) {
            // 서버 메모리에 해당 참여자의 시간 업데이트 (캠을 끄기 전 마지막 시간 저장)
            const participant = room.participants.get(socket.id);
            if (participant) {
                participant.focusedSeconds = time;
                console.log(`[${roomId}] ${participant.nickname}(${socket.id})의 집중 시간 업데이트: ${time}초`);
            }
        }

        // 다른 유저들에게 업데이트된 시간 브로드캐스트
        io.to(roomId).emit("focus-time-update", { userId, time });
    });

    // --- 로직 대체 끝 ---

    // 연결 해제 처리
    socket.on("disconnecting", () => {
        const roomIds = Array.from(socket.rooms).filter(r => r !== socket.id);

        roomIds.forEach(roomId => {
            const room = rooms.get(roomId);
            if (room) {
                room.participants.delete(socket.id);
                io.to(roomId).emit("user-left", socket.id);
                console.log(`[${roomId}] 사용자 퇴장: ${socket.id}. (남은 인원 ${room.participants.size}명)`);

                // 🔹 전체 클라이언트에게 해당 방의 접속자 수 변경 브로드캐스트
                io.emit("room-count-update", {
                    roomId: roomId,
                    count: room.participants.size
                });
                console.log(`📊 [${roomId}] 접속자 수 업데이트 브로드캐스트: ${room.participants.size}명`);

                if (room.participants.size === 0) {
                    // TODO: 방 종료 시 Spring API로 최종 데이터 전송 로직
                    console.log(`[${roomId}] 방이 비어있어 정리합니다.`);
                    rooms.delete(roomId);
                }
            }
        });
        console.log(`❌ 사용자 연결 해제: ${socket.id}`);
    });
});

server.listen(4000, () => {
    console.log("✅ Signaling 서버가 포트 4000에서 실행 중입니다.");
});
