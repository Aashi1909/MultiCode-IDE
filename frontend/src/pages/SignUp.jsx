import  { useState } from 'react'
import mainlogo from "../images/mainlogo.png";
import { Link, useNavigate } from 'react-router-dom';
import { api_base_url } from '../helper';
import { toast } from 'react-toastify';

const SignUp = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const submitForm =(e)=>{
    e.preventDefault();

    console.log(api_base_url, "api_base_url")

    fetch(api_base_url + "/signUp",{
      mode:"cors",
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        name:name,
        email:email,
        password:password
      })
    }).then(res => res.json()
  ).then(data => {
    console.log(data, "DAATTTTTTAAAAA")
    if(data.success){
      navigate("/login");
    }
    else{
      toast.error(data.msg);
    }

  });
  }
  return (
    <>
    <div className="con flex flex-col items-center justify-center min-h-screen ">
    <form className='w-[40vw] h-[auto] flex flex-col items-center bg-white p-[20px] rounded-lg shadow-xl shadow-black/50' onSubmit={submitForm}>
    <img className='w-[230px] object-cover' src={mainlogo} alt="" />

    <div className="authinputBox">
            <input type="text" onChange ={(e) =>{setName(e.target.value)}} value={name} placeholder='Full Name' required/>
          </div>

          <div className="authinputBox">
            <input type="email" onChange ={(e) =>{setEmail(e.target.value)}} value={email} placeholder='Email' required/>
          </div>

          <div className="authinputBox">
            <input type="password" onChange ={(e) =>{setPassword(e.target.value)}} value={password} placeholder='Password' required/>
          </div>

          <p className='text-black text-[14px] mt-4 '>Already have an account <Link to="/login" className='text-orange-500'>Login</Link></p>

          <button className="authbtnNormal  mt-4 bg-orange-500 transition-all hover:bg-orange-600">Sign Up</button>
        </form>
      </div> 

    </>
  )
}

export default SignUp