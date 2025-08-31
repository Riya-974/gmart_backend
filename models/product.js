import mongoose from "mongoose";

const productSchema=new mongoose.Schema({
    name:{type:String,required:true},
    description:{type:String,required:true},
    price:{type:Number,required:true},
    category:{type:mongoose.ObjectId,ref:"Category",required:true},
    image1:{type:String,required:true},
      image2:{type:String,required:true},
        image3:{type:String,required:true},

    
},{timestamps:true})


export const Products=mongoose.model("Products",productSchema)