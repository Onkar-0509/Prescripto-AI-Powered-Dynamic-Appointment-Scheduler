import React from 'react'
import { Route,Routes } from 'react-router-dom'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import About from './pages/About'
import Contact from './pages/Contact'
import Myprofile from './pages/Myprofile'
import MyAppoinments from './pages/MyAppoinments'
import Appoinments from './pages/Appoinments'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Footer from './components/Footer'
import {toast ,ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

 
const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <ToastContainer/>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/doctors' element={<Doctors/>} />
        <Route path='/doctors/:speciality' element={<Doctors/>} />
        <Route path='/about' element={<About/>} />
        <Route path='/contact' element={<Contact/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/my-profile' element={<Myprofile/>} />
        <Route path='/my-appoinments' element={<MyAppoinments/>} />
        <Route path='/appoinment/:docId' element={<Appoinments/>} />
      </Routes>

      <Footer/>
      
    </div>
  )
}

export default App
