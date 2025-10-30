import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaRegCalendarAlt, FaUserAlt } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]); // ✅ initialize as array
  const [loading, setLoading] = useState(true);
  console.log(orders,"odres")

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.token;

      if (!token) {
        toast.error("Please log in to view your orders");
        setLoading(false);
        return;
      }

      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/order`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      console.log("Fetched orders:", res.data.orders); 

      setOrders(res.data.orders || []); // always set an array
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error(error.response?.data?.errors || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500 mt-4">Loading orders...</p>;
  }

  return (
    <>
    <h1 className="sm:text-5xl text-3xl font-bold text-center sm:mt-3 mt-8 mb-8">All orders</h1>
      <Link
        className="bg-orange-950 py-2 px-4 ml-9 rounded-lg text-white hover:bg-green-500 hover:text-black  duration-300"
        to={"/admin/dashboard"}
      >
        Go to dashboard
      </Link>
      <br /> 
    <div className="sm:flex gap-12 mt-6 w-full sm:mb-0 ml-8">
      {Array.isArray(orders) && orders.length === 0 ? (
        <p className="text-gray-500 text-lg ml-4">No orders found</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="sm:w-85 w-70 rounded overflow-hidden shadow-lg bg-white border border-gray-200 sm:h-80 h-80 p- mb-6"
          >
            <div className="p-5">
              <h2 className="text-xl font-semibold text-gray-800">
                Title : {order.title || "N/A"}
              </h2>
              <p className="text-gray-600 text-sm mt-2">
                <FaRegCalendarAlt className="inline-block mr-2" />
                <b>Date :</b>{" "}
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
              <p className="text-gray-600 text-sm mt-2">
                <FaUserAlt className="inline-block mr-2" />
               <b> User :</b> {order.email || "N/A"}
              </p>
              <p className="text-green-500 font-bold text-sm mt-2">
                Status : {order.status || "N/A"}
              </p>
              <p className="text-gray-600 text-sm mt-2 ">
          <b>Payment ID :</b> {order.paymentId || "N/A"}
              </p>
              <p className="text-gray-600 text-sm mt-2">
                <b>Amount :</b> ₹{order.amount || "N/A"}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
    </>
  );
};

export default Orders;
