import express from 'express'
import cors from 'cors'
import connectDB from './Config/dbConfig.js';
import studentRoutes from './routes/StudentRoute.js';



const port = 5000
const app = express()

// --- MIDDLEWARE ---
app.use(cors())
app.use(express.json())
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