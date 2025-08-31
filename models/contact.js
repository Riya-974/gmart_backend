import mongoose from "mongoose";


const contactSchema=new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    phone:{type:String},
    message:{type:String,required:true},
    category:{type:mongoose.ObjectId, ref:"Category",required:true},
})


export const Contacts=mongoose.model("Contacts",contactSchema)