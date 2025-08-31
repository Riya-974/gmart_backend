import express, { json } from "express"
import dotenv from "dotenv"
import { db } from "./db.js"
import cors from "cors"
import categoryRoutes from "./routes/categoryRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import contactRoutes from "./routes/contactRoutes.js"
dotenv.config()

const app=express()

//middlewears

app.use(cors())
app.use(express.json())


app.get("/",(req,res)=>{
    return res.json({message:"connexted"})
})


//routes
app.use("/api/v1/category",categoryRoutes)
app.use("/api/v1/products",productRoutes)
app.use("/api/v1/contacts",contactRoutes)

db()
const port=process.env.PORT



app.listen(port,()=>console.log(`server is running on ${port}`))