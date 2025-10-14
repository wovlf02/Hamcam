import React, { useRef, useEffect } from 'react';
import '../../styles/FocusChat.css';

const FocusChat = ({ chatList, chatMsg, setChatMsg, onSend, userId }) => {
    const chatLogRef = useRef(null);

    // 채팅 메시지가 업데이트될 때마다 맨 아래로 스크롤
    useEffect(() => {
        if (chatLogRef.current) {
            chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
        }
    }, [chatList]);

    return (
        <div className="chat-box">
            <h3 className="chat-title">채팅</h3>
            <div className="chat-log" ref={chatLogRef}>
                {chatList.map((msg, idx) => (
                    <div key={idx} className={msg.userId === userId ? 'chat-my' : 'chat-other'}>
                        <p className="chat-time">{msg.time}</p>
                        {msg.userId !== userId && <p className="chat-nickname">{msg.nickname}</p>}
                        <p className="chat-message">{msg.message}</p>
                    </div>
                ))}
            </div>
            <div className="chat-input-row">
                <input
                    value={chatMsg}
                    onChange={(e) => setChatMsg(e.target.value)}
                    className="chat-input"
                    placeholder="메시지 입력"
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            onSend();
                        }
                    }}
                />
                <button className="chat-send-btn" onClick={onSend}>전송</button>
            </div>
        </div>
    );
};

export default FocusChat;
