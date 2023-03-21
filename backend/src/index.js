import express from "express"
import categoryRouter from "./routes/category.js"
import facultyRouter from "./routes/faculty.js"
import userRouter from "./routes/user.js"

const app = express()

app.use(express.json())

// bind 
app.use(userRouter)
app.use(facultyRouter)
app.use(categoryRouter)

app.listen(3000, () => console.log("Server is running on port 3000"))