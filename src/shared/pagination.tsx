import { FC, useEffect } from "react";

interface PaginationProps {
  items: any[];
  totalItems: number;
  pageSize: number;
  totalPages: number;
  setCurrentPageItems: (items: any[]) => void;
  fetchMore: () => Promise<void>;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const Pagination: FC<PaginationProps> = ({
  items,
  totalItems,
  pageSize,
  totalPages,
  setCurrentPageItems,
  fetchMore,
  currentPage,
  setCurrentPage,
}) => {
  useEffect(() => {
    setCurrentPageItems(
      items.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    );
  }, [currentPage, items, pageSize, setCurrentPageItems]);

  const handleNext = async () => {
    console.log(items.length, totalItems, (currentPage + 1) * pageSize);

    console.log(items.length <= (currentPage + 1) * pageSize);
    console.log(items.length < totalItems);
    if (currentPage < totalPages) {
      if (
        items.length < (currentPage + 1) * pageSize &&
        items.length < totalItems
      ) {
        await fetchMore();
      }
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="flex justify-center items-center space-x-3 mt-8 font-poppins">
      {/* Previous Button */}
      <button
        onClick={handlePrevious}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${currentPage === 1
            ? "cursor-not-allowed opacity-50 text-gray-400"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 hover:dark:bg-gray-600"
          }`}
        disabled={currentPage === 1}
      >
        Prev
      </button>

      {/* Page Numbers */}
      <span className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200">
        Page {currentPage} of {totalPages}
      </span>

      {/* Next Button */}
      <button
        onClick={handleNext}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${currentPage === totalPages
            ? "cursor-not-allowed opacity-50 text-gray-400"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 hover:dark:bg-gray-600"
          }`}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
