import React from "react";

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <span className="loading loading-bars loading-xs mb-4"></span>
        <p className="text-lg text-gray-600">กำลังโหลด... กรุณารอสักครู่</p>
      </div>
    </div>
  );
};

export default Loading;
    