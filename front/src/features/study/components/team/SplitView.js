
import React from 'react';
import ControlHeader from './ControlHeader';
import RoomCard from './RoomCard';
import Pagination from './Pagination';

const RoomColumn = ({ 
    title,
    rooms,
    onJoinRoom,
    // Control Props
    searchTerm, setSearchTerm,
    sortOrder, setSortOrder,
    onShowCreateModal,
    // Pagination Props
    currentPage, totalPages, onPageChange
}) => {
    return (
        <div className="room-column">
            <h2>{title}</h2>
            <ControlHeader 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                onShowCreateModal={onShowCreateModal}
                isSplitView={true}
            />
            {rooms.length > 0 ? (
                <ul className="room-list">
                    {rooms.map(room => (
                        <RoomCard key={room.room_id} room={room} onJoin={onJoinRoom} />
                    ))}
                </ul>
            ) : (
                <div className="empty-state">
                    <p className="empty-icon">📭</p>
                    <p className="empty-message">해당 종류의 학습방이 없습니다.</p>
                </div>
            )}
            <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
            />
        </div>
    );
}

const SplitView = ({ 
    focusRooms, 
    quizRooms, 
    onJoinRoom, 
    onShowCreateModal,
    // Focus Room Props
    focusSearch, setFocusSearch,
    focusSort, setFocusSort,
    focusCurrentPage, focusTotalPages, onFocusPageChange,
    // Quiz Room Props
    quizSearch, setQuizSearch,
    quizSort, setQuizSort,
    quizCurrentPage, quizTotalPages, onQuizPageChange
}) => {
    return (
        <div className="split-view-container">
            <RoomColumn 
                title="집중 학습방 (Focus Rooms)"
                rooms={focusRooms}
                onJoinRoom={onJoinRoom}
                searchTerm={focusSearch}
                setSearchTerm={setFocusSearch}
                sortOrder={focusSort}
                setSortOrder={setFocusSort}
                onShowCreateModal={onShowCreateModal}
                currentPage={focusCurrentPage}
                totalPages={focusTotalPages}
                onPageChange={onFocusPageChange}
            />
            <RoomColumn 
                title="문제 풀이방 (Quiz Rooms)"
                rooms={quizRooms}
                onJoinRoom={onJoinRoom}
                searchTerm={quizSearch}
                setSearchTerm={setQuizSearch}
                sortOrder={quizSort}
                setSortOrder={setQuizSort}
                onShowCreateModal={onShowCreateModal}
                currentPage={quizCurrentPage}
                totalPages={quizTotalPages}
                onPageChange={onQuizPageChange}
            />
        </div>
    );
};

export default SplitView;
