import React, {useState, useEffect} from 'react'

const StudentForm = ({ onSubmit, initialData, onCancel }) => {
    // State local của form
    const [form, setForm] = useState({ name: '', age: '', class: '' });

    // Payload Injection: Dữ liệu initialData được đổ vào form khi chế độ sửa được kích hoạt
    useEffect(() => {
        if (initialData) {
            setForm(initialData);
        } else {
            setForm({ name: '', age: '', class: '' });
        }
    }, [initialData]);

    const handleChange = (e) => {
        // Input Sanitization nên được thực hiện ở đây nếu cần thiết
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Client-side Validation
        if (!form.name || !form.age || !form.class) {
            alert("Vui lòng điền đầy đủ thông tin (Missing Fields)");
            return;
        }
        
        // Gọi hàm callback từ component cha để xử lý logic API
        onSubmit(form);
        
        // Reset form nếu đang ở chế độ thêm mới
        if (!initialData) {
            setForm({ name: '', age: '', class: '' });
        }
    };

    return (
        <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
            <h3>{initialData ? "Chỉnh Sửa Thông Tin" : "Thêm Học Sinh Mới"}</h3>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <input 
                        name="name" 
                        placeholder="Họ và tên" 
                        value={form.name} 
                        onChange={handleChange} 
                        style={{ marginRight: '10px', padding: '5px' }}
                    />
                    <input 
                        name="age" 
                        placeholder="Tuổi" 
                        type="number" 
                        value={form.age} 
                        onChange={handleChange} 
                        style={{ marginRight: '10px', padding: '5px', width: '60px' }}
                    />
                    <input 
                        name="class" 
                        placeholder="Lớp" 
                        value={form.class} 
                        onChange={handleChange} 
                        style={{ marginRight: '10px', padding: '5px', width: '100px' }}
                    />
                </div>
                <div>
                    <button type="submit" style={{ cursor: 'pointer', padding: '5px 10px', backgroundColor: '#4CAF50', color: 'white', border: 'none' }}>
                        {initialData ? "Cập Nhật (Update)" : "Thêm (Create)"}
                    </button>
                    
                    {/* Nút hủy chỉ hiện khi đang sửa */}
                    {initialData && (
                        <button 
                            type="button" 
                            onClick={onCancel}
                            style={{ marginLeft: '10px', cursor: 'pointer', padding: '5px 10px', backgroundColor: '#f44336', color: 'white', border: 'none' }}
                        >
                            Hủy (Cancel)
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default StudentForm;