import User from "../Models/UserMd";
import catchAsync from "../Utils/catchAsync.js";
import HandleERROR from "../Utils/handleError.js";
import { sendAuthCode } from "../Utils/smsHandler.js";

export const auth = catchAsync(async (req,res,next) => {
    const {phoneNumber=null} = req.body
    if(!phoneNumber){
        return next(new HandleERROR('Phone Number is Require',400))
    }
    const user = await User.findOne({phoneNumber})
    if(user&&user?.password){
return res.status(200).json({
    success:true,
    newAccount:false,
    password:true
})
    }else{
        const resultSms = await sendAuthCode(phoneNumber)
        if(resultSms?.success){
            return res.status(200).json({
                success:true,
                newAccount:user?._id?false:true,
                password:false,
                message:'Code Sent' 
            })
        }else{
            return res.status(200).json({
                success:true,
                newAccount:user?._id?false:true,
                password:false,
                message:'Check Phone Number and try again' 
        })
    }}
})
export const checkOtp = catchAsync(async (req,res,next) => {
   
})
export const checkPassword = catchAsync(async (req,res,next) => {
   
})
export const forgetPassword = catchAsync(async (req,res,next) => {
   
})
export const resendCode = catchAsync(async (req,res,next) => {
   
})