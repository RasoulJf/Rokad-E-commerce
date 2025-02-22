import mongoose from "mongoose";
const userSchema=new mongoose.Schema({
    fullname:{
        type:String
    },
    username:{
        type:String
    },
    password:{
        type:String
    },
    phoneNumber:{
        type:String,
        required :[true,'Phone Number Is Required'],
        match: [/^(\+98|0)?9\d{9}$/,'Phone Number Ivalid']
    },
    favoriteProducts:{
        type:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Product"
        }]
    },
    isComplete:{
        type:Boolean,
        default:false
    }
})
const User=mongoose.model("User",userSchema)
export default User