import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

const OurCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate=useNavigate();
 
  const admin = JSON.parse(localStorage.getItem("admin"));
  const token = admin.token;
  // console.log("Admin token on ourcourse.jsx:", token);
  if(!token){
    toast.error("please login to access courses")
  navigate('/admin/login')
  }

  //  Fetch courses from backend
  useEffect(() => {
    const FetchCourses = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/v1/course/courses`,
          {
            withCredentials: true,
          }
        )
        console.log(response.data.getCourses)
        setCourses(response.data.getCourses)
        setLoading(false)
      } catch (error) {
        console.log(error, "error in fetchcourses")
      }
    }
    FetchCourses();
  }, [])

  //delete course code
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/v1/course/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true,
        }
      );
      toast.success(response?.data?.message)
      const UpdateCourse = courses.filter((course) => course._id !== id)
      setCourses(UpdateCourse);
    } catch (error) {
      console.log("error in deleting coutrse", error)
      toast.error(error?.response?.data?.errors || "error in delete course")
    }
  }

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
<>
 <div className="bg-gray-100 p-8 space-y-4">
      <h1 className="text-3xl font-bold text-center mb-8">Our Courses</h1>
      <Link
        className="bg-orange-950 py-2 px-4 rounded-lg text-white hover:bg-green-500 hover:text-black  duration-300"
        to={"/admin/dashboard"}
      >
        Go to dashboard
      </Link>
      <br /> <br />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course._id} className="bg-white shadow-md rounded-lg p-4">
            {/* Course Image */}
            <img
              src={course?.image?.url}
              alt={course.title}
              className="h-40 w-full object-cover rounded-t-lg"
            />
            {/* Course Title */}
            <h2 className="text-xl font-semibold mt-4 text-gray-800">
              {course.title}
            </h2>
            {/* Course Description */}
            <p className="text-gray-600 mt-2 text-sm">
              {course.description.length > 200
                ? `${course.description.slice(0, 200)}...`
                : course.description}
            </p>
            {/* Course Price */}
            <div className="flex justify-between mt-4 text-gray-800 font-bold">
              <div>
                {" "}
                ₹{course.price}{" "}
                {/* <span className="line-through text-gray-500">₹300</span> */}
              </div>
              <div className="text-green-600 text-sm mt-2">10 % off</div>
            </div>

            <div className="flex justify-between">
              <Link
                to={`/admin/update-course/${course._id}`}
                className="bg-orange-500 text-white py-2 px-4 mt-4 rounded hover:bg-blue-600"
              >
                Update
              </Link>
              <button
                onClick={() => handleDelete(course._id)}
                className="bg-red-500 text-white py-2 px-4 mt-4 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
</>
  )
}

export default OurCourses
