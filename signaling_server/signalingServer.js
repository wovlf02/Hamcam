const http = require("http");
const { Server } = require("socket.io");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const server = http.createServer();

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
                user_id: user.user_id,  // userId -> user_id로 변경
                nickname: user.nickname,
                profileImageUrl: user.profile_image_url,
                focusedSeconds: 0,
                score: 0
            });

            const otherParticipants = Array.from(room.participants.entries())
                .filter(([id, _]) => id !== socket.id)
                .map(([id, p]) => ({ socketId: id, ...p }));

            // 새 유저에게 기존 참여자 목록 전송
            socket.emit("all-users", otherParticipants);

            // 기존 유저에게 새 유저 합류 알림
            socket.to(roomId).emit("user-joined", { socketId: socket.id, ...room.participants.get(socket.id) });

            console.log(`[${roomId}] ${user.nickname}(${socket.id}) 님이 입장했습니다. (총 ${room.participants.size}명)`);

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

        const chatMessage = {
            userId: sender.user_id,  // 채팅에서 사용할 userId 추가
            nickname: sender.nickname,
            message,
            timestamp: new Date()
        };
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
