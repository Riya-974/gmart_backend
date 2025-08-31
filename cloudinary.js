import {v2 as cloudinary} from "cloudinary"
import dotenv from "dotenv"
import fs from "fs"
dotenv.config()



const uploadcloudinary=async(filePath)=>{

    cloudinary.config({
        api_key:process.env.API_KEY,
        api_secret:process.env.API_SECRET,
        cloud_name:process.env.CLOUD_NAME


    })





try {

    if(!filePath) return null
    const uploadResult=await cloudinary.uploader.upload(filePath)
    fs.unlinkSync(filePath)
    return uploadResult.secure_url
    
} catch (error) {
    if(fs.existsSync(filePath))fs.unlinkSync(filePath)
        console.log({message:"cloudinary upload fail",error});
    return null
        
    
}
}


export default uploadcloudinary