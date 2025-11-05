import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ThongBao from "./ThongBao";
import TableView from "../components/TableView";

export default function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("admin");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const tables = [
    { key: "admin", label: "Quản trị viên" },
    { key: "taixe", label: "Tài xế" },
    { key: "xebus", label: "Xe bus" },
    { key: "lichtrinh", label: "Lịch trình" },
    { key: "tuyenduong", label: "Tuyến đường" },
    { key: "hocsinh", label: "Học sinh" },
    { key: "phuhuynh", label: "Phụ huynh" },
    { key: "hanhtrinh", label: "Hành trình" },
    { key: "thongbao", label: "Thông báo" },
    { key: "baocao", label: "Báo cáo từ tài xế" },
    { key: "canhbao", label: "Cảnh báo sự cố" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`http://localhost:5000/api/${activeTab}`);
      if (!res.ok) throw new Error(`Lỗi tải bảng ${activeTab}`);
      const data = await res.json();
      setData(data);
    } catch (err) {
      console.error(err);
      setError("Không thể tải dữ liệu từ máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div style={styles.container}>
    <header style={styles.header}>
      <h1 style={styles.title}>🚍 Hệ thống Quản lý Smart School Bus</h1>
      <button onClick={handleLogout} style={styles.logout}>Đăng xuất</button>
    </header>

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

    <main style={styles.main}>
      {loading && <p>⏳ Đang tải dữ liệu...</p>}
      {error && <p style={styles.error}>{error}</p>}

      {!loading && !error && (
            <TableView
              title={tables.find((t) => t.key === activeTab)?.label}
              data={data}
              setData={setData}
              activeTab={activeTab}
            />
          )}
    </main>
  </div>
);
}

const styles = {
  container: { padding: "30px", fontFamily: "Poppins, sans-serif", background: "#f8fafc", minHeight: "100vh" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  title: { fontSize: "1.8rem", color: "#16a34a" },
  logout: { background: "#ef4444", color: "white", border: "none", borderRadius: "8px", padding: "8px 14px", cursor: "pointer" },
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
  error: { color: "red", background: "#fee2e2", padding: "10px", borderRadius: "8px" },
};
