import React, { useEffect, useState } from "react";

export default function ThongBao() {
  const [thongBao, setThongBao] = useState([]);
  const [form, setForm] = useState({ MaTB: "", NoiDung: "", ThoiGianGui: "", MaNV: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const apiUrl = "http://localhost:5000/api/thongbao";

  // 📥 Lấy danh sách thông báo
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(apiUrl);
      const data = await res.json();
      setThongBao(data);
    } catch (err) {
      console.error("❌ Lỗi tải dữ liệu:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✏️ Thêm hoặc cập nhật thông báo
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const method = isEditing ? "PUT" : "POST";
      const url = isEditing ? `${apiUrl}/${form.MaTB}` : apiUrl;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      alert(data.message || "Thao tác thành công");

      // 🔁 Làm mới dữ liệu sau khi thêm/sửa
      await fetchData();

      // Reset form
      setForm({ MaTB: "", NoiDung: "", ThoiGianGui: "", MaNV: "" });
      setIsEditing(false);
    } catch (err) {
      console.error("❌ Lỗi gửi dữ liệu:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // 🗑️ Xóa thông báo
  const handleDelete = async (MaTB) => {
    if (!window.confirm("Bạn có chắc muốn xóa thông báo này không?")) return;

    try {
      const res = await fetch(`${apiUrl}/${MaTB}`, { method: "DELETE" });
      const data = await res.json();
      alert(data.message);

      // 🔁 Làm mới dữ liệu sau khi xóa
      await fetchData();
    } catch (err) {
      console.error("❌ Lỗi xóa:", err);
    }
  };

  // ✍️ Chỉnh sửa thông báo
  const handleEdit = (tb) => {
    setForm(tb);
    setIsEditing(true);
  };

  return (
    <div>
      <h2 style={{ color: "#15803d", marginBottom: "15px" }}>Thông báo</h2>

      {/* Biểu mẫu thêm/sửa */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Mã TB"
          value={form.MaTB}
          onChange={(e) => setForm({ ...form, MaTB: e.target.value })}
          disabled={isEditing}
          required
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Nội dung"
          value={form.NoiDung}
          onChange={(e) => setForm({ ...form, NoiDung: e.target.value })}
          required
          style={styles.input}
        />
        <input
          type="datetime-local"
          value={form.ThoiGianGui}
          onChange={(e) => setForm({ ...form, ThoiGianGui: e.target.value })}
          required
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Mã NV"
          value={form.MaNV}
          onChange={(e) => setForm({ ...form, MaNV: e.target.value })}
          required
          style={styles.input}
        />

        <button type="submit" style={styles.btnSave} disabled={submitting}>
          {submitting
            ? "⏳ Đang lưu..."
            : isEditing
            ? "💾 Lưu thay đổi"
            : "Thêm mới"}
        </button>

        {isEditing && (
          <button
            type="button"
            onClick={() => {
              setForm({ MaTB: "", NoiDung: "", ThoiGianGui: "", MaNV: "" });
              setIsEditing(false);
            }}
            style={styles.btnCancel}
          >
            Hủy
          </button>
        )}
      </form>

      {/* Bảng dữ liệu */}
      {loading ? (
        <p>⏳ Đang tải...</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Mã TB</th>
              <th>Nội dung</th>
              <th>Thời gian gửi</th>
              <th>Mã NV</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {thongBao.map((tb) => (
              <tr key={tb.MaTB}>
                <td>{tb.MaTB}</td>
                <td>{tb.NoiDung}</td>
                <td>{new Date(tb.ThoiGianGui).toLocaleString("vi-VN")}</td>
                <td>{tb.MaNV}</td>
                <td>
                  <button onClick={() => handleEdit(tb)} style={styles.btnEdit}>
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(tb.MaTB)}
                    style={styles.btnDelete}
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// 🎨 Style
const styles = {
  form: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px",
    flexWrap: "wrap",
  },
  input: {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    flex: "1",
    minWidth: "150px",
  },
  btnSave: {
    background: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "8px 14px",
    cursor: "pointer",
  },
  btnCancel: {
    background: "#94a3b8",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "8px 14px",
    cursor: "pointer",
  },
  btnEdit: {
    background: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "5px",
    padding: "4px 8px",
    marginRight: "4px",
    cursor: "pointer",
  },
  btnDelete: {
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "5px",
    padding: "4px 8px",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "white",
    borderRadius: "6px",
    overflow: "hidden",
  },
};
