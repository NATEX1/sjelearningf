import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FaCircleUser } from "react-icons/fa6";

const Header = () => {
  const { user } = useAuth();
  return (
    <header>
      <div className="max-w-[1280px] h-[60px] mx-auto flex items-center  justify-between px-2 md:p-0">
        <div className="flex items-center gap-2 text-wrap max-w-56">
          <img
            src="/logo.png"
            alt="logo"
            className="w-10 h-10"
          />
          <Link to="/" className="text-xs font-bold">
            สื่อการเรียนรู้การพัฒนาเว็บไซต์ด้วย JavaScript
          </Link>
        </div>
        <Link to="/profile" className="flex gap-2 items-center">
          <FaCircleUser className="text-purple-600" size={24} />
          <p>ยินดีต้อนรับ, {user.username}</p>
        </Link>
      </div>
    </header>
  );
};

export default Header;
