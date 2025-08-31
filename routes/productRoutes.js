import express from "express"
import upload from "../middlewears/multer.js"
import { categorypro, cretepro, deletpro, getpro, related } from "../controllers/product.js"

const router=express.Router()

router.post("/createpro",upload.fields([{name:"image1",maxCount:1},
    {name:"image2",maxCount:1},{name:"image3",maxCount:1}]),cretepro)

    router.get("/getproduct",getpro)
     router.delete("/deletepro/:id",deletpro)
    router.get("/categorypro/:id",categorypro)
    router.get("/related/:pid/:cid",related)






    export default router