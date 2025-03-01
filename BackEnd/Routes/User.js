import express from 'express'
import isAdmin from '../MiddleWare/isAdmin.js'
import isLogin from '../MiddleWare/isLogin.js'
import { getAllUsers, getOneUser, updateUser } from '../Controllers/UserCn'

const userRouter = express.Router()

userRouter.route('/').get(isAdmin,getAllUsers)
userRouter.route('/:id').get(isLogin,getOneUser).patch(isLogin,updateUser)

export default userRouter