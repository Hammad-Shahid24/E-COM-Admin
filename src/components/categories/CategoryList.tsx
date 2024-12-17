import { FC, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ComponentHeader from "../../shared/ComponentHeader";
import { FaEdit, FaTrash } from "react-icons/fa"; // Importing icons
import { Tooltip } from "react-tooltip";
import NewCategory from "./NewCategory"; // Assuming NewCategory component handles both create and update

interface Category {
  id: string;
  name: string;
  imageUrl: string;
}

const CategoryList: FC = () => {
  const navigate = useNavigate();

  // Data for categories
  const categories: Category[] = useMemo(
    () => [
      {
        id: "1",
        name: "Electronics",
        imageUrl: "https://remosnextjs.vercel.app/images/products/51.png",
      },
      {
        id: "2",
        name: "Fashion",
        imageUrl: "	https://remosnextjs.vercel.app/images/products/52.png",
      },
      {
        id: "3",
        name: "Home & Garden",
        imageUrl: "https://remosnextjs.vercel.app/images/products/56.png",
      },
      {
        id: "4",
        name: "Health & Beauty",
        imageUrl: "https://remosnextjs.vercel.app/images/products/57.png",
      },
    ],
    []
  );

  // Handle deletion of a category with confirmation
  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      console.log(`Category with id: ${id} deleted`);
    }
  };

  // Handle the editing of a category
  const handleEdit = (category: Category) => {
    // Navigate to the edit page
    navigate(`edit/${category.id}`, {
      state: { category }, // Passing the category data to the edit page
    });
  };

  return (
    <>
      <ComponentHeader heading="Category List" />
      <div className="p-4 bg-white rounded-lg shadow-md">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-4 py-2 bg-gray-50 text-left text-base font-semibold text-gray-900 w-1/3">
                Category Name
              </th>
              <th className="px-4 py-2 bg-gray-50 text-left text-base font-semibold text-gray-900 w-1/4">
                Items Cum. Qty
              </th>
              <th className="px-4 py-2 bg-gray-50 text-left text-base font-semibold text-gray-900 w-1/4">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, index) => {
              const rowClass = index % 2 === 0 ? "bg-gray-100" : "bg-white";

              return (
                <tr
                  key={category.id}
                  className={`${rowClass} hover:bg-gray-200`} // Add hover effect here
                >
                  <td className="py-2 px-4 w-1/3">
                    <div className="flex items-center">
                      <img
                        src={category.imageUrl}
                        alt={category.name}
                        className="w-12 h-12 mr-4"
                      />
                      <span className="text-sm text-gray-700 font-medium">
                        {category.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-1 px-4 w-1/4">
                    <span className="text-sm text-gray-700 font-medium">0</span>
                  </td>
                  <td className="py-1 px-4 w-1/4">
                    <div className="flex space-x-2 justify-start">
                      {/* Edit Button with Tooltip */}
                      <button
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content="Edit"
                        onClick={() => handleEdit(category)} // Passing category to the edit handler
                        className="flex items-center px-3 py-1.5 text-sm text-blue-500 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <FaEdit />
                      </button>

                      {/* Delete Button with Tooltip */}
                      <button
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content="Delete"
                        onClick={() => handleDelete(category.id)}
                        className="flex items-center px-3 py-1.5 text-sm text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <Tooltip
          id="my-tooltip"
          style={{
            backgroundColor: "#d1d5db",
            color: "#374151",
            borderRadius: "0.25rem",
            padding: "0.5rem",
            fontWeight: "500",
          }}
        />
      </div>
    </>
  );
};

export default CategoryList;
