import React, { useEffect, useState } from 'react';
import '../../css/CreateGroupModal.css';
import { FaTimes } from 'react-icons/fa';
import api from '../../api/api';
import baseProfile from '../../icons/base_profile.png';

const CreateGroupModal = ({ onClose, onCreate }) => {
    const [roomName, setRoomName] = useState('');
    const [friends, setFriends] = useState([]);
    const [selected, setSelected] = useState([]);
    const [search, setSearch] = useState('');
    const [image, setImage] = useState(null);

    useEffect(() => {
        fetchFriends();
    }, []);

    const fetchFriends = async () => {
        try {
            const res = await api.get('/friends/list'); // ✅ 여기 수정
            const online = res.data?.online_friends || [];
            const offline = res.data?.offline_friends || [];

            const combined = [...online, ...offline].map(f => ({
                userId: f.user_id,
                nickname: f.nickname,
                profileImageUrl: f.profile_image_url
                    ? `http://localhost:8080${f.profile_image_url}`
                    : baseProfile,
            }));

            setFriends(combined);
        } catch (e) {
            console.error('❌ 친구 목록 불러오기 실패', e);
        }
    };


    const handleSelect = (id) => {
        setSelected(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleCreate = async () => {
        if (!roomName.trim() || selected.length === 0) return;

        const formData = new FormData();

        // ✅ "request"라는 key로 JSON 문자열을 Blob으로 감싸서 추가
        const request = {
            room_name: roomName.trim(),
            invited_user_ids: selected
        };
        formData.append(
            'request',
            new Blob([JSON.stringify(request)], { type: 'application/json' })
        );

        // ✅ 파일이 있을 경우만 추가
        if (image) {
            formData.append('image', image);
        }

        try {
            const res = await api.post('/chat/rooms', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const createdRoom = res.data?.data;
            onCreate(createdRoom);
        } catch (e) {
            alert('채팅방 생성 실패');
            console.error(e);
        }
    };


    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) setImage(file);
    };

    const filteredFriends = friends.filter(friend =>
        friend.nickname.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="modal-overlay">
            <div className="modal-wrapper">
                <div className="modal-box">
                    <div className="modal-header">
                        <h3>그룹 채팅방 생성</h3>
                        <button className="modal-close" onClick={onClose}>
                            <FaTimes />
                        </button>
                    </div>

                    <div className="modal-avatar-wrapper">
                        <img
                            src={image ? URL.createObjectURL(image) : baseProfile}
                            alt="대표 이미지"
                            className="modal-avatar"
                        />
                        <label className="modal-image-upload">
                            대표 이미지 선택
                            <input type="file" accept="image/*" onChange={handleFileChange} hidden />
                        </label>
                    </div>

                    <input
                        type="text"
                        maxLength={30}
                        placeholder="채팅방 이름 (최대 30자)"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        className="modal-input"
                    />
                    <div className="modal-char-count">{roomName.length}/30</div>

                    <input
                        type="text"
                        placeholder="닉네임으로 검색"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="modal-input"
                    />

                    <div className="friend-scroll">
                        {filteredFriends.map(friend => (
                            <div
                                key={friend.userId}
                                className={`friend-item ${selected.includes(friend.userId) ? 'selected' : ''}`}
                                onClick={() => handleSelect(friend.userId)}
                            >
                                <img
                                    src={friend.profileImageUrl}
                                    alt={friend.nickname}
                                    className="friend-avatar"
                                    onError={(e) => { e.target.src = baseProfile; }}
                                />
                                <span>{friend.nickname}</span>
                                <div className={`friend-check ${selected.includes(friend.userId) ? 'checked' : ''}`} />
                            </div>
                        ))}
                        {filteredFriends.length === 0 && <div className="friend-empty">검색 결과 없음</div>}
                    </div>

                    <div className="modal-selected-count">
                        선택된 인원: {selected.length}명
                    </div>

                    <button
                        className={`modal-submit ${!roomName.trim() || selected.length === 0 ? 'disabled' : ''}`}
                        onClick={handleCreate}
                        disabled={!roomName.trim() || selected.length === 0}
                    >
                        채팅방 만들기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateGroupModal;
