
import React from 'react';
import { Search } from 'react-feather';

const ControlHeader = ({ 
    searchTerm, 
    setSearchTerm, 
    filterType, 
    setFilterType, 
    sortOrder, 
    setSortOrder, 
    onShowCreateModal, 
    isSplitView = false // To conditionally show filters
}) => {
    return (
        <div className="control-header">
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="학습방 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button>
                    <Search size={18} />
                </button>
            </div>
            
            <div className="filter-sort">
                {!isSplitView && (
                    <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                        <option value="ALL">전체</option>
                        <option value="QUIZ">문제풀이방</option>
                        <option value="FOCUS">집중학습방</option>
                    </select>
                )}
                <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                    <option value="latest">최신순</option>
                    <option value="popular">인기순</option>
                </select>
            </div>

            <button className="create-room-btn" onClick={onShowCreateModal}>
                + 새 학습방
            </button>
        </div>
    );
};

export default ControlHeader;
