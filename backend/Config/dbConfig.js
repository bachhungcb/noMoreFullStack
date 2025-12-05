import mongoose from 'mongoose';

function connectDB() {
    mongoose.connect('mongodb://localhost:27017/student_db')
        .then(() => console.log("Đã kết nối MongoDB thành công"))
        .catch(err => console.error("Lỗi kết nối MongoDB:", err));
}

export default connectDB;