import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Các trang
import Home from "./pages/Home";
import MapView from "./components/MapView";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import ThongBao from "./pages/ThongBao";
import Drivers from "./pages/Drivers";
import Parents from "./pages/Parents";

function App() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const userRole = localStorage.getItem("userRole");

  return (
    <div className="w-full h-full">
      <Routes>
        {/* Trang chủ */}
        <Route path="/" element={<Home />} />

        {/* Route bản đồ công khai */}
        <Route path="/map" element={<MapView />} />

        {/* Trang đăng nhập */}
        <Route path="/login" element={<Login />} />

        {/* Trang Admin - chỉ truy cập khi đăng nhập với vai trò Admin */}
        <Route
          path="/admin"
          element={
            isLoggedIn && userRole === "admin" ? (
              <Admin />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route path="/admin/thongbao" element={<ThongBao />} />

        {/* Trang Tài xế - chỉ truy cập khi đăng nhập với vai trò Driver */}
        <Route path="/driver" element={<Drivers />} />

        {/* Trang Phụ huynh - đăng nhập với vai trò Parent */}
        <Route path="/parent" element={<Parents />} />

        {/* Nếu đường dẫn không tồn tại → quay lại Home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

    </div>
  );
}

export default App;
