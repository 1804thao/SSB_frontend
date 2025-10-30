import React, { useEffect, useState } from "react";
import TableView from "../components/TableView";
import { useNavigate } from "react-router-dom";

export default function Parents() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("hocsinh"); // tab mặc định
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Danh sách tab phụ huynh có thể xem
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

  // Gọi dữ liệu từ backend mỗi khi đổi tab
  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:5000/api/${activeTab}`);
      if (!res.ok) throw new Error(`Lỗi tải bảng ${activeTab}`);
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error(err);
      setError("Không thể tải dữ liệu từ máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Thanh tiêu đề */}
      <header style={styles.header}>
        <h1 style={styles.title}>🚍 Smart School Bus - Phụ huynh</h1>
        <button onClick={handleLogout} style={styles.logout}>
          Đăng xuất
        </button>
      </header>

      {/* Thanh menu tab */}
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

      {/* Nội dung */}
      <main style={styles.main}>
        {loading && <p>⏳ Đang tải dữ liệu...</p>}
        {error && <p style={styles.error}>{error}</p>}

        {!loading && !error && (
          <TableView
            title={tables.find((t) => t.key === activeTab)?.label}
            data={data}
            activeTab={activeTab}
            onRefresh={fetchData}
          />
        )}
      </main>
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
  main: { marginTop: "10px" },
  error: {
    color: "red",
    background: "#fee2e2",
    padding: "10px",
    borderRadius: "8px",
  },
};
