import React, { useState } from "react";

export default function ReportForm({ type, onSuccess }) {
  const [NoiDung, setNoiDung] = useState("");
  const [loading, setLoading] = useState(false);

  // 🚀 Hàm xử lý gửi form
  const handleSubmit = async (e) => {
    e.preventDefault();                // e.preventDefault() để chặn reload trang mặc định của form
    if (!NoiDung.trim()) return alert("Vui lòng nhập nội dung!");

    setLoading(true);
    try {
      // 🌐 Gửi dữ liệu đến server
      const MaTX = localStorage.getItem("MaTX") || "TX01";            // mã tài xế đang đăng nhập
      const res = await fetch(`http://localhost:5000/api/${type}`, {
        method: "POST",                                              // gửi dữ liệu mới lên server (thêm mới vào CSDL)
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ NoiDung, MaTX }),
      });

      const result = await res.json();
      if (res.ok) {
        alert(result.message);
        setNoiDung("");
        onSuccess(); // gọi lại fetchData() từ Drivers.jsx
      } else {
        alert("Lỗi: " + result.message);
      }
    } catch (err) {
      alert("Không thể gửi dữ liệu tới server!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>  
      <h3 style={{ color: "#16a34a" }}>
        📝 {type === "baocao" ? "Gửi báo cáo tình trạng" : "Gửi cảnh báo sự cố"}
      </h3>
      <textarea
        value={NoiDung}
        onChange={(e) => setNoiDung(e.target.value)}
        placeholder="Nhập nội dung..."
        rows="3"
        style={styles.textarea}
      />
      <button type="submit" disabled={loading} style={styles.button}>
        {loading ? "Đang gửi..." : "Gửi ngay"}
      </button>
    </form>
  );
}

const styles = {
  form: {
    background: "#fff",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "20px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  textarea: {
    width: "100%",
    borderRadius: "8px",
    border: "1px solid #ccc",
    padding: "8px",
    marginTop: "8px",
    resize: "vertical",
  },
  button: {
    marginTop: "10px",
    padding: "8px 16px",
    border: "none",
    background: "#16a34a",
    color: "white",
    borderRadius: "8px",
    cursor: "pointer",
  },
};
