import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
       <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] my-10 gap-14  mt-40 text-sm'>
        <div>
            <img className='mb-5 w-40' src={assets.logo} alt="" />
            <p className='w-full md:w-2/3 text-gray-600 leading-6'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae veniam quos libero, odio alias consequuntur amet nisi sapiente assumenda numquam, tenetur aliquid quidem animi quam natus ex iure sint tempora necessitatibus dolores? Dolor laudantium omnis consequuntur,!</p>
        </div>

        <div>
            <p className='text-xl mb-5 font-medium'>COMPANY</p>
            <ul className='flex flex-col text-gray-600 gap-2'>
                <li>Home</li>
                <li>About us</li>
                <li>Contact</li>
                <li>Privacy policy</li>
            </ul>
        </div>

        <div>
            <p className='text-xl mb-5 font-medium'>GET IN TOUCH</p>
            <ul  className='flex flex-col text-gray-600 gap-2'>
            <li>121-234-999</li>
            <li>onkarhadadare05@gmail.com</li>
            </ul>
        </div>
       </div>

       <div>
        <hr />
        <p className='py-5 text-sm text-center'>Copyright 2025@ Prescripton - All Right Reserved.</p>
       </div>
    </div>
  )
}

export default Footer
