import uploadcloudinary from "../cloudinary.js"
import { Category } from "../models/category.js"

export const create=async(req,res)=>{
    try {
        const {name,about}=req.body
        if(!name || !about){
            return res.json({messsage:"Name and About are required",success:false})
        }

        if(!req.files.image[0]){
            return res.json({message:"image is required",success:false})
        }

        const upload=await uploadcloudinary(req.files.image[0].path)
        if(!upload){
            return res.json({message:"image upload failed",success:false})
        }

        const category=await Category.create({
            name,
            about,
            image:upload
        })


        res.json({message:'category created',category,success:true})
        
    } catch (error) {
        console.log(error);
        
        
    }
}


//get cat

export const getcat=async(req,res)=>{
    try {

        const category=await Category.find({})
        res.json({success:true,category})
        
    } catch (error) {
        console.log(error);
        
        
    }
}



// delete cat

export const deletcat=async(req,res)=>{

    try {

        const {id}=req.params


    const category=await Category.findByIdAndDelete(id)
    res.json({success:true,message:"Category deleted",category})
        
    } catch (error) {
        console.log(error.message);
        
        
    }
}