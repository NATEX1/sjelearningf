import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
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
        setLoading(false);
      } catch (error) {
        console.error("Error fetching lessons:", error);
        setLoading(false);
      }
    };

    fetchLessons();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-600">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-purple-600">เรียน</h1>
      <p className="text-lg text-gray-500 mb-8">
        หลักสูตรการเรียนรู้การพัฒนาเว็บไซต์ด้วย JavaScript
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {lessons.map((lesson) => (
          <Link
            to={`/lessons/${lesson._id}`}
            key={lesson._id}
            className="card card-compact bg-base-100 shadow"
          >
            <figure>
              <img
                src={lesson.thumbnailUrl}
                alt={lesson.title}
                className="w-full h-32 object-cover bg-slate-300"
              />
            </figure>
            <div className="p-2">
              <h2 className="text-md font-semibold line-clamp-2">{lesson.title}</h2>
              {/* <p className="mt-2 text-gray-600 line-clamp-2">
                {lesson.description || "ไม่มีคำอธิบาย"}
              </p> */}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
