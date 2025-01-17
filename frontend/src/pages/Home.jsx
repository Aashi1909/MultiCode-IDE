import React from 'react'
import Navbar from '../components/Navbar'
import { IoIosAdd } from "react-icons/io";
import python from "../images/pythonimg.png"
import { MdEdit } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";




const Home = () => {
  return (
    <>
    <Navbar />
    <div className='flex items-center px-[100px] justify-between mt-5 '>
    <h3 className='text-2xl !text-black'>👋 Hi, Mahdi</h3>
    <div className='flex items-center '>
      <button className='btnNormal bg-orange-500 mr-8 text-white transition-all flex items-center !w-[100%] hover:bg-orange-600 font-semibold text-lg'><IoIosAdd className='mr-2 !text-2xl '/>Create Project
      </button>
    </div>
    </div>

    <div className='projects px-[100px] mt-5'>
      <div className='project w-full p-[15px] flex items-center justify-between bg-[#0f0e0e]' >
        <div className='flex items-center gap-[15px]'>
        <img src={python}  className='w-[100px] h-[100px] object-cover' alt="" />
        <div>
          <h3 className='text-xl'>Python Project</h3>
          <p className='text-[15px] !text-[gray]'>5 Jan, 2025</p>
        </div>
        </div>

        <div className='flex items-center gap-[15px]'>
          <button className='btnNormal bg-orange-500  hover:bg-orange-600 font-semibold flex items-center !w-[100%] text-lg'><MdEdit className='mr-2'/> Edit</button>
          <button className='btnNormal bg-orange-500  hover:bg-orange-600 font-semibold !w-[100%] text-lg flex items-center'><MdDeleteOutline className='mr-2 !text-xl'/>Delete</button>
        </div>
        

      </div>


    </div>
      
    </>
  )
}

export default Home
