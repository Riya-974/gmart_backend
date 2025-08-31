import nodemailer from "nodemailer"
import { Contacts } from "../models/contact.js"


export const contact=async(req,res)=>{
    try {

        const {name,email,phone,message,category}=req.body

        if(!name || !email || !message || !category){
            return res.json({message:"name,email,message,category is required", success:false})
        }


        const contact=await Contacts.create({
            name,
            email,
            phone,
            message,
            category
        })

        const contacts=await Contacts.findById(contact._id).populate("category")

        const transporter=nodemailer.createTransport({
            service:"gmail",
            auth:{user:process.env.EMAIL_USER, pass:process.env.EMAIL_PASSWORD}
        })

        const mailOption={
            from:process.env.EMAIL_USER,
            to:process.env.RECIVER_EMAIL,
            subject:`New Contact from ${name} (${category})`,
            text:
            `Name:${name}
            Email:${email}
            Phone:${phone||"-"}
            Category:${category}
            Message:${message}
            `
            ,

            replyTo:email

        };

        await transporter.sendMail(mailOption)
        return res.json({message:"Message sent",contacts,success:true})
        
    } catch (error) {
        console.log(error.message)
        res.json({
            success:false,
            message:"error in contact",
            error:error.message
        })
        
        
    }
}