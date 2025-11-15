import React, { useEffect, useState } from "react";
import TableView from "../components/TableView";
import { useNavigate } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa"; // 🗑 icon xóa

export default function Drivers() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("lichtrinh");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);   // hiển thị trạng thái tải
  const [error, setError] = useState(null);

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
    navigate("/login");                   // Xóa key userRole khỏi localStorage → sau đó chuyển về trang Login
  };

  // ⚙️ Fetch dữ liệu mỗi khi đổi tab
  useEffect(() => {
    if (activeTab === "baocao") fetchReports();
    else if (activeTab === "canhbao") fetchAlerts();
    else fetchData();
  }, [activeTab]);

  // 🔹 Fetch lịch trình hoặc học sinh
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

  // 🔹 Fetch Báo cáo
  const fetchReports = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/baocao");
      if (!res.ok) throw new Error("Lỗi tải danh sách báo cáo");
      const result = await res.json();
      setReports(result);
    } catch (err) {
      console.error("Lỗi khi tải báo cáo:", err);
    }
  };

  // 🔹 Fetch Cảnh báo
  const fetchAlerts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/canhbao");
      if (!res.ok) throw new Error("Lỗi tải danh sách cảnh báo");
      const result = await res.json();
      setAlerts(result);
    } catch (err) {
      console.error("Lỗi khi tải cảnh báo:", err);
    }
  };

  // ✅ Gửi Báo cáo tình trạng
  const handleAddReport = async () => {
    if (!reportText.trim()) return alert("Vui lòng nhập nội dung báo cáo!");
    try {
      const res = await fetch("http://localhost:5000/api/baocao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ NoiDung: reportText, MaTX: "TX01" }),
      });

      if (!res.ok) throw new Error("Không gửi được báo cáo");

      const newReport = await res.json();
      setReports((prev) => [...prev, newReport]);
      setReportText("");
      alert("✅ Gửi báo cáo thành công!");
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi gửi báo cáo");
    }
  };

  // ✅ Gửi Cảnh báo
  const handleAddAlert = async () => {
    if (!alertText.trim()) return alert("Vui lòng nhập nội dung cảnh báo!");
    try {
      const res = await fetch("http://localhost:5000/api/canhbao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ NoiDung: alertText, MaTX: "TX01" }),
      });

      if (!res.ok) throw new Error("Không gửi được cảnh báo");

      const newAlert = await res.json();
      setAlerts((prev) => [...prev, newAlert]);
      setAlertText("");
      alert("🚨 Gửi cảnh báo thành công!");
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi gửi cảnh báo");
    }
  };

  // 🗑 Xóa Báo cáo
  const handleDeleteReport = async (MaBC) => {
    if (!window.confirm("Bạn có chắc muốn xóa báo cáo này không?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/baocao/${MaBC}`, {
        method: "DELETE",
      });
      const data = await res.json();
      alert(data.message);
      fetchReports();
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi xóa báo cáo");
    }
  };

  // 🗑 Xóa Cảnh báo
  const handleDeleteAlert = async (MaCB) => {
    if (!window.confirm("Bạn có chắc muốn xóa cảnh báo này không?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/canhbao/${MaCB}`, {
        method: "DELETE",
      });
      const data = await res.json();
      alert(data.message);
      fetchAlerts();
    } catch (err) {
      console.error(err);
      alert("❌ Lỗi khi xóa cảnh báo");
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>🚍 Hệ thống Quản lý Smart School Bus - Tài xế</h1>
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

        {/* 📝 Báo cáo tình trạng */}
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
                <li key={r.MaBC} style={styles.listItem}>
                  📋 {r.NoiDung}
                  <button
                    onClick={() => handleDeleteReport(r.MaBC)}
                    style={styles.deleteBtn}
                  >
                    <FaTrashAlt /> Xóa
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ⚠️ Cảnh báo */}
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
                <li key={a.MaCB} style={styles.listItem}>
                  🚨 {a.NoiDung}
                  <button
                    onClick={() => handleDeleteAlert(a.MaCB)}
                    style={styles.deleteBtn}
                  >
                    <FaTrashAlt /> Xóa
                  </button>
                </li>
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
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#f1f5f9",
    padding: "8px 12px",
    borderRadius: "6px",
    marginBottom: "8px",
  },
  deleteBtn: {
    background: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "6px 10px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    transition: "0.3s",
  },
  deleteBtnHover: {
    background: "#b91c1c",
  },
  error: {
    color: "red",
    background: "#fee2e2",
    padding: "10px",
    borderRadius: "8px",
  },
};
