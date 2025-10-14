import io from 'socket.io-client';

let socket;

export const connectSocket = () => {
  if (socket && socket.connected) {
    console.log('Socket is already connected.');
    return socket;
  }

  // signaling_server 주소
  const SOCKET_URL = 'http://localhost:4000';

  socket = io(SOCKET_URL, {
    withCredentials: true, // 백엔드와 세션 공유를 위해 필수
  });

  socket.on('connect', () => {
    console.log(`✅ Socket.IO 연결 성공: ${socket.id}`);
  });

  socket.on('disconnect', () => {
    console.log('❌ Socket.IO 연결 해제');
  });

  socket.on('connect_error', (err) => {
    console.error(`Socket.IO 연결 오류: ${err.message}`);
  });

  return socket;
};

export const getSocket = () => socket;
