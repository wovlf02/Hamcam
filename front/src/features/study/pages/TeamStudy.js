import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/api';
import '../styles/TeamStudy.css'; // Main stylesheet

// Import new components
import ViewModeToggle from '../components/team/ViewModeToggle';
import CombinedView from '../components/team/CombinedView';
import SplitView from '../components/team/SplitView';

// A re-styled and simplified modal
const CreateRoomModal = ({ show, onClose, onCreate, preselectedRoomType }) => {
    const [title, setTitle] = useState('');
    const [roomType, setRoomType] = useState(preselectedRoomType || 'QUIZ'); // Initialize with preselectedRoomType
    const [maxParticipants, setMaxParticipants] = useState(10); // New state for max participants
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (preselectedRoomType) {
            setRoomType(preselectedRoomType);
        } else {
            setRoomType('QUIZ'); // Default when no preselection
        }
    }, [preselectedRoomType]);

    if (!show) return null;

    const handleCreate = () => {
        if (!title.trim()) {
            alert('학습방 이름을 입력해주세요.');
            return;
        }
        onCreate({ title, room_type: roomType, max_participants: maxParticipants, password }); // Pass max_participants
        onClose();
    };

    return (
        <div className="team-study-modal">
            <div className="modal-content">
                <h2>새 학습방 만들기</h2>
                <div className="form-group">
                    <label>학습방 이름</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="예: 함께하는 알고리즘 스터디" />
                </div>
                <div className="form-group">
                    <label>학습방 종류</label>
                    <select value={roomType} onChange={(e) => setRoomType(e.target.value)} disabled={!!preselectedRoomType}> // Disable if preselected
                        <option value="QUIZ">문제풀이방</option>
                        <option value="FOCUS">집중학습방</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>최대 참여자 수</label>
                    <input
                        type="number"
                        value={maxParticipants}
                        onChange={(e) => setMaxParticipants(parseInt(e.target.value))}
                        min="1"
                        placeholder="예: 10"
                    />
                </div>
                <div className="form-group">
                    <label>비밀번호 (선택)</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="미입력 시 공개방으로 개설" />
                </div>
                <div className="modal-buttons">
                    <button className="btn-cancel" onClick={onClose}>취소</button>
                    <button className="btn-create" onClick={handleCreate}>생성</button>
                </div>
            </div>
        </div>
    );
};

const TeamStudy = () => {
    const [viewMode, setViewMode] = useState('combined'); // 'combined' or 'split'
    const [allRooms, setAllRooms] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [preselectedRoomType, setPreselectedRoomType] = useState(null); // New state
    const navigate = useNavigate();

    // State for Combined View
    const [combinedSearch, setCombinedSearch] = useState('');
    const [combinedFilter, setCombinedFilter] = useState('ALL');
    const [combinedSort, setCombinedSort] = useState('latest');
    const [combinedPage, setCombinedPage] = useState(1);

    // State for Split View
    const [focusSearch, setFocusSearch] = useState('');
    const [focusSort, setFocusSort] = useState('latest');
    const [focusPage, setFocusPage] = useState(1);

    const [quizSearch, setQuizSearch] = useState('');
    const [quizSort, setQuizSort] = useState('latest');
    const [quizPage, setQuizPage] = useState(1);

    const ITEMS_PER_PAGE = 10;

    // Fetch all rooms once on component mount
    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const res = await api.get('/study/team/all');
                setAllRooms(res?.data || []);
            } catch (error) {
                console.error('팀방 목록 불러오기 실패:', error);
            }
        };
        fetchRooms();
    }, []);

    // Memoized logic for filtering and sorting rooms
    const getProcessedRooms = (rooms, searchTerm, sortOrder) => {
        return rooms
            .filter(room => room.title.toLowerCase().includes(searchTerm.toLowerCase()))
            .sort((a, b) => {
                if (sortOrder === 'popular') {
                    return (b.max_participants || 0) - (a.max_participants || 0); // Example popularity metric
                }
                return new Date(b.created_at) - new Date(a.created_at); // Default to latest
            });
    };

    // Combined View Data
    const combinedFilteredRooms = useMemo(() => {
        const rooms = allRooms.filter(room => combinedFilter === 'ALL' || room.room_type === combinedFilter);
        return getProcessedRooms(rooms, combinedSearch, combinedSort);
    }, [allRooms, combinedFilter, combinedSearch, combinedSort]);

    // Split View Data
    const focusRooms = useMemo(() => getProcessedRooms(allRooms.filter(r => r.room_type === 'FOCUS'), focusSearch, focusSort), [allRooms, focusSearch, focusSort]);
    const quizRooms = useMemo(() => getProcessedRooms(allRooms.filter(r => r.room_type === 'QUIZ'), quizSearch, quizSort), [allRooms, quizSearch, quizSort]);

    // Pagination Logic
    const paginate = (items, page) => items.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    const combinedPaginated = paginate(combinedFilteredRooms, combinedPage);
    const focusPaginated = paginate(focusRooms, focusPage);
    const quizPaginated = paginate(quizRooms, quizPage);

    // Event Handlers
    const handleJoinRoom = (roomId) => {
        const room = allRooms.find(r => r.room_id === roomId);
        if (!room) return;

        if (room.password) {
            const inputPassword = prompt('비밀번호를 입력하세요:');
            if (inputPassword !== room.password) {
                alert('비밀번호가 일치하지 않습니다.');
                return;
            }
        }
        const route = room.room_type === 'FOCUS' ? `/team-study/focus/${roomId}` : `/team-study/quiz/${roomId}`;
        navigate(route);
    };

    const handleCreateRoom = async (roomDetails) => {
        try {
            const res = await api.post('/study/team/create', roomDetails);
            alert('학습방이 성공적으로 생성되었습니다!');
            const newRoom = { ...roomDetails, room_id: res.data, created_at: new Date().toISOString() };
            setAllRooms(prev => [newRoom, ...prev]);
        } catch (error) {
            console.error('팀방 생성 실패:', error);
            alert('학습방 생성에 실패했습니다.');
        }
    };

    const handleShowCreateModal = (type = null) => {
        setPreselectedRoomType(type);
        setShowModal(true);
    };

    return (
        <div className="team-study-container">
            <div className="page-header">
                <h1>팀 학습 참여하기</h1>
                <ViewModeToggle viewMode={viewMode} setViewMode={setViewMode} />
            </div>

            {viewMode === 'combined' ? (
                <CombinedView 
                    rooms={combinedPaginated}
                    onJoinRoom={handleJoinRoom}
                    searchTerm={combinedSearch}
                    setSearchTerm={setCombinedSearch}
                    filterType={combinedFilter}
                    setFilterType={setCombinedFilter}
                    sortOrder={combinedSort}
                    setSortOrder={setCombinedSort}
                    onShowCreateModal={() => handleShowCreateModal(null)}
                    currentPage={combinedPage}
                    totalPages={Math.ceil(combinedFilteredRooms.length / ITEMS_PER_PAGE)}
                    onPageChange={setCombinedPage}
                />
            ) : (
                <SplitView 
                    focusRooms={focusPaginated}
                    quizRooms={quizPaginated}
                    onJoinRoom={handleJoinRoom}
                    onShowCreateModal={handleShowCreateModal}
                    focusSearch={focusSearch}
                    setFocusSearch={setFocusSearch}
                    focusSort={focusSort}
                    setFocusSort={setFocusSort}
                    focusCurrentPage={focusPage}
                    focusTotalPages={Math.ceil(focusRooms.length / ITEMS_PER_PAGE)}
                    onFocusPageChange={setFocusPage}
                    quizSearch={quizSearch}
                    setQuizSearch={setQuizSearch}
                    quizSort={quizSort}
                    setQuizSort={setQuizSort}
                    quizCurrentPage={quizPage}
                    quizTotalPages={Math.ceil(quizRooms.length / ITEMS_PER_PAGE)}
                    onQuizPageChange={setQuizPage}
                />
            )}

            <CreateRoomModal 
                show={showModal}
                onClose={() => setShowModal(false)}
                onCreate={handleCreateRoom}
                preselectedRoomType={preselectedRoomType} // Pass preselectedRoomType
            />
        </div>
    );
};

export default TeamStudy;