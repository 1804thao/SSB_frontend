import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Parents() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("hocsinh");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Danh sách tab
  const tables = [
    { key: "hocsinh", label: "Thông tin học sinh" },
    { key: "lichtrinh", label: "Lịch trình xe" },
    { key: "baocao", label: "Báo cáo từ tài xế" },
    { key: "canhbao", label: "Cảnh báo sự cố" },
  ];

  // Đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  // Fetch dữ liệu khi đổi tab
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:5000/api/${activeTab}`);
        const json = await res.json();
        console.log("Dữ liệu nhận được:", json);
        setData(json);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
        setError("Không thể tải dữ liệu từ máy chủ.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab]);

  // Hàm render bảng tùy theo tab
  const renderTable = () => {
    if (loading) return <p>⏳ Đang tải dữ liệu...</p>;
    if (error) return <p style={styles.error}>{error}</p>;
    if (!data || data.length === 0)
      return <p>Không có dữ liệu cho bảng {tables.find(t => t.key === activeTab)?.label}.</p>;

    switch (activeTab) {
      case "hocsinh":
        return (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Mã HS</th>
                <th>Tên</th>
                <th>Lớp</th>
                <th>Số điện thoại</th>
                <th>Địa chỉ</th>
                <th>Mã PH</th>
                <th>Mã Xe</th>
                <th>Mã NV</th>
              </tr>
            </thead>
            <tbody>
              {data.map((hs, idx) => (
                <tr key={idx}>
                  <td>{hs.MaHS}</td>
                  <td>{hs.Ten}</td>
                  <td>{hs.Lop}</td>
                  <td>{hs.SoDienThoai}</td>
                  <td>{hs.DiaChi}</td>
                  <td>{hs.MaPH}</td>
                  <td>{hs.MaXE}</td>
                  <td>{hs.MaNV}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      
      case "lichtrinh":
        return (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Mã LT</th>
                <th>Giờ xuất phát</th>
                <th>Giờ kết thúc</th>
                <th>Mã NV</th>
              </tr>
            </thead>
            <tbody>
              {data.map((lt, idx) => (
                <tr key={idx}>
                  <td>{lt.MaLT}</td>
                  <td>{new Date(lt.GioXuatPhat).toLocaleString()}</td>
                  <td>{new Date(lt.GioKetThuc).toLocaleString()}</td>
                  <td>{lt.MaNV}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      // Báo cáo tình trạng
      case "baocao":
        return (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Mã Báo Cáo</th>
                <th>Mã Tài Xế</th>
                <th>Nội dung</th>
                <th>Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {data.map((bc, idx) => (
                <tr key={idx}>
                  <td>{bc.MaBC}</td>
                  <td>{bc.MaTX || "Không rõ"}</td>
                  <td>{bc.NoiDung}</td>
                  <td>{new Date(bc.ThoiGian).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      // Cảnh báo sự cố
      case "canhbao":
        return (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Mã cảnh báo</th>
                <th>Nội dung</th>
                <th>Thời gian</th>
                <th>Mã tài xế</th>
              </tr>
            </thead>
            <tbody>
              {data.map((cb, idx) => (
                <tr key={idx}>
                  <td>{cb.MaCB}</td>
                  <td>{cb.NoiDung}</td>
                  <td>{new Date(cb.ThoiGian).toLocaleString()}</td>
                  <td>{cb.MaTX}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      default:
        return null;
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.title}>🚍 Smart School Bus - Phụ huynh</h1>
        <button onClick={handleLogout} style={styles.logout}>
          Đăng xuất
        </button>
      </header>

      {/* Tabs */}
      <nav style={styles.nav}>
        {tables.map((t) => (
          <button
            key={t.key}
            style={{
              ...styles.tabButton,
              backgroundColor: activeTab === t.key ? "#16a34a" : "#e2e8f0",
              color: activeTab === t.key ? "white" : "#1e293b",
            }}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <main style={styles.main}>{renderTable()}</main>
    </div>
  );
}

// ==== STYLE ====
const styles = {
  container: {
    padding: "30px",
    fontFamily: "Poppins, sans-serif",
    background: "#f8fafc",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  title: { fontSize: "1.8rem", color: "#16a34a" },
  logout: {
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "8px 14px",
    cursor: "pointer",
  },
  nav: { display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "20px" },
  tabButton: {
    padding: "10px 16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "0.95rem",
    fontWeight: 500,
    transition: "0.2s",
  },
  main: {
    marginTop: "10px",
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "center",
    fontSize: "0.95rem",
  },
  error: {
    color: "red",
    background: "#fee2e2",
    padding: "10px",
    borderRadius: "8px",
  },
};

const css = `
table th {
  background-color: #16a34a;
  color: white;
  padding: 10px;
  text-align: center;
}
table td {
  padding: 8px;
  border: 1px solid #e5e7eb;
}
table tr:nth-child(even) {
  background-color: #f9fafb;
}
table tr:hover {
  background-color: #e0f2fe;
  transition: 0.2s;
}
`;
document.head.insertAdjacentHTML("beforeend", `<style>${css}</style>`);
