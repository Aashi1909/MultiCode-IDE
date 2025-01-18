import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { IoIosAdd } from "react-icons/io";
import python from "../images/pythonimg.png"
import { MdEdit } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import Select from 'react-select'



const Home = () => {
  const [isCreateModel, setIsCreateModel] = useState(false)
  const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
  ]

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: '#000',
      borderColor: '#555',
      color: '#fff',
      padding: '5px',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#000',
      color: '#fff',
      width: "100%"
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#333' : '#000',
      color: '#fff',
      cursor: 'pointer',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#fff',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#aaa',
    }),
  };

  const getRunTimes = async()=> {
    let res = await fetch("https://emkc.org/api/v2/piston/runtimes");
    let data = await res.json();
     console.log(data)
  }

  useEffect(() =>{
    getRunTimes();
  }, [])

  return (
    <>
    <Navbar />
    <div className='flex items-center px-[100px] justify-between mt-5 '>
    <h3 className='text-2xl !text-black'>Welcome User!</h3>
    <div className='flex items-center '>
      <button onClick={() =>{setIsCreateModel(true)}} className='btnNormal bg-orange-500 mr-8 text-white transition-all flex items-center !w-[100%] hover:bg-orange-600 font-semibold text-lg'><IoIosAdd className='mr-2 !text-2xl '/>Create Project
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

    {
      isCreateModel ? 
      <div className=' modelContainer flex flex-col items-center justify-center w-screen h-screen fixed top-0 left-0 bg-[rgba(0,0,0,0.5)]'> 
      <div className='modelBox flex flex-col items-start w-[25vw] h-[40vh] p-[20px] rounded-xl bg-white'>
        <h3 className=' text-2xl text-black font-semibold'>Create Project</h3>
        <div className='inputBox'>
          <input type='text' placeholder='Enter Your Project Name' />
        </div>
          <Select placeholder="Select a Language" options={options} styles={customStyles} />

      </div>
      </div>  : " "

    }
      
    </>
  )
}

export default Home
