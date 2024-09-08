import React from 'react';

interface PaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  hasMore: boolean;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, onPageChange, hasMore }) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (hasMore) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex justify-center mt-4">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="px-4 py-2 mx-1 bg-gray-300 rounded disabled:opacity-50"
      >
        Previous
      </button>
      <span className="px-4 py-2 mx-1">{currentPage}</span>
      <button
        onClick={handleNext}
        disabled={!hasMore}
        className="px-4 py-2 mx-1 bg-gray-300 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
