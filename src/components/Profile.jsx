import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUserAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import { FaCircleUser, FaDownload, FaDiscourse } from "react-icons/fa6";
import { RiHome2Fill } from "react-icons/ri";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserLogeddIn, setIsUserLogeddIn] = useState(false);
  const navigate = useNavigate();
const token = localStorage.getItem("token");
  // Check token
  useEffect(() => {
    const token = localStorage.getItem("token");  
    if (token) 
       setIsUserLogeddIn(true);
      fetchUserData();
  }, []);

  // Fetch user profile
  const fetchUserData = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/user/profile`, {
        withCredentials: true,
        headers: 
        { Authorization: `Bearer ${token}` },
      });
      setUserData(res.data.user);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load profile");
    }
  };

  const handleLogout = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/user/logout`, {
        withCredentials: true,
      });
      toast.success(res.data.message);
      localStorage.removeItem("token");
      setIsUserLogeddIn(false);
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex">
      {/* Sidebar Toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-20 text-3xl text-gray-800"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <HiX /> : <HiMenu />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-gray-100 w-64 p-5 transform z-10 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static`}
      >
        <div className="flex items-center flex-col mb-10 mt-10 md:mt-0">
          <FaCircleUser className="rounded-full h-12 w-12 text-blue-600 mt-3" />
          <h2 className="text-lg font-semibold mt-4">
            {userData ? `${userData.firstName} ${userData.lastName}` : "I'm User"}
          </h2>
        </div>
        <nav>
          <ul>
            <li className="mb-4">
              <Link to="/" className="flex items-center">
                <RiHome2Fill className="mr-2" /> Home
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/courses" className="flex items-center ">
                <FaDiscourse className="mr-2" /> Courses
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/purchases" className="flex items-center">
                <FaDownload className="mr-2" /> Purchases
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/profile" className="flex items-center text-blue-500">
                <FaUserAlt className="inline-block mr-2" />Profile
              </Link>
            </li>
            <li>
              {isUserLogeddIn ? (
                <button onClick={handleLogout} className="flex items-center">
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
      </aside>

      {/* Profile Info */}
      <main className="w-full bg-white p-10">
        <h1 className="sm:text-2xl text-xl font-bold">
          <FaUserAlt className="inline-block mr-2" /> User Profile
        </h1>
        <br />
        <div className=" sm:w-85 w-72 rounded overflow-hidden shadow-lg sm:ml-0 ml-[-10px] bg-white border border-gray-200 h-60 mb-6">
          <div className="p-5 mt-4">
            <p className="text-gray-600 text-sm mt-2">
              <b>First Name :</b> {userData?.firstName}
            </p>
            <p className="text-gray-600 text-sm mt-2">
              <b>Last Name :</b> {userData?.lastName}
            </p>
            <p className="text-gray-600 text-sm mt-2">
              <b>Email :</b> {userData?.email}
            </p>
            <p className="text-gray-600 text-sm mt-2">
              <b>Date :</b>{" "}
              {userData?.createdAt
                ? new Date(userData.createdAt).toLocaleDateString()
                : ""}
            </p>
             <p className="text-gray-600 text-sm mt-2">
              <b className={isUserLogeddIn ? "text-green-500" : "text-red-500"}>Login : {isUserLogeddIn? "Success" : "Failed"} </b>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
