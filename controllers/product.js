import uploadcloudinary from "../cloudinary.js"
import { Category } from "../models/category.js"
import { Products } from "../models/product.js"

export const cretepro=async(req,res)=>{
    try {

        const {name,description,price,category}=req.body

        if(!name || !description || !price || !category){
            return res.json({message:"All fields are required", success:false})
        }

        if(!req.files.image1[0] || !req.files.image2[0] || !req.files.image3[0]){
          return  res.json({message:"Image is required",success:false})
        }


        const image1=await uploadcloudinary(req.files.image1[0].path)
         const image2=await uploadcloudinary(req.files.image2[0].path)
          const image3=await uploadcloudinary(req.files.image3[0].path)


          const product=await Products.create({
            name,
            description,
            price:Number(price),
            category,
            image1,
            image2,
            image3
          })

          res.json({message:"Product created",product,success:true})
        
    } catch (error) {
        console.log(error)
        res.json({
            message:"error in createpro",
            success:false,
            erro:error.message
        })
        
        
    }
}


//get pro


export const getpro=async(req,res)=>{
    try {
        const product=await Products.find({}).populate("category").limit(10)
        res.json({product,success:true})
    } catch (error) {
        console.log(error);
        
    }



}


// delete pro

export const deletpro=async(req,res)=>{

    try {

        const {id}=req.params


    const product=await Products.findByIdAndDelete(id)
    res.json({success:true,message:"Product deleted",product})
        
    } catch (error) {
        console.log(error.message);
        
        
    }
    

}



// catepto


export const categorypro=async(req,res)=>{
    try {


        const {id}=req.params
        
        const category=await Category.findById(id)
        const product=await Products.find({category:id}).populate("category")

        res.json({category,product,success:true})

    } catch (error) {
        console.log(error);
        
        
    }
}

// related

export const related=async(req,res)=>{
    try {

        const {pid,cid}=req.params

        const product=await Products.find({category:cid,_id:{$ne:pid}}).populate("category").limit(8)

        res.json({success:true,product})
        
    } catch (error) {
        console.log(error);
        
        
    }
}