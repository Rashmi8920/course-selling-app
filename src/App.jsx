import React from "react";
import axios from "axios";

import { Toaster } from "react-hot-toast";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Courses from "./components/Courses";
import Buy from "./components/Buy";
import Purchases from "./components/Purchases";
//admin route import==========
import AdminSignup from "./admin/AdminSignup";
import AdminLogin from "./admin/AdminLogin";
import Dashboard from "./admin/Dashboard";
import CourseCreate from "./admin/CourseCreate";
import UpdateCourse from "./admin/UpdateCourse";
import OurCourses from "./admin/OurCourses";
import Orders from "./admin/Orders";
import Profile from "./components/Profile";

function App() {
const user = JSON.parse(localStorage.getItem("user"));
  const admin = JSON.parse(localStorage.getItem("admin"));

  return (
    <>
      <Routes>     
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Other route */}
        <Route path="/courses" element={<Courses />} />
        <Route path="/buy/:courseId" element={<Buy />} />
        <Route path="/purchases" 
        element={user?<Purchases /> : <Navigate to={"/login"}/>} />
         <Route path="/profile" element={<Profile />} />

        {/* Admin Route */}
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" 
        element={admin? <Dashboard /> : <Navigate to={"/admin/login/"}/>} />
        <Route path="/admin/create-course" element={<CourseCreate />} />
        <Route path="/admin/update-course/:id" element={<UpdateCourse />} />
         <Route path="/admin/our-courses" element={<OurCourses />} />
          <Route path="/admin/orders" element={<Orders />} />
      </Routes>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  )
}

export default App
