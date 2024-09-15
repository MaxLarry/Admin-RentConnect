import React from 'react';
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";

function Pagination({ totalItems, itemsPerPage, currentPage, onPageChange }) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  // Function to limit the displayed page numbers to 5
  const renderPageNumbers = () => {
    if (totalPages <= 5) {
      return pages;
    }

    if (currentPage <= 3) {
      return [...pages.slice(0, 4), '...', totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [1, '...', ...pages.slice(totalPages - 4)];
    }

    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  return (
    <div className="flex justify-center mt-4 space-x-2">
      <button
        className="disabled:opacity-50"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <MdNavigateBefore className="text-zinc-800 dark:text-zinc-200" />
      </button>
      {renderPageNumbers().map((page, index) => (
        <button
          key={index}
          className={`px-3 py-1 w-8 h-8 border rounded-full flex items-center justify-center ${
            currentPage === page
              ? 'bg-gray-300 dark:bg-zinc-600 text-zinc-800 dark:text-white'
              : 'text-zinc-800 dark:text-zinc-200'
          }`}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          disabled={page === '...'}
        >
          {page}
        </button>
      ))}
      <button
        className="disabled:opacity-50"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <MdNavigateNext className="text-zinc-800 dark:text-zinc-200" />
      </button>
    </div>
  );
}

export default Pagination;
