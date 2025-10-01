
import React from 'react';

const ViewModeToggle = ({ viewMode, setViewMode }) => {
    return (
        <div className="view-mode-toggle">
            <button 
                className={viewMode === 'combined' ? 'active' : ''} 
                onClick={() => setViewMode('combined')}
            >
                모아서 보기
            </button>
            <button 
                className={viewMode === 'split' ? 'active' : ''} 
                onClick={() => setViewMode('split')}
            >
                분할해서 보기
            </button>
        </div>
    );
};

export default ViewModeToggle;
