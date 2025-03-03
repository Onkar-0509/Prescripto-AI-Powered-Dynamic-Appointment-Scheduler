import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import RelatedDoctors from '../components/RelatedDoctors';
import { toast } from 'react-toastify';
import axios from 'axios';

const Appointments = () => {
  const { docId } = useParams();
  const navigate = useNavigate();
  const { doctors, currencySymbol, getDoctorsData, token, backend_url } = useContext(AppContext);

  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [sloTime, setSlotTime] = useState(null);

  const fetchDoctorInfo = () => {
    const docInfo = doctors.find(doc => doc._id === docId);
    setDocInfo(docInfo);
  };

  const getAvailableSlots = () => {
    if (!docInfo) return;

    let today = new Date();
    setDocSlots([]);

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(currentDate.getDate() + i);

      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeslots = [];

      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();

        const slotDate = day + '_' + month + '_' + year;
        const slotTime = formattedTime;

        const isSlotAvailable = docInfo.slots_booked && docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime) ? false : true;

        if (isSlotAvailable) {
          timeslots.push({
            datetime: new Date(currentDate),
            time: formattedTime
          });
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      setDocSlots(prev => [...prev, timeslots]);
    }
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warn('Login to Book Appointment');
      return navigate('/login');
    }

    try {
      const date = docSlots[slotIndex][0].datetime;

      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();

      const slotDate = day + '_' + month + '_' + year;
      const slotTime = sloTime.time;

      const { data } = await axios.post(backend_url + '/api/user/book-appointment', { docId, slotDate, slotTime }, { headers: { token } });

      if (data.success) {
        toast.success(data.message);
        getDoctorsData();
        navigate('/my-appoinments');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchDoctorInfo();
  }, [docId, doctors]);

  useEffect(() => {
    if (docInfo) {
      getAvailableSlots();
    }
  }, [docInfo]);

  useEffect(() => {
    console.log(docSlots);
  }, [docSlots]);

  return docInfo && (
    <div>
      {/* Doctor Info */}
      <div className='flex flex-col sm:flex-row gap-4'>
        <div>
          <img className='bg-primary w-full sm:w-72 rounded-lg' src={docInfo.image} alt="" />
        </div>
        <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
          <p className='flex gap-2 items-center text-2xl font-medium text-gray-900'>{docInfo.name}
            <img className='w-5' src={assets.verified_icon} alt="" />
          </p>
          <div className='flex gap-2 items-center text-sm mt-1 text-gray-400'>
            <p>{docInfo.degree}-{docInfo.speciality}</p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
          </div>
          <div className='flex gap-1 items-center font-medium text-sm mt-3 text-gray-900'>
            <p>About</p>
            <img className='w-3' src={assets.info_icon} alt="" />
          </div>
          <div className='text-sm text-gray-500 mt-1 max-w-[700px]'>
            {docInfo.about}
          </div>
          <p className='mt-4 font-medium text-gray-500'>Appointment fees: <span className='text-gray-600'>{currencySymbol}{docInfo.fees}</span></p>
        </div>
      </div>

      {/* Appointment slots */}
      <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
        <p>Booking Slots</p>
        <div className='flex gap-3 items-center width-full overflow-x-scroll mt-4'>
          {docSlots.length > 0 && docSlots.map((item, index) => (
            item.length > 0 && (
              <div onClick={() => { setSlotIndex(index) }} key={index} className={`text-center py-6 min-w-16 rounded-full border ${slotIndex === index ? 'bg-primary text-white' : 'border-gray-300'}`}>
                <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                <p>{item[0] && item[0].datetime.getDate()}</p>
              </div>
            )
          ))}
        </div>

        <div className='flex gap-3 items-center width-full mt-4 overflow-x-scroll'>
          {docSlots.length > 0 && docSlots[slotIndex].map((item, index) => (
            <div onClick={() => { setSlotTime(item) }} key={index} className={`text-center text-sm font-light flex-shrink-0 px-5 py-3 rounded-full cursor-pointer ${item.time === sloTime?.time ? 'bg-primary text-white' : 'text-gray-600 border border-gray-300'}`}>
              <p>{item.time.toLowerCase()}</p>
            </div>
          ))}
        </div>
        <button onClick={bookAppointment} className='bg-primary text-sm text-center font-light text-white px-14 py-3 rounded-full my-6'>Book an Appointment</button>
      </div>

      {/* Related Doctors */}
      <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
    </div>
  );
};

export default Appointments;
