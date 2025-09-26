import React from "react";
import { FaLeanpub, FaListCheck } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import { IoIosLogOut } from "react-icons/io";
import { MdHistory } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Sidebar = ({ onClose }) => {
  const { logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    if (onClose) onClose(); // Close sidebar on mobile if needed
  };
  
  return (
    <aside className="w-full md:w-[300px] ">
      <nav>
        <ul className="flex flex-col gap-1">
          <li>
            <NavLink
              to="/"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-4 p-4 rounded-lg transition-all duration-300 ${
                  isActive || window.location.pathname.includes("/lessons/")
                    ? "bg-purple-600 rounded-lg text-purple-200"
                    : "hover:bg-purple-300"
                }`
              }
            >
              <FaLeanpub />
              <p>เรียน</p>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/status"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-4 p-4 rounded-lg transition-all duration-300 ${
                  isActive
                    ? "bg-purple-600 rounded-lg text-purple-200"
                    : "hover:bg-purple-300"
                }`
              }
            >
              <FaListCheck />
              <p>สถานะการเรียน</p>
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/history"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-4 p-4 rounded-lg transition-all duration-300 ${
                  isActive
                    ? "bg-purple-600 text-purple-200"
                    : "hover:bg-purple-300"
                }`
              }
            >
              <MdHistory />
              <p>ประวัติการเรียน</p>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/profile"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-4 p-4 rounded-lg transition-all duration-300 ${
                  isActive
                    ? "bg-purple-600 text-purple-200"
                    : "hover:bg-purple-300"
                }`
              }
            >
              <FaUserCircle />
              <p>บัญชีของฉัน</p>
            </NavLink>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="p-4 flex items-center gap-4 w-full rounded-lg hover:bg-purple-300 transition-all duration-300"
            >
              <IoIosLogOut />
              <p>ออกจากระบบ</p>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;