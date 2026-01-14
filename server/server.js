const express = require("express")
const cors = require("cors")
require("dotenv").config()
const connectDB = require("./configs/db")
const userRouter = require("./routes/userRoutes")
const resumeRouter = require("./routes/resumeRoutes")
const aiRouter = require("./routes/aiRoutes")

const app = express()

const PORT = process.env.PORT || 3000

// database connection
connectDB();

app.use(express.json())
app.use(cors())

app.get('/' , (req , res) => res.send("server is live.."))
app.use('/api/users' , userRouter)
app.use('/api/resumes' , resumeRouter)
app.use('/api/ai' , aiRouter)

app.listen(PORT , () => {
    console.log(`server is running on port ${PORT}`)
})