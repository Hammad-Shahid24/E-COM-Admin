import { FC, } from "react";
import { Product, Order } from "../types/Shopping";

interface FilteringAndPagingProps {
  items: Product[] | Order[];
  pageSizeOptions: number[];
  pageSize: number;
  setPageSize: (size: number) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  fetchMore: (count: number) => Promise<void>;
  //the below two are used to set the label of the selected option in the select sort element
  sortKey: string;
  sortOrder: "asc" | "desc";
  sortOptions: { key: string; label: string }[]; // List of available sorting criteria
  onSortChange: (key: string) => Promise<void>; // Function to notify parent about sort changes
}

const FilteringAndPaging: FC<FilteringAndPagingProps> = ({
  items,
  pageSizeOptions,
  pageSize,
  setPageSize,
  setCurrentPage,
  fetchMore,
  sortKey,
  sortOrder,
  sortOptions,
  onSortChange,
}) => {
  // const [searchTerm, setSearchTerm] = useState("");

  // Handle search input change
  // const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setSearchTerm(e.target.value);
  // };

  // Handle page size change and fetch more products if needed
  const handlePageSizeChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCurrentPage(1); // Reset to the first page when page size changes
    const newPageSize = Number(event.target.value);

    if (items.length < newPageSize) {
      await fetchMore(newPageSize - items.length);
    }

    setPageSize(newPageSize);
  };

  // Handle sort change
  const handleSortChange = async (key: string) => {
    await onSortChange(key);
  };

  return (
    <div className="w-full bg-white rounded-t-lg py-4 shadow-lg px-4 mx-auto">
      <div className="flex flex-wrap justify-between items-center space-y-4 md:space-y-0">
        {/* Items per page selector */}
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <label
            className="text-gray-800 text-md font-medium"
            htmlFor="itemsPerPage"
          >
            Items per page
          </label>
          <select
            id="itemsPerPage"
            value={pageSize}
            onChange={handlePageSizeChange}
            className="border border-gray-300 rounded-md py-0.5 px-2 text-gray-700 focus:outline-none"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        {/* Search input */}
        {/* <div className="flex items-center w-full md:w-auto">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search by name"
            className="border border-gray-300 rounded-lg py-2 px-4 text-gray-700 focus:outline-none w-full"
          />
        </div> */}

        {/* Sort selector */}
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <select
            value={sortKey + "-" + sortOrder}
            onChange={(e) => handleSortChange(e.target.value)}
            className="border border-gray-300 rounded-lg py-2 px-4 text-gray-700 focus:outline-none"
          >
            {sortOptions.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilteringAndPaging;
