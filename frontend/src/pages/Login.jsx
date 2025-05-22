import  { useState } from 'react'
import mainlogo from "../images/mainlogo.png";
import { Link, useNavigate } from 'react-router-dom';
import { api_base_url } from '../helper';
import { toast } from 'react-toastify';


const Login = ({onLogin}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


  const submitForm =(e)=>{
    e.preventDefault();
    fetch(api_base_url+ "/login",{
          mode:"cors",
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({
            email:email,
            password:password
          })
        }).then(res => res.json()
      ).then(data => {
        if(data.success){
          localStorage.setItem("token", data.token);
          toast.success(data.msg);
          // localStorage.setItem("isLoggedIn", true);
          onLogin();
          // setTimeout(() =>{
            navigate("/");
          // }, 200)
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

          <div className="inputBox">
            <input type="email" onChange ={(e) =>{setEmail(e.target.value)}} value={email} placeholder='Email' required/>
          </div>

          <div className="inputBox">
            <input type="password" onChange ={(e) =>{setPassword(e.target.value)}} value={password} placeholder='Password' required/>
          </div>

          <p className='text-black text-[14px] mt-4 '>Dont have an account? <Link to="/signUp" className='text-orange-500'>SignUp</Link></p>

          <button className="btnNormal mt-4 bg-orange-500 transition-all hover:bg-orange-600">Login</button>
        </form>
      </div> 

    </>
  )
}

export default Login