import express from 'express'
import { bookAppointment, getProfile, loginUser, registerUser, updateProfile,listAppoinment,cancleAppointment, payementRazorpay, verifyPayment } from '../controllers/userController.js'
import authUser from '../middlewares/authUser.js'
import upload from '../middlewares/multer.js'
const userRouter=express.Router()


userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)

userRouter.get('/get-profile',authUser,getProfile)
userRouter.post('/update-profile',upload.single('image'),authUser,updateProfile)
userRouter.post('/book-appointment',authUser,bookAppointment)
userRouter.get('/appointments',authUser,listAppoinment)
userRouter.post('/cancle-appointment',authUser,cancleAppointment)
userRouter.post('/appointment-payment',authUser,payementRazorpay)
userRouter.post('/verify-payment',authUser,verifyPayment)

export default userRouter