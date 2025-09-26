import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const API_URL = import.meta.env.VITE_API_URL;
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("รหัสผ่านไม่ตรงกัน");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/auth/register`,
        {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }
      );

      if (response.status === 201) {
        toast.success("ลงทะเบียนสำเร็จ! กรุณาเข้าสู่ระบบ");
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        navigate("/login");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "เกิดข้อผิดพลาดในการลงทะเบียน";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <ToastContainer />
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          ลงทะเบียน
        </h2>
        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              ชื่อผู้ใช้
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              className="w-full input input-bordered"
              placeholder="ชื่อผู้ใช้"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              อีเมล
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full input input-bordered"
              placeholder="example@email.com"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              รหัสผ่าน
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full input input-bordered"
              placeholder="••••••••"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              ยืนยันรหัสผ่าน
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              className="w-full input input-bordered"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="w-full btn btn-primary">
            ลงทะเบียน
          </button>
        </form>
        <div className="text-center mt-4">
          <Link to="/login" className="text-sm text-gray-600 hover:underline">
            มีบัญชีแล้ว? เข้าสู่ระบบ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
