import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import axios from "axios";
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.get(
            `${API_URL}/auth/profile`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setUser(response.data.user);
        } catch (error) {
          console.error("Error fetching user:", error);
          localStorage.removeItem("token");
          setUser(null);
          navigate("/login");
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [navigate]);

  const login = (userData, token) => {
    localStorage.setItem("token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login"); // Redirect to login page on logout
  };

  const contextValue = useMemo(
    () => ({ user, setUser, login, logout }),
    [user]
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  return useContext(AuthContext);
};
