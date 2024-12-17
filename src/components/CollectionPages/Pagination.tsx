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
    <div className="flex justify-center items-center space-x-2 mt-16 font-poppins">
      {/* Previous Button */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 text-sm dark:bg-gray-700 text-gray-500 hover:text-gray-400 transition-all duration-300 dark:text-gray-200 rounded-md ${
          currentPage === 1 ? "cursor-default opacity-0" : ""
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
            className={`px-1.5 py-0.5 border ${
              currentPage === index + 1
                ? "border-gray-900  text-gray-700 cursor-default"
                : "border-transparent dark:border-gray-700  text-gray-700 dark:text-gray-200 hover:text-gray-400 duration-300 transition-all"
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
        className={`px-3 text-sm dark:bg-gray-700 text-gray-500 hover:text-gray-400 transition-all duration-300 dark:text-gray-200 rounded-md ${
          currentPage === totalPages ? "cursor-default opacity-0" : ""
        }`}
      >
        {t("collectionspage.pagination.next")}
      </button>
    </div>
  );
};

export default Pagination;
