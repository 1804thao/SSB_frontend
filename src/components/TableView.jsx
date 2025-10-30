import React, { useState } from "react";

export default function TableView({ title, data, onRefresh }) {
const [tableData, setTableData] = useState([...data]); // ✅ Dữ liệu hiển thị tạm
const [newItem, setNewItem] = useState({});
const [editingRow, setEditingRow] = useState(null);

if (!tableData || tableData.length === 0)
return <p style={styles.info}>Không có dữ liệu cho bảng {title}.</p>;

const columns = Object.keys(tableData[0]);

// 🧩 Thêm mới (chỉ trên giao diện)
const handleAdd = () => {
if (Object.keys(newItem).length === 0)
return alert("❌ Chưa nhập dữ liệu mới!");
setTableData((prev) => [...prev, newItem]);
setNewItem({});
alert("✅ Đã thêm (chỉ hiển thị trên giao diện)");
};

// 🧩 Xóa (chỉ trên giao diện)
const handleDelete = (row) => {
if (!window.confirm("Bạn có chắc muốn xóa bản ghi này?")) return;
setTableData((prev) => prev.filter((r) => r !== row));
alert("🗑️ Đã xóa (chỉ hiển thị trên giao diện)");
};

// 🧩 Sửa (chỉ trên giao diện)
const handleEdit = (row) => setEditingRow({ ...row });
const handleSaveEdit = () => {
setTableData((prev) =>
prev.map((r) =>
r === editingRow.original ? editingRow : r
)
);
setEditingRow(null);
alert("✅ Đã cập nhật (chỉ hiển thị trên giao diện)");
};

return ( <div style={styles.tableWrapper}> <h2 style={styles.subtitle}>{title}</h2>

  {/* 🧩 Thêm mới */}
  <div style={styles.addForm}>
    {columns.map((col) => (
      <input
        key={col}
        type={col.toLowerCase().includes("thoigian") ? "datetime-local" : "text"}
        placeholder={col}
        value={newItem[col] || ""}
        onChange={(e) =>
          setNewItem((prev) => ({ ...prev, [col]: e.target.value }))
        }
        style={styles.input}
      />
    ))}
    <button onClick={handleAdd} style={styles.addButton}>
      Thêm mới
    </button>
  </div>

  {/* 🧩 Bảng dữ liệu */}
  <table style={styles.table}>
    <thead>
      <tr>
        {columns.map((col) => (
          <th key={col} style={styles.th}>{col}</th>
        ))}
        <th style={styles.th}>Hành động</th>
      </tr>
    </thead>
    <tbody>
      {tableData.map((row, i) => (
        <tr key={i}>
          {columns.map((col) => (
            <td key={col} style={styles.td}>
              {editingRow && editingRow.index === i ? (
                <input
                  type={col.toLowerCase().includes("thoigian") ? "datetime-local" : "text"}
                  value={editingRow[col] || ""}
                  onChange={(e) =>
                    setEditingRow((prev) => ({
                      ...prev,
                      [col]: e.target.value,
                    }))
                  }
                  style={styles.inputSmall}
                />
              ) : (
                row[col]
              )}
            </td>
          ))}
          <td style={styles.td}>
            {editingRow && editingRow.index === i ? (
              <>
                <button onClick={handleSaveEdit} style={styles.saveButton}>💾 Lưu</button>
                <button onClick={() => setEditingRow(null)} style={styles.cancelButton}>❌ Hủy</button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setEditingRow({ ...row, index: i, original: row })}
                  style={styles.editButton}
                >
                  ✏️ Sửa
                </button>
                <button
                  onClick={() => handleDelete(row)}
                  style={styles.deleteButton}
                >
                  🗑️ Xóa
                </button>
              </>
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </table>

  {/* 🧩 Làm mới lại dữ liệu gốc */}
  {onRefresh && (
    <button
      onClick={onRefresh}
      style={{ marginTop: "12px", background: "#94a3b8", color: "white", border: "none", padding: "8px 12px", borderRadius: "6px" }}
    >
      🔄 Làm mới dữ liệu gốc
    </button>
  )}
</div>
);
}

const styles = {
tableWrapper: { marginTop: "20px", overflowX: "auto" },
subtitle: { color: "#16a34a", fontSize: "1.3rem", marginBottom: "10px" },
table: {
width: "100%",
borderCollapse: "collapse",
background: "white",
borderRadius: "10px",
boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
},
th: {
background: "#16a34a",
color: "white",
padding: "10px",
textAlign: "left",
},
td: { padding: "8px 10px", borderBottom: "1px solid #eee" },
info: { color: "#475569", fontSize: "1rem", marginTop: "20px" },
addForm: { display: "flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap" },
input: { padding: "6px 8px", border: "1px solid #ccc", borderRadius: "6px" },
inputSmall: {
padding: "4px 6px",
border: "1px solid #ccc",
borderRadius: "4px",
width: "100%",
},
addButton: {
background: "#16a34a",
color: "white",
border: "none",
padding: "8px 14px",
borderRadius: "6px",
cursor: "pointer",
},
editButton: {
background: "#3b82f6",
color: "white",
border: "none",
padding: "6px 10px",
borderRadius: "6px",
cursor: "pointer",
marginRight: "6px",
},
deleteButton: {
background: "#ef4444",
color: "white",
border: "none",
padding: "6px 10px",
borderRadius: "6px",
cursor: "pointer",
},
saveButton: {
background: "#16a34a",
color: "white",
border: "none",
padding: "6px 10px",
borderRadius: "6px",
cursor: "pointer",
marginRight: "6px",
},
cancelButton: {
background: "#94a3b8",
color: "white",
border: "none",
padding: "6px 10px",
borderRadius: "6px",
cursor: "pointer",
},
};
