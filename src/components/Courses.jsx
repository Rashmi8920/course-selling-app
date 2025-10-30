import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCircleUser } from "react-icons/fa6";
import { RiHome2Fill } from "react-icons/ri";
import { FaDiscourse } from "react-icons/fa";
import { FaDownload } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { HiMenu, HiX } from "react-icons/hi";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { FaUserAlt } from "react-icons/fa";
// import { FaCircleUser } from "react-icons/fa6";

const Courses = () => {
  const [allCourses, setAllCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserLogeddIn, setIsUserLogeddIn] = useState(false);

  const navigate = useNavigate();

  // Check token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsUserLogeddIn(true);
    } else {
      setIsUserLogeddIn(false);
      setLoading(false); // stop loader when not logged in
    }
  }, []);
  // Fetch courses once
  useEffect(() => {
    const fetchCourses = async () => {
      if (!isUserLogeddIn) return; // don't fetch if not logged in
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/v1/course/courses`,
          { withCredentials: true }
        );
        setAllCourses(res.data.getCourses); // store full list
        setFilteredCourses(res.data.getCourses); // show all initially
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchCourses();
  }, [isUserLogeddIn]);

  // Search function
  const handleSearch = () => {
    if (!searchTerm.trim()) {
      toast.error("Please enter a course title to search");
      setSearchPerformed(false);
      return;
    }
    const filtered = allCourses.filter((course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filtered.length === 0) {
      toast.error("No courses found");
    }
    setFilteredCourses(filtered);
    setSearchPerformed(filtered.length > 0);
  };

  // Go back to full list
  const handleGoBack = () => {
    setSearchTerm("");
    setFilteredCourses(allCourses);
    setSearchPerformed(false);
  };

  // Logout
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

  // Sidebar toggle
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleBuy = (courseId) => navigate(`/buy/${courseId}`);

  return (
    <div className="flex">
      {/* Hamburger for mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-20 text-3xl text-gray-800"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <HiX /> : <HiMenu />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-gray-100 w-64 p-5 transform z-10 transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 md:static`}
      >
        <div className="flex items-center flex-col mb-10 mt-10 md:mt-0">
<Link to="/profile">
          <FaCircleUser className="rounded-full h-12 w-12 text-blue-600 mt-3" />
</Link>
          <h2 className="text-lg font-semibold mt-4">I'm User</h2>
        </div>
        <nav>
          <ul>
            <li className="mb-4">
              <Link to="/" className="flex items-center">
                <RiHome2Fill className="mr-2" /> Home
              </Link>
            </li>
            <li className="mb-4">
              <Link to="#" className="flex items-center text-blue-500">
                <FaDiscourse className="mr-2" /> Courses
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/purchases" className="flex items-center">
                <FaDownload className="mr-2" /> Purchases
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/profile" className="flex items-center">
             <FaUserAlt className="inline-block mr-2" /> Profile
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

      {/* Main content */}
      <main className="ml-0 md:ml- w-full bg-white p-10 ">
        {/* Header */}
        <header className="flex justify-between gap-2 items-center mb-10">
          <h1 className="sm:text-2xl text-xl font-bold sm:ml-0 ml-[-30px]">
            Courses
          </h1>
          <div className="flex items-center space-x-3">
            <div className="flex items-center sm:mr-20">
              <input
                type="text"
                placeholder="Type here to search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="border border-gray-300 rounded-l-full px-2 sm:px-4 py-2 h-10 focus:outline-none"
              />
              <button
                onClick={handleSearch}
                className="h-10 border border-gray-300 rounded-r-full px-1 sm:px-4 flex items-center justify-center"
              >
                <FiSearch className="text-xl text-gray-600" />
              </button>
            </div>
          </div>
        </header>

        {/* Go Back button */}
        <button
          onClick={handleGoBack}
          disabled={!searchPerformed}
          className={`text-white p-2 md:py-3 rounded font-semibold duration-300
    ${!searchPerformed
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black hover:bg-orange-500 hover:text-white"
            }`}
        >
          👈 GO BACK
        </button>
        <br /> <br />
        {/* Courses list */}
        <div className="overflow-y-auto h-[75vh]">
          {loading ? (
            <p className="text-center text-gray-500 text-3xl mt-10">
              Loading...
            </p>
          ) : !isUserLogeddIn ? (
            <p className="text-center text-red-600 text-lg mt-10">
              Please login to view available courses 🔒
            </p>
          ) : filteredCourses.length === 0 ? (
            <p className="text-center text-gray-500">No courses found</p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <div
                  key={course._id}
                  className="border border-gray-300 rounded-lg p-4 shadow-sm"
                >
                  <img
                    src={course.image.url}
                    alt={course.title}
                    className="rounded mb-4 sm:h-55 sm:w-[40vw] w-90"
                  />
                  <h2 className="font-bold text-lg mb-2">{course.title}</h2>
                  <p className="text-gray-600 mb-4">
                    {course.description.length > 100
                      ? `${course.description.slice(0, 100)}...`
                      : course.description}
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-xl">₹{course.price}</span>
                    <span className="text-red-700">20% off</span>
                  </div>
                  <button
                    onClick={() => handleBuy(course._id)}
                    className="bg-orange-500 w-full text-white px-4 py-2 rounded-lg hover:bg-blue-900 duration-300"
                  >
                    Buy Now
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Courses;
