import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ComponentHeader from "../../shared/ComponentHeader";
import { FaEdit, FaTrash, FaRegEye } from "react-icons/fa"; // Importing icons
import { PiPlugsFill } from "react-icons/pi";
import { Tooltip } from "react-tooltip";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../app/store";
import {
  fetchAllProducts,
  removeProduct,
  resetProduct,
  resetProducts,
  setProductById,
} from "../../redux/products/productSlice";
import { Product } from "../../types/Shopping";
import { toast } from "react-toastify";
import { clearError } from "../../redux/products/productSlice";
import Loading from "../../shared/Loading";
import Swal from "sweetalert2";
import Pagination from "../../shared/pagination";
import FiltrationAndPaging from "../../shared/FilteringAndPaging";
import ProductActionsModal from "./ActionsModal";

const ProductList: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error, totalProducts } = useSelector(
    (state: RootState) => state.products
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (product: Product) => {
    dispatch(setProductById(product.id!));
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    dispatch(resetProduct());
    setIsModalOpen(false);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageProducts, setCurrentPageProducts] = useState<Product[]>([]);
  const pageSizeOptions = [2, 3, 4];
  const [pageSize, setPageSize] = useState(pageSizeOptions[0]);
  const totalPages = Math.ceil(totalProducts! / pageSize);

  const [sortKey, setSortKey] = useState<keyof Product | string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Fetch products when the component mounts
  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchAllProducts({ pageSize, sortField: sortKey, sortOrder }));
    }
  }, []);

  // Show a toast message if an error occurs
  useEffect(() => {
    if (error && error.length > 0) {
      toast.error(error);

      // Clear the error after showing the toast
      return () => {
        dispatch(clearError()); // Clear the error message when the component is unmounted
      };
    }
  }, [error, dispatch]);

  // Handle deletion of a product with confirmation
  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log("Deleting product with id:", id);
        dispatch(removeProduct(id))
          .then(() => {
            Swal.fire("Deleted!", "Your product has been deleted.", "success");
          })
          .catch((error) => {
            Swal.fire(
              "Error!",
              "There was an error deleting the product.",
              error
            );
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelled", "Your product is safe :)", "error");
      }
    });
  };

  // Handle the editing of a product
  const handleEdit = (product: Product) => {
    // Navigate to the edit page
    navigate(`edit/${product.id}`, {
      state: { product }, // Passing the product data to the edit page
    });
  };

  // Handle the viewing of a product
  const handleView = (product: Product) => {
    Swal.fire({
      imageUrl: product.images[0],
      imageWidth: 400,
      imageHeight: 300,
      imageAlt: product.name,
      showCloseButton: false,
      showCancelButton: false,
      showConfirmButton: false,
      padding: 0,
    });
  };

  if (loading) {
    return (
      <div>
        <ComponentHeader heading="Product List" />
        <div className="p-4 flex justify-center bg-white rounded-lg shadow-md">
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <>
      <ComponentHeader heading="Product List" />
      <FiltrationAndPaging
        items={products}
        pageSizeOptions={pageSizeOptions}
        pageSize={pageSize}
        setPageSize={setPageSize}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        fetchMore={async (count: number) => {
          await dispatch(fetchAllProducts({ pageSize: count }));
        }}
        sortKey={sortKey}
        sortOrder={sortOrder}
        sortOptions={[
          {
            key: "createdAt-desc",
            label: "Date Created (New to Old)",
          },
          {
            key: "createdAt-asc",
            label: "Date Created (Old to New)",
          },
          {
            key: "name-desc",
            label: "Name (Z-A)",
          },
          {
            key: "name-asc",
            label: "Name (A-Z)",
          },
          {
            key: "price-desc",
            label: "Price (High to Low)",
          },
          {
            key: "price-asc",
            label: "Price (Low to High)",
          },
          {
            key: "stock-desc",
            label: "Stock (High to Low)",
          },
          {
            key: "stock-asc",
            label: "Stock (Low to High)",
          },
        ]}
        onSortChange={async (key: string) => {
          const [field, order] = key.split("-");
          setSortKey(field);
          setSortOrder(order as "asc" | "desc");
          dispatch(resetProducts());
          setCurrentPage(1);
          await dispatch(
            fetchAllProducts({
              pageSize,
              sortField: field,
              sortOrder: order as "asc" | "desc",
            })
          );
        }}
      />

      <div className="p-4 bg-white rounded-b-lg shadow-md">
        <table className="min-w-full">
          <thead className="mb-4">
            <tr>
              <th className="px-4 py-2 bg-gray-50 text-left text-base font-semibold text-gray-900 w-1/3">
                Product Name
              </th>
              <th className="px-4 py-2 bg-gray-50 text-left text-base font-semibold text-gray-900 w-1/4">
                Price
              </th>
              <th className="px-4 py-2 bg-gray-50 text-left text-base font-semibold text-gray-900 w-1/4">
                Stock
              </th>
              <th className="px-4 py-2 bg-gray-50 text-center text-base font-semibold text-gray-900 w-1/4">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="mt-4">
            {currentPageProducts.map((product, index) => {
              const rowClass = index % 2 === 0 ? "bg-gray-100" : "bg-white";

              return (
                <tr
                  key={index}
                  className={`${rowClass} hover:bg-gray-200`} // Add hover effect here
                >
                  <td className="py-2 px-4 w-1/3">
                    <div className="flex items-center">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-12 h-12 mr-4"
                      />
                      <span className="text-sm text-gray-700 font-medium">
                        {product.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-1 px-4 w-1/4">
                    <span className="text-sm text-gray-700 font-medium">
                      ${product.price}
                    </span>
                  </td>
                  <td className="py-1 px-4 w-1/4">
                    <span className="text-sm text-gray-700 font-medium">
                      {product.stock}
                    </span>
                  </td>
                  <td className="py-1 pr-4 w-1/4">
                    <div className="flex gap-x-1 justify-start">
                      {/* Actions Button with Tooltip */}
                      <button
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content="Actions"
                        onClick={() => handleOpenModal(product)} // Passing product to the view handler
                        className="flex items-center px-3 py-1.5 text-sm text-teal-800 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <PiPlugsFill />
                      </button>

                      {/* View Button with Tooltip */}
                      <button
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content="View Image"
                        onClick={() => handleView(product)} // Passing product to the view handler
                        className="flex items-center px-3 py-1.5 text-sm text-gray-500 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <FaRegEye />
                      </button>

                      {/* Edit Button with Tooltip */}
                      <button
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content="Edit"
                        onClick={() => handleEdit(product)} // Passing product to the edit handler
                        className="flex items-center px-3 py-1.5 text-sm text-blue-500 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <FaEdit />
                      </button>

                      {/* Delete Button with Tooltip */}
                      <button
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content="Delete"
                        onClick={() => product.id && handleDelete(product.id)}
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
        <Pagination
          items={products}
          pageSize={pageSize}
          totalItems={totalProducts as number}
          totalPages={totalPages}
          setCurrentPageItems={setCurrentPageProducts}
          fetchMore={async () => {
            await dispatch(
              fetchAllProducts({ pageSize, sortField: sortKey, sortOrder })
            );
          }}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
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
        {isModalOpen && <ProductActionsModal onClose={handleCloseModal} />}
      </div>
    </>
  );
};

export default ProductList;
