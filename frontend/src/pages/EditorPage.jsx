import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Editor from '@monaco-editor/react';
import { VscRunCoverage } from "react-icons/vsc";
import { useParams } from 'react-router-dom';
import { api_base_url } from '../helper';
import { toast } from 'react-toastify';


const EditorPage = () => {
  const [code, setCode] = useState('');
  const [data, setData] = useState(null);
  const [output, setOutput] = useState("");
  const [error, setError] = useState(false);
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
        setData(data.project)
      }
      else{
        toast.error(data.msg)
      }
    })

  }, [])

  const saveProject = () => {
    const trimmedCode = code?.toString().trim(); 

    fetch(`${api_base_url}/saveProject`, {
      mode: 'cors',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: localStorage.getItem('token'),
        projectId: id,
        code: trimmedCode, // Use the latest code state
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast.success(data.msg);
        } else {
          toast.error(data.msg);
        }
      })
      .catch((err) => {
        console.error('Error saving project:', err);
        toast.error('Failed to save the project.');
      });
  };

  const handleSaveShortcut = (e) =>{
    if(e.ctrlKey && e.key === "s"){
      e.preventDefault();
      saveProject();
    }
  }

  useEffect(() =>{
    window.addEventListener("keydown", handleSaveShortcut)
    return () =>{
      window.removeEventListener("keydown", handleSaveShortcut)
    }

  }, [code])


  const runProject = ()=>{
    fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify({
        language : data.projectType,
        version : data.version,
        files: [
          {
            filename: data.name + data.projectType === "python" ? ".py" : data.projectType === "java" ? ".java" : data.projectType === "javascript" ? ".js" : data.projectType === "c" ? ".c" : data.projectType === "cpp" ? ".cpp" : data.projectType === "bash" ? ".sh" :  data.projectType === "go" ? ".go" : "",
            content : code
          }
        ]
      })
    }).then(res =>res.json()).then(data =>{
      setOutput(data.run.output)
      setError(data.run.code === 1 ? true : false )

    })
  }

  return (
    <>
    <Navbar />
    <div className='flex items-center justify-between' style={{height:"calc(100vh - 90px)"}}>
    <div className='left w-[50%] h-full '>
    <Editor onChange={(newCode) => setCode(newCode || '')} theme='vs-dark' height="100%" width="100%" language="javascript" value= {code} />;
    </div>
    <div className='right p-[15px] w-[50%] h-full bg-[#27272a] '> 
      <div className='pb-3 border-b-[1px] border-b-[#1e1e1f] flex items-center justify-between px-[30px]'>

      <p className='text-lg'>Output</p>
      <button onClick={runProject} className='btnNormal bg-orange-500 flex items-center !w-[70px] text-white'><VscRunCoverage className=' mr-1 !text-2xl'/>Run</button>
      </div>
      <pre className={`w-full h-[75vh] ${error ? "text-red-500" : ""}`} style={{textWrap: "nowrap"}}>{output}</pre>


    </div>

    </div>

      
    </>

  )
}

export default EditorPage
