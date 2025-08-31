import express from "express"
import { create, deletcat, getcat } from "../controllers/category.js"
import upload from "../middlewears/multer.js"

const router=express.Router()

router.post("/createcat",upload.fields([{name:"image",maxCount:1}]),create)
router.get("/getcat",getcat)
router.delete("/deletecat/:id",deletcat)

export default router