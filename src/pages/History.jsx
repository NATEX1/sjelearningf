import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";

const History = () => {
  const { user } = useAuth();

  const getRelativeDate = (date) => {
    const today = new Date();
    const targetDate = new Date(date);

    // รีเซ็ตเวลาเป็น 00:00 ของวันที่เปรียบเทียบ
    const todayStart = new Date(today.setHours(0, 0, 0, 0));
    const targetDateStart = new Date(targetDate.setHours(0, 0, 0, 0));

    const diffTime = todayStart - targetDateStart;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "วันนี้";
    } else if (diffDays === 1) {
      return "เมื่อวาน";
    } else if (diffDays === 2) {
      return "เมื่อวันก่อน";
    } else {
      return targetDate.toLocaleDateString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  };

  const lessonsByDate = user?.lessonHistory?.reduce((acc, lesson) => {
    const dateKey = getRelativeDate(lesson.updatedAt); // ใช้ updatedAt แทน createdAt
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(lesson);
    return acc;
  }, {});

  // สร้างวันที่เรียงตาม updatedAt และ group เป็นกลุ่มวันที่
  const sortedLessonsByDate = lessonsByDate
    ? Object.entries(lessonsByDate).sort(
        ([keyA, lessonsA], [keyB, lessonsB]) => {
          const latestA = new Date(
            Math.max(...lessonsA.map((lesson) => new Date(lesson.updatedAt))) // ใช้ updatedAt
          );
          const latestB = new Date(
            Math.max(...lessonsB.map((lesson) => new Date(lesson.updatedAt))) // ใช้ updatedAt
          );
          return latestB - latestA; // เรียงจากล่าสุดไปเก่าสุด
        }
      )
    : [];

  return (
    <div className="p-4">
      <div className="flex items-center gap-4 mb-4">
        <Link
          to="/"
          className="text-white bg-purple-600 p-4 flex items-center justify-center rounded-lg"
        >
          <IoIosArrowBack size={24} />
        </Link>
        <h1 className="text-2xl font-bold mb-2">ประวัติการเรียน</h1>
      </div>
      <div>
        {sortedLessonsByDate.length > 0 ? (
          sortedLessonsByDate.map(([date, lessons]) => (
            <div key={date} className="mb-4 bg-gray-100 p-4 rounded-lg">
              <h2 className="font-bold text-lg text-purple-700 mb-2">{date}</h2>
              {lessons
                // เรียงบทเรียนภายในวันเดียวกันจากใหม่สุดไปเก่า
                .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)) // ใช้ updatedAt
                .map((lesson, index) => {
                  const time = new Date(lesson.updatedAt).toLocaleTimeString(
                    // ใช้ updatedAt
                    "th-TH",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  );

                  return (
                    <Link
                      to={`/lessons/${lesson.lesson._id}`}
                      key={index}
                      className="p-4 hover:bg-gray-200 block duration-300 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <p className="text-gray-600">{time} น.</p>
                        <p className="flex-1 font-semibold text-lg">
                          {lesson.lesson.title}
                        </p>
                        <p
                          className={`font-medium ${
                            lesson.status === "เสร็จสิ้น"
                              ? "text-green-500"
                              : "text-yellow-500"
                          }`}
                        >
                          {lesson.status === "เสร็จสิ้น"
                            ? "✓ เสร็จสิ้น"
                            : "กำลังดำเนินการ"}
                        </p>
                      </div>
                    </Link>
                  );
                })}
            </div>
          ))
        ) : (
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-gray-500 text-center">
              ยังไม่มีบทเรียนที่เสร็จสิ้น
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
