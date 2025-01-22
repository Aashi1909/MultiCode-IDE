import React from 'react'
import logo from "../images/mainlogo.png"
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <>
    <div className='nav px-[100px] flex items-center justify-between h-[90px] bg-[#0f1026]'>
      <img className='w-[100px] object-cover' src={logo} alt="" />
      <div className="links flex items-center gap-[15px]">
          <Link className=' transition-all hover:text-blue-500'>Home</Link>
          <Link className=' transition-all hover:text-blue-500'>About</Link>
          <Link className=' transition-all hover:text-blue-500'>Services</Link>
          <Link className=' transition-all hover:text-blue-500'>Contact</Link>
          <button onClick={()=>{
            localStorage.removeItem("token");
            localStorage.removeItem("isLoggedIn");
            window.location.reload();
          }} className="btnNormal bg-red-500 transition-all hover:bg-red-600 px-[20px]">Logout</button>
        </div>
      </div>
    </>
  )
}

export default Navbar