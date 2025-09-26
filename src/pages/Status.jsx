import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const Status = () => {
  const [lessons, setLessons] = useState([]);
  const [exerciseHistory, setExerciseHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

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

    const fetchExerciseHistory = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/exercises/score`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setExerciseHistory(response.data);
      } catch (error) {
        console.error("Error fetching exercise history:", error);
      }
    };

    fetchExerciseHistory();
    fetchLessons();
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <span className="loading loading-bars loading-lg text-purple-600"></span>
          <p className="mt-4">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-4 max-w-6xl mx-auto">
      <div className="flex items-center gap-2 sm:gap-4 mb-4">
        <Link
          to="/"
          className="text-white bg-purple-600 p-2 sm:p-4 flex items-center justify-center rounded-lg hover:bg-purple-700 transition-colors"
        >
          <IoIosArrowBack size={20} className="sm:text-2xl" />
        </Link>
        <h1 className="text-xl sm:text-2xl font-bold">สถานะการเรียน</h1>
      </div>
      
      <div className="bg-gray-100 p-2 sm:p-4 rounded-lg shadow-sm">
        {lessons.length === 0 ? (
          <p className="text-center py-4 text-gray-600">ไม่พบข้อมูลบทเรียน</p>
        ) : (
          lessons.map((lesson) => {
            // หาคะแนนสูงสุดจาก exerciseHistory
            const userScores = exerciseHistory.filter(
              (exercise) => exercise.lessonId === lesson._id
            );

            const maxScore =
              userScores.length > 0
                ? Math.max(...userScores.map((exercise) => exercise.score))
                : 0;

            const isCompleted = user.lessonHistory.some(
              (historyItem) =>
                historyItem.lesson._id === lesson._id &&
                historyItem.status === "เสร็จสิ้น"
            );

            const scorePercentage = (maxScore / 10) * 100; // สมมติว่าคะแนนเต็มคือ 10

            return (
              <div 
                key={lesson._id} 
                className="mb-3 p-3 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow border border-gray-200"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <h2 className="font-bold text-purple-700 text-sm sm:text-base">
                    {lesson.title}
                  </h2>
                  <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 text-xs sm:text-sm">
                    <p className="flex justify-between sm:justify-start">
                      <span className="sm:hidden font-medium mr-1">สถานะ:</span>{" "}
                      <span
                        className={`font-medium ${isCompleted ? "text-green-600" : "text-red-600"}`}
                      >
                        {isCompleted ? "เสร็จสิ้น" : "ยังไม่เสร็จสิ้น"}
                      </span>
                    </p>
                    <p className="flex justify-between sm:justify-start">
                      <span className="sm:hidden font-medium mr-1">สถานะคะแนน:</span>{" "}
                      <span
                        className={`font-medium ${
                          scorePercentage >= 60 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {scorePercentage >= 60 ? "ผ่าน" : "ไม่ผ่าน"}
                      </span>
                    </p>
                  </div>
                </div>
                
                {/* Progress bar */}
                {/* <div className="mt-2 sm:mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
                    <div 
                      className={`h-full rounded-full ${
                        scorePercentage >= 60 ? "bg-green-500" : "bg-red-500"
                      }`}
                      style={{ width: `${scorePercentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-gray-600">
                    <span>0%</span>
                    <span>{scorePercentage.toFixed(0)}%</span>
                    <span>100%</span>
                  </div>
                </div> */}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Status;