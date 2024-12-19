import { FC } from "react";
import { useTranslation } from "react-i18next";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const { t } = useTranslation();

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex justify-center items-center space-x-3 mt-8 font-poppins">
      {/* Previous Button */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          currentPage === 1
            ? "cursor-not-allowed opacity-50 text-gray-400"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 hover:dark:bg-gray-600"
        }`}
      >
        {t("collectionspage.pagination.previous")}
      </button>

      {/* Page Numbers */}
      <div className="flex space-x-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`px-3 py-1 text-sm font-medium rounded-md border transition-all duration-200 ${
              currentPage === index + 1
                ? "bg-gray-700 text-white border-gray-700 cursor-default"
                : "bg-transparent text-gray-700 dark:text-gray-200 border-transparent hover:text-gray-500 dark:hover:text-gray-400 hover:border-gray-300"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          currentPage === totalPages
            ? "cursor-not-allowed opacity-50 text-gray-400"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 hover:dark:bg-gray-600"
        }`}
      >
        {t("collectionspage.pagination.next")}
      </button>
    </div>
  );
};

export default Pagination;
