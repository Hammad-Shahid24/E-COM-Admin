import { FC } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
// import { Order, Product } from "../../types/Shopping";
import ComponentHeader from "../../shared/ComponentHeader";
import Loading from "../../shared/Loading";

const OrderDetails: FC = () => {
  const { order, loading } = useSelector((state: RootState) => state.orders);

  if (loading) {
    return (
      <div className="p-4 flex justify-center bg-white rounded-lg shadow-md">
        <Loading />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-4 flex justify-center bg-white rounded-lg shadow-md">
        <p className="text-gray-700">Order not found.</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <ComponentHeader heading={`Order Details - ${order.id}`} />
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Customer Information</h3>
        <p className="text-gray-700">Name: {order.userId}</p>

        <h3 className="text-lg font-semibold mt-4 mb-2">Shipping Address</h3>
        {/* <p className="text-gray-700">{order.addressLine1}</p>
        {order.addressLine2 && <p className="text-gray-700">{order.addressLine2}</p>}
        <p className="text-gray-700">
          {order.city}, {order.state}, {order.country} - {order.postalCode}
        </p> */}
        {/* <p className="text-gray-700">Contact: {order.contactName}</p> */}
        {/* <p className="text-gray-700">Phone: {order.contactPhone}</p> */}

        <h3 className="text-lg font-semibold mt-4 mb-2">Order Items</h3>
        <ul className="list-disc list-inside">
          {order.orderItems.map(({ product, quantity }) => (
            <li key={product.id} className="text-gray-700">
              {product.name} - {quantity} x ${product.price}
            </li>
          ))}
        </ul>

        <h3 className="text-lg font-semibold mt-4 mb-2">Order Summary</h3>
        <p className="text-gray-700">Total Amount: ${order.total}</p>
        {order.voucherId && <p className="text-gray-700">Voucher Applied: {order.voucherId}</p>}
        {/* {order.discountAmount && <p className="text-gray-700">Discount: ${order.discountAmount}</p>} */}
        <p className="text-gray-700">Order Status: {order.status}</p>
        <p className="text-gray-700">Order Date: {new Date(order.createdAt).toLocaleString()}</p>
        <p className="text-gray-700">Last Updated: {new Date(order.updatedAt).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default OrderDetails;