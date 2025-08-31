import mongoose from "mongoose"

export const db=()=>{
    try {

        mongoose.connect(process.env.MONGO_URL,{
            dbName:"Nazia_web"
        })

        console.log("MONGODP CONNNECTED");
        
        
    } catch (error) {
        console.log(error);
        
        
    }
}