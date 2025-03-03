import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import Razorpay from 'razorpay';
import { useNavigate } from 'react-router-dom';

const MyAppoinments = () => {
  const {backend_url,token,getDoctorsData,}=useContext(AppContext)

  const [appointments,SetAppointments] =useState([])

  const months = ['','Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const slotDateFormat=(slotDate)=>{

    const dateArray=slotDate.split('_')
    return dateArray[0]+" "+months[Number(dateArray[1])]+" "+dateArray[2];
  } 
   
  const navigate=useNavigate()

  const getUserAppointments=async()=>{
    try {

      const {data}=await axios.get(backend_url+'/api/user/appointments',{headers:{token}})

      if(data.success){
        SetAppointments(data.appointments.reverse())
      }
      
    } catch (error) {
      console.log(error.message)
      toast.error(error.message)
      
    }
  }


  const cancleAppointment=async(appointmentId)=>{
    try {

      const {data}=await axios.post(backend_url+'/api/user/cancle-appointment',{appointmentId},{headers:{token}})

      if(data.success){
        toast.success(data.message)
        getUserAppointments()
        getDoctorsData()
      }
      else{
        toast.error(data.message)
      }
      
    } catch (error) {
      console.log(error.message)
      toast.error(error.message)
      
    }

  }


  const init=(order)=>{
    
    const options={
      key:import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount:order.amount,
      currency:order.currency,
      name:'Appointment Payment',
      description:'Appointment Payment',
      order_id:order.id,
      reciept:order.receipt,
      handler: async (response)=>{
        console.log("response",response)
        try {
          const {data}=await axios.post(backend_url+'/api/user/verify-payment',response,{headers:{token}})
          if(data.success){
            getUserAppointments()
            navigate('/my-appoinments')
          }
        } catch (error) {
          console.log(error)
          toast.error(error.message)      
        }
      }
    }


    const rzp =new window.Razorpay(options)
    rzp.open()

  }

  const appointmentRazorpay=async(appointmentId)=>{

    try {

      const {data}=await axios.post(backend_url+'/api/user/appointment-payment',{appointmentId},{headers:{token}})

      if(data.success){
        init(data.order)
      }

      
    } catch (error) {
      console.log(error.message)
      toast.error(error.message)
      
      
    }

  }

  useEffect(() => {
    if(token){
      getUserAppointments();
    }
  
  }, [token])
  



  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My Appoinments</p>
      <div>
        {
          appointments.map((item,index)=>(
            <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b' key={index}>
              <div>
                <img className='w-32 bg-indigo-50' src={item.docData.image} alt="" />
              </div>
              <div className='flex-1 text-sm text-zinc-600'>
                <p className='text-neutral-800 font-semibold'>{item.docData.name}</p>
                <p>{item.speciality}</p>
                <p className='font-medium mt-1 text-zinc-700'>Address:</p>
                <p className='text-xs'>{item.docData.address.line1}</p>
                <p className='text-xs'>{item.docData.address.line2}</p>
                <p className='mt-1 text-xs'><span className='text-sm font-medium text-neutral-700'>Date & Time: </span><span> {slotDateFormat(item.slotDate)} |  {item.slotTime}</span></p>
              </div>
              <div></div>
              <div className='flex flex-col gap-2 justify-end'>
                {!item.cancelled && item.payment && !item.isCompleted && <button className='sm:min-w-48 py-2 border rounded text-stone-500 bg-indigo-50'>Paid</button>}
               {!item.cancelled && !item.payment && !item.isCompleted && <button onClick={()=>appointmentRazorpay(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300'>Pay Online</button> } 
               {!item.cancelled && !item.isCompleted && <button onClick={()=>cancleAppointment(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded  hover:bg-red-600 hover:text-white transition-all duration-300'>Cancle Appoinment</button>} 
               {item.cancelled && !item.isCompleted &&  <button className='sm: min-w-48 py-8 border border-red-500 text-red-500'>Appointment Cancelled</button>}
               {item.isCompleted &&  <button className='sm: min-w-48 py-8 border border-green-500 text-green-500'>Appointment Completed</button>}
              </div>
            </div>


          ))
        }
      </div>
      
    </div>
  )
}

export default MyAppoinments
