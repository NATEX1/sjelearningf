import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false); // สถานะการโหลด
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("กรุณากรอกข้อมูลให้ครบถ้วน", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    
    setLoading(true); // เริ่มการโหลด

    try {
      const response = await axios.post(
        `${API_URL}/auth/login`,
        formData, 
        {
          withCredentials: true, 
        }
      );
      
      toast.success("เข้าสู่ระบบสำเร็จ!", {
        position: "top-right",
        autoClose: 3000,
      });
      setUser(response.data.user);
      localStorage.setItem("token", response.data.token);
      navigate("/");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("อีเมลหรือรหัสผ่านไม่ถูกต้อง", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.error("เกิดข้อผิดพลาดในการเข้าสู่ระบบ", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } finally {
      setLoading(false); // หยุดการโหลด
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          เข้าสู่ระบบ
        </h2>
        <form onSubmit={handleFormSubmit}>
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

          <button
            type="submit"
            className="w-full btn btn-primary"
            disabled={loading} // ปิดปุ่มระหว่างการโหลด
          >
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"} {/* เปลี่ยนข้อความเมื่อกำลังโหลด */}
          </button>
        </form>
        <div className="text-center mt-4">
          <Link
            to="/register"
            className="text-sm text-gray-600 hover:underline"
          >
            ยังไม่ได้เป็นสมาชิก? สมัครสมาชิก
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
