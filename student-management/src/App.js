import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  // State management
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: '', age: '', class: '' });
  const [editingId, setEditingId] = useState(null); // Editing ID
  const [searchTerm, setSearchTerm] = useState(""); // Searching keyword
  const [sortAsc, setSortAsc] = useState(true); // Sorting status

  // Fetch data when load page (Initial Load)
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/students');
      setStudents(res.data);
    } catch (error) {
      console.error("Lỗi kết nối API:", error);
    }
  };

  // Input handling
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Create / Update
  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn reload trang
    try {
      if (editingId) {
        // Logic Update (PUT)
        await axios.put(`http://localhost:5000/api/students/${editingId}`, form);
        setEditingId(null);
      } else {
        // Logic Create (POST)
        await axios.post('http://localhost:5000/api/students', form);
      }
      setForm({ name: '', age: '', class: '' }); // Reset form (Sanitize input field)
      fetchStudents(); // Refresh data
    } catch (error) {
      console.error("Lỗi gửi dữ liệu:", error);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa?")) {
      try {
        await axios.delete(`http://localhost:5000/api/students/${id}`);
        fetchStudents();
      } catch (error) {
        console.error("Lỗi xóa dữ liệu:", error);
      }
    }
  };

  // Edit mode
  const handleEdit = (student) => {
    setForm({ name: student.name, age: student.age, class: student.class });
    setEditingId(student._id);
  };

  // --- LOGIC PROCESSING DATA ---
  // 1. Search / Filtering
  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 2. Sorting
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (a.name < b.name) return sortAsc ? -1 : 1;
    if (a.name > b.name) return sortAsc ? 1 : -1;
    return 0;
  });

  return (
    <div className="App">
      <header className="App-header" style={{minHeight: 'auto', padding: '20px'}}>
        <h1>Quản Lý Học Sinh</h1>
      </header>

      <div style={{ padding: '20px' }}>
        {/* Form Input */}
        <div style={{ marginBottom: '20px' }}>
          <input name="name" placeholder="Tên" value={form.name} onChange={handleChange} />
          <input name="age" placeholder="Tuổi" type="number" value={form.age} onChange={handleChange} />
          <input name="class" placeholder="Lớp" value={form.class} onChange={handleChange} />
          <button onClick={handleSubmit}>
            {editingId ? "Cập nhật" : "Thêm mới"}
          </button>
        </div>

        {/* Search & Sort Controls */}
        <div style={{ marginBottom: '20px' }}>
          <input 
            placeholder="Tìm kiếm theo tên..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={() => setSortAsc(!sortAsc)} style={{marginLeft: '10px'}}>
            Sắp xếp: {sortAsc ? "A-Z" : "Z-A"}
          </button>
        </div>

        {/* Data Presentation (Table) */}
        <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Tên</th>
              <th>Tuổi</th>
              <th>Lớp</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {sortedStudents.map((s) => (
              <tr key={s._id}>
                <td>{s.name}</td>
                <td>{s.age}</td>
                <td>{s.class}</td>
                <td>
                  <button onClick={() => handleEdit(s)}>Sửa</button>
                  <button onClick={() => handleDelete(s._id)} style={{ color: 'red' }}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;