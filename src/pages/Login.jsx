import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Tài khoản giả lập
  const accounts = {
    admin: { email: "admin@ssb.com", password: "123456" },
    driver: { email: "driver@ssb.com", password: "12345@" },
    parent: { email: "parent@ssb.com", password: "12345." },
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!role) {
      alert("Vui lòng chọn vai trò!");
      return;
    }
    if (!email || !password) {
      alert("Vui lòng nhập đầy đủ Email và Mật khẩu!");
      return;
    }

    const account = accounts[role];

    if (account && email === account.email && password === account.password) {
      alert(`✅ Đăng nhập thành công (${role.toUpperCase()})!`);

      // ✅ Lưu thông tin đăng nhập
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userRole", role);

      // ✅ Điều hướng theo vai trò
      if (role === "admin") navigate("/admin");
      if (role === "driver") navigate("/driver");
      if (role === "parent") navigate("/parent");
    } else {
      alert("❌ Sai thông tin đăng nhập!");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url("/background.png")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(8px)",
          padding: "3rem 2.5rem",
          borderRadius: "24px",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          boxShadow: "0 8px 32px rgba(31, 38, 135, 0.3)",
          width: "380px",
          color: "#fff",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "2rem",
            fontSize: "2.2rem",
            fontWeight: "700",
          }}
        >
          <span style={{ marginRight: "8px" }}>🚍</span>
          <span
            style={{
              background: "linear-gradient(90deg, #16a34a, #4ade80)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Smart School Bus
          </span>
        </h2>

        {/* Vai trò */}
        <label style={{ fontSize: "1.1rem", fontWeight: "600", color: "black" }}>
          Vai trò
        </label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "0.75rem",
            margin: "0.5rem 0 1.2rem",
            borderRadius: "10px",
            background: "rgba(255,255,255,0.25)",
            border: "1px solid rgba(255,255,255,0.4)",
            fontSize: "1rem",
            color: "black",
            outline: "none",
          }}
        >
          <option value="">-- Chọn vai trò --</option>
          <option value="admin">Quản trị viên</option>
          <option value="driver">Tài xế</option>
          <option value="parent">Phụ huynh</option>
        </select>

        {/* Email */}
        <label style={{ fontSize: "1.1rem", fontWeight: "600", color: "black" }}>
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Nhập email..."
          style={{
            width: "100%",
            padding: "0.75rem",
            margin: "0.5rem 0 1.2rem",
            borderRadius: "10px",
            border: "1px solid rgba(255,255,255,0.4)",
            background: "rgba(255,255,255,0.25)",
            color: "black",
            fontSize: "0.95rem",
          }}
        />

        {/* Mật khẩu */}
        <label style={{ fontSize: "1.1rem", fontWeight: "600", color: "black" }}>
          Mật khẩu
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Nhập mật khẩu..."
          style={{
            width: "100%",
            padding: "0.75rem",
            margin: "0.5rem 0 1.8rem",
            borderRadius: "10px",
            border: "1px solid rgba(255,255,255,0.4)",
            background: "rgba(255,255,255,0.25)",
            color: "black",
            fontSize: "0.95rem",
          }}
        />

        {/* Nút đăng nhập */}
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "0.9rem",
            background: "linear-gradient(135deg, #4b89ecff, #711ac3ff)",
            color: "white",
            border: "none",
            borderRadius: "12px",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "1rem",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
        >
          Đăng nhập
        </button>
      </form>
    </div>
  );
}
