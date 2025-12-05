import express from 'express'
import cors from 'cors'
import connectDB from './Config/dbConfig'
import Student from './Models/Student.js'
import { json } from 'body-parser'
const studentRoutes = require('./routes/students');

const port = 5000
const app = express()

// --- MIDDLEWARE ---
app.use(cors())
app.use(json())

// --- CONNECT TO DATABASE ---
connectDB()


// --- API ENDPOINTS ---
app.get('/', (req, res) => {
    res.send('Server Management API is running...');
});

// Student
app.use('/api/students', studentRoutes);

app.listen(port, ()=>{
    console.log(`Example app is listening at ${port}`)
})