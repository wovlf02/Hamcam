import React, { useEffect, useState } from 'react';
import '../../styles/CreateGroupModal.css';
import { FaTimes, FaUsers, FaImage, FaSearch, FaCheck } from 'react-icons/fa';
import api from '../../../../api/api';
import baseProfile from '../../../../assets/icons/base_profile.png';

const CreateGroupModal = ({ onClose, onCreate }) => {
    const [roomName, setRoomName] = useState('');
    const [friends, setFriends] = useState([]);
    const [selected, setSelected] = useState([]);
    const [search, setSearch] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

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
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const filteredFriends = friends.filter(friend =>
        friend.nickname.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="modal-overlay modern-overlay" onClick={onClose}>
            <div className="modal-wrapper modern-wrapper" onClick={(e) => e.stopPropagation()}>
                <div className="modal-box modern-modal">
                    {/* 헤더 */}
                    <div className="modal-header modern-header">
                        <div className="modal-title-group">
                            <FaUsers className="modal-title-icon" />
                            <h3>새로운 그룹 채팅</h3>
                        </div>
                        <button className="modal-close modern-close" onClick={onClose}>
                            <FaTimes />
                        </button>
                    </div>

                    {/* 대표 이미지 섹션 */}
                    <div className="modal-avatar-section">
                        <div className="modal-avatar-wrapper modern-avatar">
                            <img
                                src={imagePreview || baseProfile}
                                alt="그룹 이미지"
                                className="modal-avatar"
                            />
                            <label className="modal-image-upload modern-upload">
                                <FaImage />
                                <span>이미지 선택</span>
                                <input type="file" accept="image/*" onChange={handleFileChange} hidden />
                            </label>
                        </div>
                    </div>

                    {/* 채팅방 이름 입력 */}
                    <div className="modal-input-group">
                        <label className="modal-label">채팅방 이름</label>
                        <div className="modal-input-wrapper">
                            <input
                                type="text"
                                maxLength={30}
                                placeholder="그룹의 이름을 입력하세요 ✨"
                                value={roomName}
                                onChange={(e) => setRoomName(e.target.value)}
                                className="modal-input modern-input"
                            />
                            <span className="modal-char-count modern-count">{roomName.length}/30</span>
                        </div>
                    </div>

                    {/* 친구 검색 */}
                    <div className="modal-input-group">
                        <label className="modal-label">참여자 추가</label>
                        <div className="modal-search-wrapper">
                            <FaSearch className="search-icon" />
                            <input
                                type="text"
                                placeholder="친구 이름으로 검색하기"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="modal-input modern-input search-input"
                            />
                        </div>
                    </div>

                    {/* 친구 리스트 */}
                    <div className="friend-scroll modern-scroll">
                        {filteredFriends.length === 0 ? (
                            <div className="friend-empty modern-empty">
                                {search ? '검색 결과가 없습니다 🔍' : '친구가 없습니다 👥'}
                            </div>
                        ) : (
                            filteredFriends.map(friend => (
                                <div
                                    key={friend.userId}
                                    className={`friend-item modern-item ${selected.includes(friend.userId) ? 'selected' : ''}`}
                                    onClick={() => handleSelect(friend.userId)}
                                >
                                    <img
                                        src={friend.profileImageUrl}
                                        alt={friend.nickname}
                                        className="friend-avatar modern-friend-avatar"
                                        onError={(e) => { e.target.src = baseProfile; }}
                                    />
                                    <span className="friend-name">{friend.nickname}</span>
                                    <div className={`friend-check modern-check ${selected.includes(friend.userId) ? 'checked' : ''}`}>
                                        {selected.includes(friend.userId) && <FaCheck size={12} />}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* 선택된 인원 표시 */}
                    {selected.length > 0 && (
                        <div className="modal-selected-badge">
                            <FaUsers size={14} />
                            <span>선택된 인원: <strong>{selected.length}명</strong></span>
                        </div>
                    )}

                    {/* 생성 버튼 */}
                    <button
                        className={`modal-submit modern-submit ${!roomName.trim() || selected.length === 0 ? 'disabled' : ''}`}
                        onClick={handleCreate}
                        disabled={!roomName.trim() || selected.length === 0}
                    >
                        <span>채팅방 만들기</span>
                        <span className="submit-icon">🚀</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateGroupModal;
