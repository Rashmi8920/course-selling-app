import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaDiscourse, FaDownload } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { RiHome2Fill } from "react-icons/ri";
import { HiMenu, HiX } from "react-icons/hi"; // Icons for sidebar toggle
import { Link, useNavigate } from "react-router-dom";
import { FaUserAlt } from "react-icons/fa";

const Purchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [isUserLogeddIn, setIsUserLogeddIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to toggle sidebar
  const navigate = useNavigate()
  console.log( "purchases clg",purchases)
  //  Token
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setIsUserLogeddIn(true);
    } else {
      setIsUserLogeddIn(false);
    }
  }, []);

  //  Fetch courses from backend
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user.token;
    const fetchPurchases = async () => {
      if (!token) {
        setErrorMessage("please login to purchase the course")
        navigate('/login');
      }
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/v1/user/purchases`, 
          
          {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });   
        setPurchases(response.data.courseData);
        console.log(response.data.courseData)
      } catch (error) {
        setErrorMessage( "Failed to fetch purchase data");
      }
    };
    fetchPurchases();
  }, []);

  //handle logout function
  const handlelogout = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/user/logout`,
        {
          withCredentials: true,
        })
      toast.success(response.data.message)
      //  localStorage se  remove token
      localStorage.removeItem("token");
      setIsUserLogeddIn(false)
      navigate("/login");
    } catch (error) {
      console.log(error, "error in user logout")
      toast.error(error.response.data.message || "error in logout")
    }
  }

  // Toggle sidebar for mobile devices
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
   <>
     <div className="flex h-screen">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 bg-gray-100 p-5 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out w-64 z-50`}
      >
        <nav>
          <ul className="mt-16 md:mt-0">
            <li className="mb-4">
              <Link to="/" className="flex items-center">
                <RiHome2Fill className="mr-2" /> Home
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/courses" className="flex items-center">
                <FaDiscourse className="mr-2" /> Courses
              </Link>
            </li>
            <li className="mb-4">
              <a href="#" className="flex items-center text-blue-500">
                <FaDownload className="mr-2" /> Purchases
              </a>
            </li>
            <li className="mb-4">
              <Link to="/profile" className="flex items-center ">
                <FaUserAlt className="inline-block mr-2" /> profile
              </Link>
            </li>
            <li>
              {isUserLogeddIn ? (
                <button onClick={handlelogout} className="flex items-center">
                  <IoLogOut className="mr-2" /> Logout
                </button>
              ) : (
                <Link to="/login" className="flex items-center">
                  <IoLogIn className="mr-2" /> Login
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </div>

      {/* Sidebar Toggle Button (Mobile) */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-black text-white p-2 rounded-lg"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? (
          <HiX className="text-2xl" />
        ) : (
          <HiMenu className="text-2xl" />
        )}
      </button>

      {/* Main Content */}
      <div
        className={`flex-1 p-8 bg-gray-50 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        } md:ml-64`}
      >
        <h2 className="text-xl font-semibold mt-6 md:mt-0 mb-6">
          My Purchases
        </h2>

        {/* Error message */}
        {errorMessage && (
          <div className="text-red-500 text-center mb-4">{errorMessage}</div>
        )}

        {/* Render purchases */}
        {purchases.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {purchases.map((purchase, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 mb-6"
              >
                <div className="flex flex-col items-center space-y-4">
                  {/* Course Image */}
                  <img
                    className="rounded-lg  w-48 object-cover"
                    src={
                      purchase.image?.url || "https://via.placeholder.com/200"
                    }
                    alt={purchase.title}
                  />
                  <div className="text-center">
                    <h3 className="text-lg font-bold ">{purchase.title}</h3>
                    <p className="text-gray-500">
                      {purchase.description.length > 100
                        ? `${purchase.description.slice(0, 100)}...`
                        : purchase.description}
                    </p>
                    <span className="text-green-700 font-semibold text-sm">
                      ₹{purchase.price} only
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">You have no purchases yet.</p>
        )}
      </div>
    </div>
   </>
  )
}

export default Purchases
