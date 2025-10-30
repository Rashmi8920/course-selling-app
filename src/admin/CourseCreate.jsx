import axios from 'axios';
import React, { useState,useEffect } from 'react'
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

const CourseCreate = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const navigate=useNavigate();

    const changePhotoHandle=(e)=>{
       const file=e.target.files[0]
       const reader=new FileReader();
       reader.readAsDataURL(file)
       reader.onload=()=>{
        setImagePreview(reader.result)
        setImage(file)
       }
    }

    const handlecreateCourse=async(e)=>{
      e.preventDefault();
      const formData=new FormData ()
      formData.append("title",title)
  formData.append("price",price)
 formData.append("description",description)
 formData.append("image",image)

 const admin=JSON.parse(localStorage.getItem("admin"))
 const token=admin.token;
 if(!token){
  navigate("/admin/login")
  return;
 }
try {
  const response=await axios.post(
    `${import.meta.env.VITE_BASE_URL}/api/v1/course/create`,formData,{
    headers:{
      Authorization: `Bearer ${token}`
    },
      withCredentials: true,
  })
  console.log(response.data)
  toast.success(response.data.message ||"Course Created successfully")
setTimeout(()=>{
  navigate('/admin/our-courses');
},2000)
  setTitle("");
  setPrice("");
  setImage("");
  setDescription("");
  setImagePreview("");
} catch (error) {
  console.log(error,"creeted error")
  toast.error(error?.response?.data?.errors || "Error in creating course")
}
    }
  return (
    <>
   <div>
      <div className="min-h-screen  py-10 md:ml--50">
         <Link
        className="bg-orange-950 py-2 px-4 sm:ml-110 ml-3 rounded-lg text-white hover:bg-green-500 hover:text-black  duration-300"
        to={"/admin/dashboard"}
      >
        Go to dashboard
      </Link>
        <div className="max-w-4xl mx-auto p-6 border  rounded-lg shadow-lg mt-5 sm:ml-110 ml-3">
          <h3 className="text-2xl font-semibold mb-8">Create Course</h3>

          <form onSubmit={handlecreateCourse} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-lg">Title</label>
              <input
                type="text"
                placeholder="Enter your course title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400   rounded-md outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-lg">Description</label>
              <input
                type="text"
                placeholder="Enter your course description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400   rounded-md outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-lg">Price</label>
              <input
                type="number"
                placeholder="Enter your course price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400   rounded-md outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-lg">Course Image</label>
              <div className="flex items-center justify-center">
                <img
                  src={imagePreview ? `${imagePreview}` : "/imgPL.webp"}
                  alt="Image"
                  className="w-full max-w-sm h-auto rounded-md object-cover"
                />
              </div>
              <input
                type="file"
                onChange={changePhotoHandle}
                className="w-full px-3 py-2 border border-gray-400   rounded-md outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200"
            >
              Create Course
            </button>
          </form>
        </div>
      </div>
    </div>
    </>
  )
}

export default CourseCreate
