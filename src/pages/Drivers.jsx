import React, { useEffect, useState } from "react";
import TableView from "../components/TableView";
import { useNavigate } from "react-router-dom";

export default function Drivers() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("lichtrinh"); // tab mặc định
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 👉 State riêng cho báo cáo và cảnh báo (frontend-only)
  const [reports, setReports] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [reportText, setReportText] = useState("");
  const [alertText, setAlertText] = useState("");

  const tables = [
    { key: "lichtrinh", label: "Lịch làm việc" },
    { key: "hocsinh", label: "Danh sách học sinh" },
    { key: "baocao", label: "Báo cáo tình trạng" },
    { key: "canhbao", label: "Cảnh báo" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  useEffect(() => {
    // Nếu là tab báo cáo hoặc cảnh báo thì không fetch API
    if (activeTab === "baocao" || activeTab === "canhbao") return;
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

  // === GỬI BÁO CÁO LÊN SERVER ===
  const handleAddReport = async () => {
    if (!reportText.trim()) return;
    try {
      await fetch("http://localhost:5000/api/baocao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          NoiDung: reportText,
          MaNV: "TX01", // hoặc lấy từ localStorage tài xế hiện tại
        }),
      });
      setReportText("");
      alert("✅ Gửi báo cáo thành công!");
    } catch (err) {
      console.error("Lỗi gửi báo cáo:", err);
      alert("❌ Không gửi được báo cáo");
    }
  };

  // === GỬI CẢNH BÁO LÊN SERVER ===
  const handleAddAlert = async () => {
    if (!alertText.trim()) return;
    try {
      await fetch("http://localhost:5000/api/canhbao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          NoiDung: alertText,
          MaNV: "TX01",
        }),
      });
      setAlertText("");
      alert("🚨 Gửi cảnh báo thành công!");
    } catch (err) {
      console.error("Lỗi gửi cảnh báo:", err);
      alert("❌ Không gửi được cảnh báo");
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>
          🚍 Hệ thống Quản lý Smart School Bus - Tài xế
        </h1>
        <button onClick={handleLogout} style={styles.logout}>
          Đăng xuất
        </button>
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
        {/* Lịch trình và học sinh dùng TableView */}
        {(activeTab === "lichtrinh" || activeTab === "hocsinh") && (
          <>
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
          </>
        )}

        {/* 📝 Tab Báo cáo tình trạng */}
        {activeTab === "baocao" && (
          <div style={styles.box}>
            <h3>📝 Báo cáo tình trạng</h3>
            <input
              type="text"
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              placeholder="Nhập nội dung báo cáo..."
              style={styles.input}
            />
            <button onClick={handleAddReport} style={styles.addBtn}>
              Gửi báo cáo
            </button>
            <ul style={styles.list}>
              {reports.map((r) => (
                <li key={r.id}>📋 {r.text}</li>
              ))}
            </ul>
          </div>
        )}

        {/* ⚠️ Tab Cảnh báo */}
        {activeTab === "canhbao" && (
          <div style={styles.box}>
            <h3>⚠️ Cảnh báo sự cố</h3>
            <input
              type="text"
              value={alertText}
              onChange={(e) => setAlertText(e.target.value)}
              placeholder="Nhập nội dung cảnh báo..."
              style={styles.input}
            />
            <button onClick={handleAddAlert} style={styles.addBtn}>
              Gửi cảnh báo
            </button>
            <ul style={styles.list}>
              {alerts.map((a) => (
                <li key={a.id}>🚨 {a.text}</li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}

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
  box: {
    background: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  input: {
    width: "80%",
    padding: "8px",
    marginRight: "10px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
  },
  addBtn: {
    background: "#16a34a",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  list: { marginTop: "15px", listStyle: "none", paddingLeft: "0" },
  error: {
    color: "red",
    background: "#fee2e2",
    padding: "10px",
    borderRadius: "8px",
  },
};
