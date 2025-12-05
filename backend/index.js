import express from 'express'
import cors from 'cors'
import connectDB from './Config/dbConfig'

const port = 5000
const app = express()

connectDB()

app.use(cors())

app.get('/', (req,res) =>{
    res.send('Hello World!')
})

app.listen(port, ()=>{
    console.log(`Example app is listening at ${port}`)
})