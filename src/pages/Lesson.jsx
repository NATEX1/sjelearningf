import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { FaRegCirclePlay, FaCirclePlay } from "react-icons/fa6";
import { IoIosArrowBack } from "react-icons/io";
import { Menu, X } from "lucide-react";
import VideoPlayer from "../components/VideoPlayer";

const Lesson = () => {
  const { id } = useParams();
  const { user, setUser } = useAuth();
  const [lesson, setLesson] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [showLessonsList, setShowLessonsList] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/lessons/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setLesson(response.data);
      } catch (error) {
        console.error("Error fetching lesson:", error);
      }
    };

    fetchLesson();
  }, [id]);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await axios.get(`${API_URL}/lessons`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setLessons(response.data);
      } catch (error) {
        console.error("Error fetching lessons:", error);
      }
    };

    fetchLessons();
  }, []);

  const handleVideoStart = async () => {
    try {
      const response = await axios.put(
        `${API_URL}/lessons/history/${id}`,
        {
          status: "กำลังเรียน",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      setUser(response.data.user);
    } catch (error) {
      console.error("Error updating lesson status:", error);
    }
  };

  const handleVideoEnd = async () => {
    try {
      const response = await axios.put(
        `${API_URL}/lessons/history/${id}`,
        {
          status: "เสร็จสิ้น",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUser(response.data.user);
      const nextLessonId = getNextLessonId(id);
      if (nextLessonId) {
        navigate(`/lessons/${nextLessonId}`);
      }
    } catch (error) {
      console.error("Error updating lesson status:", error);
    }
  };

  const getNextLessonId = (currentLessonId) => {
    const currentIndex = lessons.findIndex(
      (lesson) => lesson._id === currentLessonId
    );
    if (currentIndex !== -1 && currentIndex < lessons.length - 1) {
      return lessons[currentIndex + 1]._id;
    }
    return null;
  };

  const toggleLessonsList = () => {
    setShowLessonsList(!showLessonsList);
  };

  return (
    <div className="p-2 md:p-4">
      <div className="flex items-center gap-2 md:gap-4 mb-4">
        <Link
          to="/"
          className="text-white bg-purple-600 p-2 md:p-4 flex items-center justify-center rounded-lg"
        >
          <IoIosArrowBack size={20} />
        </Link>
        <h1 className="text-lg md:text-2xl font-bold truncate">{lesson?.title}</h1>
        
        {/* Mobile toggle button for lessons list */}
        <button 
          className="ml-auto md:hidden bg-purple-600 text-white p-2 rounded-lg flex items-center gap-1"
          onClick={toggleLessonsList}
        >
          <span className="text-sm">เลือกบทเรียน</span>
          {showLessonsList ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Main content area */}
        {lesson?.videoUrl && (
          <div className="flex-1">
            <div className="bg-gray-100 join rounded-t-2xl flex-col">
              <div className="mx-auto w-full rounded-t-2xl shadow-lg bg-gray-200 overflow-hidden mb-4">
                <VideoPlayer
                  src={lesson.videoUrl}
                  onPlay={handleVideoStart}
                  onEnded={handleVideoEnd}
                />
              </div>
              <div className="px-4 pb-4">
                <p className="mb-6 text-gray-700">{lesson.description}</p>
                <Link
                  to={`/lessons/${lesson._id}/exercises`}
                  className="btn bg-purple-600 hover:bg-purple-700 text-white"
                >
                  ทำแบบฝึกหัด
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Mobile overlay for lessons list */}
        <div 
          className={`fixed inset-0 bg-black z-40 md:hidden transition-opacity duration-300 ease-in-out ${
            showLessonsList ? 'opacity-50' : 'opacity-0 pointer-events-none'
          }`} 
          onClick={() => setShowLessonsList(false)}
        ></div>
        
        {/* Lessons list sidebar */}
        <div 
          className={`${
            showLessonsList ? 'fixed right-0 top-0 h-full z-50 transform translate-x-0' : 'fixed right-0 top-0 h-full z-50 transform translate-x-full'
          } w-[280px] md:w-[300px] md:static md:transform-none transition-transform duration-300 ease-in-out`}
        >
          <div className="h-full md:h-auto bg-gray-100 p-4 md:p-6 rounded-xl transition duration-300 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">เลือกบทเรียน</h2>
              <button onClick={() => setShowLessonsList(false)} className="p-2 md:hidden">
                <X size={24} />
              </button>
            </div>
            
            {/* Current progress indicator */}
            {lesson && (
              <div className="bg-white p-3 rounded-lg mb-4 shadow-sm">
                <p className="text-sm text-gray-600 mb-1">บทเรียนปัจจุบัน</p>
                <p className="font-medium text-gray-900 truncate">{lesson.title}</p>
                <div className="mt-2 bg-gray-200 h-2 rounded-full">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ 
                      width: `${
                        user?.lessonHistory?.some(
                          item => item.lesson._id === lesson._id && item.status === "เสร็จสิ้น"
                        ) ? '100%' : '50%'
                      }` 
                    }}
                  ></div>
                </div>
              </div>
            )}
            
            <ul className="flex flex-col gap-2 flex-1 overflow-y-auto scrollbar-hide">
              {lessons.map((lessonItem, index) => (
                <li key={lessonItem._id}>
                  <NavLink
                    to={`/lessons/${lessonItem._id}`}
                    onClick={() => setShowLessonsList(false)}
                    className={({ isActive }) =>
                      `flex justify-between items-center p-3 md:p-4 rounded-lg transition duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                          : "hover:bg-gray-200"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </div>
                          <h3 className={`truncate w-[160px] text-sm md:text-md font-medium ${isActive ? "text-white" : "text-gray-800"}`}>
                            {lessonItem.title}
                          </h3>
                        </div>
                        {user?.lessonHistory?.some(
                          (completedLesson) =>
                            completedLesson.lesson._id ===
                              lessonItem._id.toString() &&
                            completedLesson.status === "เสร็จสิ้น"
                        ) ? (
                          <FaCirclePlay
                            className={`text-green-500 ${
                              isActive ? "text-white" : "text-green-500"
                            }`}
                            size={18}
                          />
                        ) : (
                          <FaRegCirclePlay 
                            className={isActive ? "text-white" : "text-gray-500"} 
                            size={18}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lesson;