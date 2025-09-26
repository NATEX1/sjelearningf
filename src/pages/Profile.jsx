import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import { IoIosArrowBack } from "react-icons/io";
import { Link } from "react-router-dom";

const Profile = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(
        `${API_URL}/auth/profile`,
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setUser(response.data.user);
      toast.success("อัปเดตข้อมูลสำเร็จ!", { position: "top-right", autoClose: 3000 });
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการอัปเดตข้อมูล!", { position: "top-right", autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      toast.error("รหัสผ่านใหม่ไม่ตรงกัน!", { position: "top-right", autoClose: 3000 });
      return;
    }

    setPasswordLoading(true);
    try {
      await axios.put(
        `${API_URL}/auth/change-password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      toast.success("เปลี่ยนรหัสผ่านสำเร็จ!", { position: "top-right", autoClose: 3000 });
      setPasswordData({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน!", { position: "top-right", autoClose: 3000 });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center gap-4 mb-4">
        <Link to="/" className="text-white bg-purple-600 p-4 flex items-center justify-center rounded-lg">
          <IoIosArrowBack size={24} />
        </Link>
        <h1 className="text-2xl font-bold mb-4">ข้อมูลส่วนตัว</h1>
      </div>

      <div className="p-6 bg-gray-100 rounded-lg">
        <form onSubmit={handleFormSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อผู้ใช้</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">อีเมล</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            type="submit"
            className="btn bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300"
            disabled={loading}
          >
            {loading ? "กำลังโหลด..." : "บันทึก"}
          </button>
        </form>
      </div>

      {/* ฟอร์มเปลี่ยนรหัสผ่าน */}
      <div className="p-6 bg-gray-100 rounded-lg mt-6">
        <h2 className="text-xl font-semibold mb-4">เปลี่ยนรหัสผ่าน</h2>
        <form onSubmit={handlePasswordSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">รหัสผ่านปัจจุบัน</label>
            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">รหัสผ่านใหม่</label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">ยืนยันรหัสผ่านใหม่</label>
            <input
              type="password"
              name="confirmNewPassword"
              value={passwordData.confirmNewPassword}
              onChange={handlePasswordChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            type="submit"
            className="btn bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300"
            disabled={passwordLoading}
          >
            {passwordLoading ? "กำลังเปลี่ยนรหัสผ่าน..." : "เปลี่ยนรหัสผ่าน"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
