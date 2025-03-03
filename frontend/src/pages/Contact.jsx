import React from 'react'
import { assets } from '../assets/assets'

const Contact = () => {
  return (
    <div>
      <div className='text-center text-2xl text-gray-400 pt-10'>
        <p>CONTACT <span className='text-gray-700 font-semibold'>US</span></p>
      </div>

      <div className='my-16 flex flex-col md:flex-row justify-center gap-10 mb-28 text-sm '>
        <img className='w-full md:max-w-[360px]' src={assets.contact_image} alt="" />
        <div className='flex flex-col justify-center items-start gap-6 text-gray-500 '>
          <p className='text-lg font-semibold text-gray-600 '>Our OFFICE</p>
          <p>54709 Willms Station <br /> Suite 350, Washington, USA</p>
          <p>Tel: (415) 555‑0132 <br /> Email: onkarhadadare05@gmail.com</p>
          <p className='font-semibold text-lg text-gray-600'>Careers at PRESCRIPTO</p>
          <p>Learn more about our teams and job openings.</p>
          <button className='border border-black px-8 py-3 text-sm cursor-pointer hover:bg-black hover:text-white transition-all duration-500'>Explore Jobs</button>
        </div>
       
      </div>
      
    </div>
  )
}

export default Contact
