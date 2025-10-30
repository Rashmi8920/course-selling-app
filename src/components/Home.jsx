import React, { useEffect, useState } from 'react'
import logo from '../../public/logo.webp';
import { Link, useNavigate } from 'react-router-dom';
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import axios from 'axios'
import "slick-carousel/slick/slick.css";
import 'slick-carousel/slick/slick-theme.css';
import Slider from "react-slick";
import toast from "react-hot-toast";

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [isUserLogeddIn, setIsUserLogeddIn] = useState(false);
  const navigate = useNavigate();
  const nav = () => {
    navigate("/courses")
  }
  //  Check login status on page load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsUserLogeddIn(true);
    } else {
      setIsUserLogeddIn(false);
    }
  }, []);

  //handle logout function
  const handlelogout = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/v1/user/logout`,    {
          withCredentials: true,
        })
      toast.success(response.data.message)
      localStorage.removeItem("user");
      localStorage.removeItem("token");        
      setIsUserLogeddIn(false)
    } catch (error) {
      console.log(error, "error in user logout")
      toast.error(error.response.data.message || "error in logout")
    }
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
      } catch (error) {
        console.log(error, "error in fetchcourses")
      }
    }
    FetchCourses();
  }, [])
  function NextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "block",
          right: "1px",
          zIndex: 10,
          color: "white",
          fontSize: "20px",
          
        }}
        onClick={onClick}
      />
    );
  }

  function PrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "block",
          left: "1px",
          zIndex: 10,
          color: "white",
        }}
        onClick={onClick}
      />
    );
  }

  // responsive code
  var settings = {
    dots: true,
    infinite: true,
    speed: 1500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    pauseOnHover: false,
    pauseOnFocus: false,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          arrows: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: true,
        },
      },
    ],
  };
  return (<>
    <div className='bg-gradient-to-r from-black to-blue-950 h-[100%]'>
      <div className=' h-full text-white container mx-auto'>  {/*h-screen*/}
        {/* header */}
        <header className='flex items-center justify-between m-[-11px] p-6'>
      <div className='flex items-center space-x-2'> {/**/}
            <img src={logo} alt="" className='w-10 h-10 rounded-full' />
            <h1 className='md:text-2xl text-xl text-orange-500 font-bold'>CourseHaven</h1>
          </div>
          <div className='space-x-2 flex mr-[-8px]'>  {/**/}
            {isUserLogeddIn ? (
              <button
                onClick={handlelogout}
                className="bg-transparent text-white text-xs md:text-lg md:py-2 md:px-4 p-2 border border-white rounded mb-[16px]">
                Logout
              </button>
            ) : (
              <Link to="/login" className="bg-transparent text-white text-xs md:text-lg md:py-2 md:px-4 p-2 border border-white rounded mb-[16px]">
                Login
              </Link>
            )}
            <Link to={'/signup'} className='bg-transparent text-white text-xs md:text-lg md:py-2 md:px-4 p-2 border border-white rounded mb-[14px]'>
              Signup
            </Link>
          </div>
        </header>
        {/* man sectipon */}
        <section className='text-center py-20'>
          <h1 className='sm:text-4xl text-3xl font-semibold text-orange-500'>
            CourseHeaven
          </h1>  <br /><br />
          <p className='text-gray-500'>Sharpen your skills with courses crefted by experts</p>
          <div className='flex flex-col  sm:ml-0 ml-10 sm:flex-row items-center justify-center space-x-4 gap-4 mt-8 '>
            {/* <Link to={'/courses'} 
                        className='bg-green-600 text-white p-2 md:py-3 md:px-6   rounded font-semibold hover:bg-white duration-300 hover:text-black  px-7'>
                            explore courses
                            </Link> */}
            {isUserLogeddIn ? (
              <Link to={"/courses"}
                className="bg-green-600 text-white p-2 md:py-3 md:px-6 rounded font-semibold hover:bg-white duration-300 hover:text-black px-7"
              >
                Explore Courses
              </Link>
            ) : (
              <button  disabled
               title="Please login first to Explore Courses" // hover 
                className="bg-gray-400 text-white p-2 md:py-3 md:px-6 rounded font-semibold cursor-not-allowed px-7"
              >
                Explore Courses 
              </button>
            )}
            <Link to={'https://www.youtube.com/'} className='bg-white  text-black  p-2 md:py-3 md:px-6 rounded font-semibold hover:bg-green-600 duration-300 hover:text-white sm:ml-0 ml-[-2px] px-8'>
              courses videos
            </Link>
            <Link to={'/admin/signup'} className='  text-white  p-2 md:py-3 md:px-6 rounded font-semibold bg-green-600 duration-300 hover:bg-orange-500  hover:text-white sm:ml-0 ml-[-14px] px-5'>
              Admin Dashboard
            </Link>
          </div>
        </section>
        <section>
          {/* slider with mapping */}
          <p className='font-bold sm:text-4xl text-3xl  mb-7 sm:ml-8 ml-22 font-serif'>Our Courses</p>
          <Slider {...settings}>
            {courses.map((course) => (
              <div className='p-4 z-5 mt-[-12px] sm:ml-0 ml-4' key={course._id} >
                <div className='relative border -shrink-0 sm:w-80 w-60 z-5  tracking duration-300 sm:p-0 transform hover:scale-105 sm:ml-4 ml-7'>
                  <div className='bg-gray-900 z-5 rounded-lg overflow-hidden '>
                    <img className='mt-1 h-32 z-5 w-full object-contain' src={course?.image?.url} alt="" />
                    <div className='p-6 text-center z-5'>
                      <h2 className='text-xl z-5 font-bold text-white'> {course.title}</h2>
                      <button
                        onClick={nav}
                        className='mt-4 z-5 bg-orange-500 text-white py-2 px-4 rounded-full hover:bg-blue-500 duration-300'>enroll Now</button>
                      {/* <p>description : {course.description}</p> */}     {/* <p>₹{course.price}</p> */}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </section>
        <hr />
        {/* footer */}
        <footer className='my-8' >
          <div className='grid grid-cols-1 md:grid-cols-3'>
            <div className=' flex flex-col  items-center md:items-start'>
              <div className='flex items-center space-x-2'>
                <img src={logo} alt="" className='w-10 h-10 rounded-full' />
                <h1 className='text-2xl text-orange-500 font-bold'>CourseHaven
                </h1>
              </div>
              <div className='mt-3 ml-2 md:ml-8'>
                <p className='mb-2 smLml-0 ml-4'>follow us</p>
                <div className='flex space-x-4'>
                  <a href="" className='hover:text-blue-400 text-2xl duration-300' ><FaFacebook />  </a>
                  <a href="" className='hover:text-pink-600 text-2xl duration-300' ><FaInstagram /></a>
                  <a href="" className='hover:text-blue-600 text-2xl duration-300' ><FaTwitter /></a>
                  {/* <FaLinkedin /> */}
                </div>
              </div>
            </div>
            <div className="items-center mt-6 md:mt-0 flex flex-col">
              <h3 className="text-lg font-semibold md:mb-4">connects</h3>
              <ul className=" space-y-2 text-gray-400">
                <li className="hover:text-white cursor-pointer duration-300">
                  youtube- learn coding
                </li>
                <li className="hover:text-white cursor-pointer duration-300">
                  telegram- learn coding
                </li>
                <li className="hover:text-white cursor-pointer duration-300">
                  Github- learn coding
                </li>
              </ul>
            </div>
            <div className="items-center mt-6 md:mt-0 flex flex-col">
              <h3 className="text-lg font-semibold mb-4">
                copyrights &#169; 2024
              </h3>
              <ul className=" space-y-2 text-center text-gray-400">
                <li className="hover:text-white cursor-pointer duration-300">
                  Terms & Conditions
                </li>
                <li className="hover:text-white cursor-pointer duration-300">
                  Privacy Policy
                </li>
                <li className="hover:text-white cursor-pointer duration-300">
                  Refund & Cancellation
                </li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </div>
  </>
  )
}


export default Home
