import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Megaphone, User, Bus } from "lucide-react";

function Navbar() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");

  return (
    <nav
      style={{
        background: "rgba(0, 0, 0, 0.85)",
        color: "white",
        padding: "15px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h2 style={{ color: "#4ade80", fontWeight: "bold", fontSize: "22px" }}>
        Smart School Bus
      </h2>

      {!isDashboard ? (
        // Navbar khi chưa đăng nhập
        <div style={{ display: "flex", gap: "30px" }}>
          <Link to="/" style={{ color: "white", textDecoration: "none" }}>
            <Home size={24} /> Trang chủ
          </Link>
          <Link to="/notifications" style={{ color: "white", textDecoration: "none" }}>
            <Megaphone size={24} /> Thông báo
          </Link>
          <Link to="/login" style={{ color: "white", textDecoration: "none" }}>
            <User size={24} /> Đăng nhập
          </Link>
        </div>
      ) : (
        // Navbar sau khi đăng nhập (trong dashboard)
        <div style={{ display: "flex", gap: "25px" }}>
          <Link to="/dashboard" style={{ color: "white" }}>Home</Link>
          <Link to="/buses" style={{ color: "white" }}>Buses</Link>
          <Link to="/drivers" style={{ color: "white" }}>Tài xế</Link>
          <Link to="/students" style={{ color: "white" }}>Học sinh</Link>
          <Link to="/routes" style={{ color: "white" }}>Tuyến đường</Link>
          <Link to="/schedules" style={{ color: "white" }}>Lịch trình</Link>
          <Link to="/trips" style={{ color: "white" }}>Hành trình</Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
