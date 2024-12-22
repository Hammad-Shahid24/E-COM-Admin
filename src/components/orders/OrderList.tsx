import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ComponentHeader from "../../shared/ComponentHeader";
import { FaEdit, FaTrash, FaRegEye } from "react-icons/fa"; // Importing icons
import { Tooltip } from "react-tooltip";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../app/store";
import {
  fetchAllOrders,
  removeOrder,
  resetOrder,
  // resetOrders,
  setOrderById,
} from "../../redux/orders/orderSlice";
import { Order } from "../../types/Shopping";
import { toast } from "react-toastify";
import { clearError } from "../../redux/orders/orderSlice";
import Loading from "../../shared/Loading";
import Swal from "sweetalert2";
import Pagination from "../../shared/pagination";
import FiltrationAndPaging from "../../shared/FilteringAndPaging";
// import OrderActionsModal from "./ActionsModal";

const OrdersList: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { orders, loading, error, totalOrders } = useSelector(
    (state: RootState) => state.orders
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (order: Order) => {
    dispatch(setOrderById(order.id!));
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    dispatch(resetOrder());
    setIsModalOpen(false);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageOrders, setCurrentPageOrders] = useState<Order[]>([]);
  const pageSizeOptions = [2, 3, 4];
  const [pageSize, setPageSize] = useState(pageSizeOptions[0]);
  const totalPages = Math.ceil(totalOrders! / pageSize);

  const [sortKey, setSortKey] = useState<keyof Order | string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Fetch orders when the component mounts
  useEffect(() => {
    if (orders.length === 0) {
      dispatch(fetchAllOrders({ pageSize, sortField: sortKey, sortOrder }));
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

  // Handle deletion of an order with confirmation
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
        console.log("Deleting order with id:", id);
        dispatch(removeOrder(id))
          .then(() => {
            Swal.fire("Deleted!", "Your order has been deleted.", "success");
          })
          .catch((error) => {
            Swal.fire(
              "Error!",
              "There was an error deleting the order.",
              error
            );
          });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelled", "Your order is safe :)", "error");
      }
    });
  };

  // Handle the editing of an order
  const handleEdit = (order: Order) => {
    // Navigate to the edit page
    navigate(`edit/${order.id}`, {
      state: { order }, // Passing the order data to the edit page
    });
  };

  // Handle the viewing of an order
  const handleView = (order: Order) => {
    Swal.fire({
      title: `Order #${order.id}`,
      text: `Customer: ${order.userId}\nTotal: $${order.totalAmount}`,
      showCloseButton: true,
      showCancelButton: false,
      showConfirmButton: false,
      padding: "1rem",
    });
  };

  if (loading) {
    return (
      <div>
        <ComponentHeader heading="Order List" />
        <div className="p-4 flex justify-center bg-white rounded-lg shadow-md">
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <>
      <ComponentHeader heading="Order List" />
      <FiltrationAndPaging
        items={orders}
        pageSizeOptions={pageSizeOptions}
        pageSize={pageSize}
        setPageSize={setPageSize}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        fetchMore={async (count: number) => {
          await dispatch(fetchAllOrders({ pageSize: count }));
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
            key: "customerName-desc",
            label: "Customer Name (Z-A)",
          },
          {
            key: "customerName-asc",
            label: "Customer Name (A-Z)",
          },
          {
            key: "total-desc",
            label: "Total (High to Low)",
          },
          {
            key: "total-asc",
            label: "Total (Low to High)",
          },
        ]}
        onSortChange={async (key: string) => {
          const [field, order] = key.split("-");
          setSortKey(field);
          setSortOrder(order as "asc" | "desc");
          // dispatch(resetOrders());
          setCurrentPage(1);
          await dispatch(
            fetchAllOrders({
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
                Order ID
              </th>
              <th className="px-4 py-2 bg-gray-50 text-left text-base font-semibold text-gray-900 w-1/4">
                Customer Name
              </th>
              <th className="px-4 py-2 bg-gray-50 text-left text-base font-semibold text-gray-900 w-1/4">
                Total
              </th>
              <th className="px-4 py-2 bg-gray-50 text-center text-base font-semibold text-gray-900 w-1/4">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="mt-4">
            {currentPageOrders.map((order, index) => {
              const rowClass = index % 2 === 0 ? "bg-gray-100" : "bg-white";

              return (
                <tr
                  key={index}
                  className={`${rowClass} hover:bg-gray-200`} // Add hover effect here
                >
                  <td className="py-2 px-4 w-1/3">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-700 font-medium">
                        {order.id}
                      </span>
                    </div>
                  </td>

                  <td className="py-1 px-4 w-1/4">
                    <span className="text-sm text-gray-700 font-medium">
                      ${order.totalAmount}
                    </span>
                  </td>
                  <td className="py-1 pr-4 w-1/4">
                    <div className="flex gap-x-1 justify-start">
                      {/* Actions Button with Tooltip */}
                      <button
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content="Actions"
                        onClick={() => handleOpenModal(order)} // Passing order to the view handler
                        className="flex items-center px-3 py-1.5 text-sm text-teal-800 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <FaRegEye />
                      </button>

                      {/* View Button with Tooltip */}
                      <button
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content="View Order"
                        onClick={() => handleView(order)} // Passing order to the view handler
                        className="flex items-center px-3 py-1.5 text-sm text-gray-500 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <FaRegEye />
                      </button>

                      {/* Edit Button with Tooltip */}
                      <button
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content="Edit"
                        onClick={() => handleEdit(order)} // Passing order to the edit handler
                        className="flex items-center px-3 py-1.5 text-sm text-blue-500 hover:bg-blue-100 rounded-lg transition-colors"
                      >
                        <FaEdit />
                      </button>

                      {/* Delete Button with Tooltip */}
                      <button
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content="Delete"
                        onClick={() => order.id && handleDelete(order.id)}
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
          items={orders}
          pageSize={pageSize}
          totalItems={totalOrders as number}
          totalPages={totalPages}
          setCurrentPageItems={setCurrentPageOrders}
          fetchMore={async () => {
            await dispatch(
              fetchAllOrders({ pageSize, sortField: sortKey, sortOrder })
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
        {/* {isModalOpen && <OrderActionsModal onClose={handleCloseModal} />} */}
      </div>
    </>
  );
};

export default OrdersList;
