import catchAsync from "../Utils/catchAsync.js"
import jwt from 'jsonwebtoken'
import HandleError from "../Utils/handleError.js"
const isLogin=catchAsync(async(req,res,next)=>{
    try{
        const token=jwt.verify(req.headers.authorization.split(' ')[1],process.env.JWT_SECRET)
            return next()
    }catch(err){
        return next(new HandleError("Login First",401))
    }
})


export default isLogin