import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axiosInstance from "src/Components/common/utils/axiosInstance";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState(() => Cookies.get("authToken") || null);
  const [userId, setUserId] = useState(() => Cookies.get("_id") || null);
  const [fullName, setFullName] = useState(() => Cookies.get("fullName") || null);

  // authData = response.data = { _id, fullName, email, phone, token }
  const login = (authData) => {
    if (!authData) {
      console.warn('login called with no authData');
      return;
    }
    // Support both flat shape { token, _id, fullName } and nested { data: { token, _id, fullName } }
    const data = authData.data ?? authData;
    const { token, _id, fullName } = data;
    if (!token) {
      console.warn('login called without token');
      return;
    }
    Cookies.set("authToken", token, { expires: 1 });
    Cookies.set("_id", _id, { expires: 1 });
    Cookies.set("fullName", fullName, { expires: 1 });
    setToken(token);
    setUserId(_id);
    setFullName(fullName);
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  const logout = () => {
    Cookies.remove("authToken");
    Cookies.remove("_id");
    Cookies.remove("fullName");
    localStorage.removeItem("selectedSite");

    setToken(null);
    setUserId(null);
    setFullName(null);

    delete axiosInstance.defaults.headers.common["Authorization"];

    navigate("/auth/signin");
  };

  return (
    <AuthContext.Provider value={{ token, userId, fullName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      token: null,
      userId: null,
      fullName: null,
      login: () => {},
      logout: () => {},
    };
  }
  return context;
};
