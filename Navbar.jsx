// import React, { useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { Home, Megaphone, User, Bus } from "lucide-react";

// function Navbar() {
//   const location = useLocation();
//   const isDashboard = location.pathname.startsWith("/dashboard");

//   //   // Yến thêm state chọn ngôn ngữ từ dòng 10 đến 16
//   const [language, setLanguage] = useState("vi");

//   const handleLanguageChange = (e) => {
//     setLanguage(e.target.value);
//     // Lưu ngôn ngữ vào localStorage để ghi nhớ
//     localStorage.setItem("language", e.target.value);
//   };

//   return (
//     <nav
//       style={{
//         background: "rgba(0, 0, 0, 0.85)",
//         color: "white",
//         padding: "15px 40px",
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//       }}
//     >
//       <h2 style={{ color: "#4ade80", fontWeight: "bold", fontSize: "22px" }}>
//         Smart School Bus
//       </h2>

//       {!isDashboard ? (
//         // Navbar khi chưa đăng nhập
//         <div style={{ display: "flex", gap: "30px" }}>
//           <Link to="/" style={{ color: "white", textDecoration: "none" }}>
//             <Home size={24} /> Trang chủ
//           </Link>
//           <Link to="/notifications" style={{ color: "white", textDecoration: "none" }}>
//             <Megaphone size={24} /> Thông báo
//           </Link>
//           <Link to="/login" style={{ color: "white", textDecoration: "none" }}>
//             <User size={24} /> Đăng nhập
//           </Link>

//           {/* Yến thêm chuyển đổi ngôn ngữ từ dòng 47 đến 61 */}
//           <select
//             value={language}
//             onChange={handleLanguageChange}
//             style={{
//               padding: "6px 10px",
//               borderRadius: "6px",
//               border: "1px solid #ccc",
//               backgroundColor: "white",
//               color: "black",
//               cursor: "pointer",
//             }}
//           >
//             <option value="vi">🇻🇳 Tiếng Việt</option>
//             <option value="en">🇬🇧 English</option>
//           </select>

//         </div>
//       ) : (
//         // Navbar sau khi đăng nhập (trong dashboard)
//         <div style={{ display: "flex", gap: "25px" }}>
//           <Link to="/dashboard" style={{ color: "white" }}>Home</Link>
//           <Link to="/buses" style={{ color: "white" }}>Buses</Link>
//           <Link to="/drivers" style={{ color: "white" }}>Tài xế</Link>
//           <Link to="/students" style={{ color: "white" }}>Học sinh</Link>
//           <Link to="/routes" style={{ color: "white" }}>Tuyến đường</Link>
//           <Link to="/schedules" style={{ color: "white" }}>Lịch trình</Link>
//           <Link to="/trips" style={{ color: "white" }}>Hành trình</Link>
//         </div>
//       )}
//     </nav>
//   );
// }

// export default Navbar;

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Megaphone, User } from "lucide-react";

function Navbar() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");

  // lựa chọn ngôn ngữ
  const [language, setLanguage] = useState(localStorage.getItem("language") || "VN");

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  return (
    <nav
      style={{
        position: "relative", //đảm bảo không che nội dung bên dưới
        width: "100%", //chiếm đúng chiều ngang màn hình
        background: "rgba(0, 0, 0, 0.85)",
        color: "white",
        padding: "15px 5vw", //responsive theo kích thước màn hình
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap", //cho phép xuống hàng trên màn hình nhỏ
        boxSizing: "border-box", //tránh lỗi tràn
        zIndex: 10, //nằm trên background nhưng không đè nội dung
      }}
    >

      {/* Logo */}
      <h2 style={{ color: "#4ade80", fontWeight: "bold", fontSize: "22px" }}>
        Smart School Bus
      </h2>

      {!isDashboard ? (
        // thanh điều hướng navbar khi chưa đăng nhập
        <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
          <Link to="/" style={linkStyle}>
            <Home size={20} /> Trang chủ
          </Link>

          <Link to="/notifications" style={linkStyle}>
            <Megaphone size={20} /> Thông báo
          </Link>

          <Link to="/login" style={linkStyle}>
            <User size={20} /> Đăng nhập
          </Link>

          {/* set up mục lựa chọn hai ngôn ngữ */}
          <div style={linkStyle}>
            🌐
            <select
              value={language}
              onChange={handleLanguageChange}
              style={{
                background: "transparent",
                color: "white",
                border: "none",
                outline: "none",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              <option value="VN" style={{ color: "black" }}>
                VN
              </option>
              <option value="ENG" style={{ color: "black" }}>
                EN
              </option>
            </select>
          </div>
        </div>
      ) : (
        // thanh điều hướng navbar sau khi đã đăng nhập (dashboard)
        <div style={{ display: "flex", gap: "25px" }}>
          <Link to="/dashboard" style={linkStyle}>Home</Link>
          <Link to="/buses" style={linkStyle}>Buses</Link>
          <Link to="/drivers" style={linkStyle}>Tài xế</Link>
          <Link to="/students" style={linkStyle}>Học sinh</Link>
          <Link to="/routes" style={linkStyle}>Tuyến đường</Link>
          <Link to="/schedules" style={linkStyle}>Lịch trình</Link>
          <Link to="/trips" style={linkStyle}>Hành trình</Link>
        </div>
      )}
    </nav>
  );
}

// chỉnh các mục cho cùng kiểu
const linkStyle = {
  color: "white",
  textDecoration: "none",
  display: "flex",
  alignItems: "center",
  gap: "6px",
  fontSize: "16px",
  fontWeight: "500",
  transition: "color 0.2s ease",
  cursor: "pointer",
};

export default Navbar;
