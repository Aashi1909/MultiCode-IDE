import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Editor from '@monaco-editor/react';
import { VscRunCoverage } from "react-icons/vsc";
import { useParams } from 'react-router-dom';
import { api_base_url } from '../helper';
import { toast } from 'react-toastify';


const EditorPage = () => {
  const [code, setCode] = useState('');
  let {id} = useParams()

  useEffect(() =>{
    fetch(api_base_url + "/getOneProject", {
      mode:"cors",
      method: "POST",
      headers:{
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        token : localStorage.getItem("token"),
        projectId : id
      })
    }).then(res => res.json()).then(data =>{
      if(data.success){
        setCode(data.project.code)
      }
      else{
        toast.error(data.msg)
      }
    })

  }, [])

  const saveProject = async(req, res) =>{
    
  }

  return (
    <>
    <Navbar />
    <div className='flex items-center justify-between' style={{height:"calc(100vh - 90px)"}}>
    <div className='left w-[50%] h-full '>
    <Editor onChange={newCode => setCode(newCode)} theme='vs-dark' height="100%" width="100%" language="javascript" value= {code} />;
    </div>
    <div className='right p-[15px] w-[50%] h-full bg-[#27272a] '> 
      <div className='pb-3 border-b-[1px] border-b-[#1e1e1f] flex items-center justify-between px-[30px]'>

      <p className='text-lg'>Output</p>
      <button className='btnNormal bg-orange-500 flex items-center !w-[70px] text-white'><VscRunCoverage className=' mr-1 !text-2xl'/>Run</button>
      </div>

    </div>

    </div>

      
    </>

  )
}

export default EditorPage
