import User from "../Models/UserMd.js";
import catchAsync from "../Utils/catchAsync.js";
import HandleERROR from "../Utils/handleError.js";
import { sendAuthCode, verifyCode } from "../Utils/smsHandler.js";
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
export const auth = catchAsync(async (req, res, next) => {
    const { phoneNumber = null } = req.body
    
    if (!phoneNumber) {
        return next(new HandleERROR("PhoneNumber is required", 400))
    }
    const user = await User.findOne({ phoneNumber })
    if (user && user?.password) {
        return res.status(200).json({
            success: true,
            newAccount: false,
            password: true
        })
    } else {
        const resultSms = await sendAuthCode(phoneNumber)
        if (resultSms?.success) {
            return res.status(200).json({
                success: true,
                newAccount: user?._id ? false : true,
                password: false,
                message: "code sent"
            })
        } else {
            return res.status(404).json({
                success: false,
                newAccount: user?._id ? false : true,
                password: false,
                message: "check phone number and try again"
            })
        }
    }
})
export const checkOtp = catchAsync(async (req, res, next) => {
    const { phoneNumber = null, code = null, newAccount = 'unknown' } = req.body
    if (!phoneNumber || !code || newAccount == "unknown") {
        return next(new HandleERROR('phoneNumber and newAccount and password is required', 400))
    }
    const verifyResult = await verifyCode(phoneNumber, code)
    if (!verifyResult.success) {
        return next(new HandleERROR("invalid code", 400))
    }
    let user;
    if (newAccount == 'true') {
        user = await User.create({ phoneNumber })
    } else {
        user = await User.findOne({ phoneNumber })
    }
    const token = jwt.sign({ id: user._id, role: user.role, phoneNumber: user.phoneNumber }, process.env.JWT_SECRET)
    return res.status(newAccount ? 201 : 200).json({
        success: true,
        message: newAccount == 'true' ? 'register successfully' : 'login successfully',
        token,
        data: {
            phoneNumber,
            id: user._id,
            role: user.role,
            favoriteProduct: user?.favoriteProducts,
            fullName: user?.fullname
        }
    })
})
export const checkPassword = catchAsync(async (req, res, next) => {
    const { phoneNumber = null, password = null } = req.body
    if (!phoneNumber || !code) {
        return next(new HandleERROR('phoneNumber and password is required', 400))
    }
    const user = await User.findOne({ phoneNumber })
    if (!user) {
        return next(new HandleERROR('user not exist', 400))
    }
    const validPassword = bcryptjs.compareSync(password, user.password)
    if (!validPassword) {
        return next(new HandleERROR('password is incorrect', 400))
    }
    const token = jwt.sign({ id: user._id, role: user.role, phoneNumber: user.phoneNumber }, process.env.JWT_SECRET)
    return res.status(200).json({
        success: true,
        message: "login successfully",
        token,
        data: {
            phoneNumber,
            id: user._id,
            role: user.role,
            favoriteProduct: user?.favoriteProduct,
            fullName: user?.fullname
        }
    })
})
export const forgetPassword = catchAsync(async (req, res, next) => {
    const { phoneNumber = null, code = null, password = null } = req.body
    if (!phoneNumber || !code) {
        return next(new HandleERROR('phoneNumber ande code and password is required', 400))
    }
    const verifyResult = await verifyCode(phoneNumber, code)
    if (!verifyResult.success) {
        return next(new HandleERROR("invalid code", 400))
    }
    const regex = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,$/)
    if (!regex.test(password)) {
        return next(new HandleERROR('invalid password', 400))
    }
    const hashPassword = bcryptjs.hashSync(password, 10)
    const user = await User.findOneAndUpdate({ phoneNumber }, { password: hashPassword })
    const token = jwt.sign({ id: user._id, role: user.role, phoneNumber: user.phoneNumber }, process.env.JWT_SECRET)
    return res.status(200).json({
        success: true,
        message: "login successfully",
        token,
        data: {
            phoneNumber,
            id: user._id,
            role: user.role,
            favoriteProduct: user?.favoriteProducts,
            fullName: user?.fullname
        }
    })
})
export const resendCode = catchAsync(async (req, res, next) => {
    const { phoneNumber = null } = req.body
    if (!phoneNumber) {
        return next(new HandleERROR("PhoneNumber is required", 400))
    }
    const resultSms = await sendAuthCode(phoneNumber)
    return res.status(newAccount ? 201 : 200).json({
        success: resultSms.success,
        message: resultSms.success ? 'code sent' : resultSms.message,

    })
})

export const adminLogin = catchAsync(async(req,res,next)=>{
    const { phoneNumber = null, password = null } = req.body
    if (!phoneNumber || !code) {
        return next(new HandleERROR('phoneNumber and password is required', 400))
    }
    const user = await User.findOne({ phoneNumber })
    if (!user) {
       return next(new HandleERROR('user not exist', 400))
    }
    if (user?.role != 'admin'){
        return next(new HandleERROR('You are not admin', 400))

    }
    const validPassword = bcryptjs.compareSync(password, user.password)
    if (!validPassword) {
        return next(new HandleERROR('password is incorrect', 400))
    }
    const token = jwt.sign({ id: user._id, role: user.role, phoneNumber: user.phoneNumber }, process.env.JWT_SECRET)
    return res.status(200).json({
        success: true,
        message: "login successfully",
        token,
        data: {
            phoneNumber,
            id: user._id,
            role: user.role,
            fullName: user?.fullname
        }
    })
})