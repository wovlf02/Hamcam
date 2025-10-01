
import React from 'react';
import ControlHeader from './ControlHeader';
import RoomCard from './RoomCard';
import Pagination from './Pagination';

const CombinedView = ({ 
    rooms,
    onJoinRoom,
    // Control Props
    searchTerm, setSearchTerm,
    filterType, setFilterType,
    sortOrder, setSortOrder,
    onShowCreateModal,
    // Pagination Props
    currentPage, totalPages, onPageChange
}) => {

    return (
        <div>
            <ControlHeader 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterType={filterType}
                setFilterType={setFilterType}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                onShowCreateModal={onShowCreateModal}
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
                    <p className="empty-message">조건에 맞는 학습방이 없습니다.</p>
                </div>
            )}
            <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
            />
        </div>
    );
};

export default CombinedView;
