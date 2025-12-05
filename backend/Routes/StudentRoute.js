import express from 'express';
const router = express.Router();
import Student from '../Models/Student.js';

// --- ENDPOINTS ---

// 1. GET: Get all students
router.get('/', async (req, res) => {
    try {
        const students = await Student.Find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
})

// 2. POST: Add new student
router.post('/', async (req, res) => {
    try {
        const newStudent = await Student.create(req.body);
        res.status(201).json(newStudent);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
})

// 3. PUT: Update student Info
router.put('/:id', async (req, res) => {
    try {
        // Broken Object Level Authorization (BOLA): 
        // Cần đảm bảo người dùng có quyền sửa ID này
        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedStudent) {
            return res.status(404).json({ error: "Student not found" });
        }
        res.json(updatedStudent);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 4.  DELETE: Delete
router.delete('/:id', async (req, res) => {
    try {
        const result = await Student.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ error: "Student not found" });
        }
        res.json({ message: "Đã xóa thành công" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;