import express from "express"
import upload from "../middlewares/multer.js"
import { addDoctor, allDoctors, appointmentsAdmin, loginAdmin,appointmentCancle,adminDashboard } from "../controllers/adminController.js"
import authAdmin from "../middlewares/authAdmin.js"
import { getChangeAvailablity } from "../controllers/doctorController.js"


const adminRouter=express.Router()
 
adminRouter.post('/add-doctor',authAdmin,upload.single('image'),addDoctor)
adminRouter.post('/login',loginAdmin)
adminRouter.post('/all-doctors',authAdmin,allDoctors)
adminRouter.post('/change-availablity',authAdmin,getChangeAvailablity)
adminRouter.get('/appointments',authAdmin,appointmentsAdmin)
adminRouter.post('/cancle-appointment',authAdmin,appointmentCancle)
adminRouter.get('/dashboard',authAdmin,adminDashboard)


export default adminRouter

