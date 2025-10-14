
import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    if (totalPages <= 1) {
        return null; // Don't render pagination if there's only one page
    }

    return (
        <nav>
            <ul className="pagination">
                <li>
                    <button 
                        onClick={() => onPageChange(currentPage - 1)} 
                        disabled={currentPage === 1}
                    >
                        &laquo;
                    </button>
                </li>
                {pageNumbers.map(number => (
                    <li key={number}>
                        <button 
                            onClick={() => onPageChange(number)} 
                            className={currentPage === number ? 'active' : ''}
                        >
                            {number}
                        </button>
                    </li>
                ))}
                <li>
                    <button 
                        onClick={() => onPageChange(currentPage + 1)} 
                        disabled={currentPage === totalPages}
                    >
                        &raquo;
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;
