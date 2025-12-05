import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'
import StudentForm from './components/AddStudentForm';

function App() {
  // State management
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: '', age: '', class: '' });
  const [editingId, setEditingId] = useState(null); // Editing ID
  const [searchTerm, setSearchTerm] = useState(""); // Searching keyword
  const [sortAsc, setSortAsc] = useState(true); // Sorting status

  // Fetch data when load page (Initial Load)
  useEffect(() => {
    // Tạo một bộ đếm thời gian (Timer)
    const delayDebounceFn = setTimeout(() => {
      fetchStudents(searchTerm); // Chỉ gọi API sau khi ngừng gõ 500ms
    }, 500);

    // Cleanup function: Xóa timer cũ nếu người dùng gõ tiếp trước 500ms
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const fetchStudents = async (keyword = "") => {
    try {
      // Gửi Query Parameter lên Server (Sanitization tự động bởi axios)
      const url = keyword
        ? `http://localhost:5000/api/students?name=${keyword}`
        : 'http://localhost:5000/api/students';

      const res = await axios.get(url);
      setStudents(res.data);
    } catch (error) {
      console.error("Connection Error:", error);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingStudent) {
        // --- LOGIC UPDATE (PUT) ---
        // Privilege Escalation Check: Đảm bảo user có quyền sửa resource này (thường check ở Backend)
        await axios.put(`http://localhost:5000/api/students/${editingStudent._id}`, formData);
        alert("Cập nhật thành công!");
        setEditingStudent(null); // Thoát chế độ sửa
      } else {
        // --- LOGIC CREATE (POST) ---
        await axios.post('http://localhost:5000/api/students', formData);
        alert("Thêm mới thành công!");
      }
      fetchStudents(); // Refresh data để đảm bảo tính toàn vẹn (Integrity)
    } catch (error) {
      console.error("API Error:", error);
      alert(error.response?.data?.error || "Có lỗi xảy ra");
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
    // Confirmation Dialog (Cơ chế an toàn UX)
    // Ngăn chặn việc click nhầm gây mất dữ liệu (Data Loss Prevention)
    if (window.confirm("CẢNH BÁO: Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa?")) {
      try {
        await axios.delete(`http://localhost:5000/api/students/${id}`);

        // Cập nhật giao diện (UI Update)
        // Cách 1: Gọi lại API
        fetchStudents();

        // Cách 2: Tự lọc mảng local để giao diện phản hồi nhanh hơn
        // setStudents(prev => prev.filter(s => s._id !== id));

        alert("Đã xóa học sinh khỏi hệ thống.");
      } catch (error) {
        console.error("Delete Error:", error);
        alert("Lỗi: Không thể xóa học sinh. Vui lòng thử lại.");
      }
    }
  };

  const handleEditClick = (student) => {
    setEditingStudent(student); // Kích hoạt chế độ sửa, truyền dữ liệu vào form
  };

  const handleCancelEdit = () => {
    setEditingStudent(null); // Reset về chế độ thêm mới
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
  const sortedStudents = [...students].sort((a, b) => {
    if (a.name < b.name) return sortAsc ? -1 : 1;
    if (a.name > b.name) return sortAsc ? 1 : -1;
    return 0;
  });

  return (
    <div className="App">
      <header className="App-header" style={{ minHeight: 'auto', padding: '20px', fontSize: '20px' }}>
        <p>Quản Lý Học Sinh (Secure MERN App)</p>
      </header>

      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>

        {/* Tái sử dụng Component StudentForm */}
        <StudentForm
          onSubmit={handleFormSubmit}
          initialData={editingStudent}
          onCancel={handleCancelEdit}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <input
            placeholder="Tìm kiếm theo tên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '5px', width: '60%' }}
          />
          <button onClick={() => setSortAsc(!sortAsc)} style={{ padding: '5px' }}>
            Sắp xếp: {sortAsc ? "A-Z" : "Z-A"}
          </button>
        </div>

        <table border="1" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead style={{ backgroundColor: '#f2f2f2' }}>
            <tr>
              <th style={{ padding: '10px' }}>Tên</th>
              <th style={{ padding: '10px' }}>Tuổi</th>
              <th style={{ padding: '10px' }}>Lớp</th>
              <th style={{ padding: '10px' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {sortedStudents.length > 0 ? (
              sortedStudents.map((s) => (
                <tr key={s._id}>
                  <td style={{ padding: '8px' }}>{s.name}</td>
                  <td style={{ padding: '8px', textAlign: 'center' }}>{s.age}</td>
                  <td style={{ padding: '8px', textAlign: 'center' }}>{s.class}</td>
                  <td style={{ padding: '8px', textAlign: 'center' }}>
                    <button onClick={() => handleEditClick(s)} style={{ marginRight: '5px', cursor: 'pointer' }}>Sửa</button>
                    <button onClick={() => handleDelete(s._id)} style={{ color: 'red', cursor: 'pointer' }}>Xóa</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>Không tìm thấy dữ liệu</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;