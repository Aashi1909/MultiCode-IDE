import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { IoIosAdd } from "react-icons/io";
import { IoClose } from "react-icons/io5"; 
import python from "../images/pythonimg.png"
import { useNavigate } from 'react-router-dom';
import { MdEdit } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import Select from 'react-select'
import { api_base_url } from '../helper';
import { toast } from 'react-toastify';




const Home = () => {
  const [isCreateModel, setIsCreateModel] = useState(false)
  const [languageOptions, setLanguageOptions] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(null); 

  const navigate = useNavigate()

  const [name, setName] = useState('')



  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: '#000',
      borderColor: '#555',
      color: '#fff',
      padding: '5px',
      marginTop: '10px'
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

     const filteredLanguages = [
      "python",
      "javascript",
      "c",
      "c++",
      "java",
      "bash"
    ];

    const options = data
      .filter(runtime => filteredLanguages.includes(runtime.language))
      .map(runtime => ({
        label: `${runtime.language} (${runtime.version})`,
        value: runtime.language === "c++" ? "cpp" : runtime.language,
        version: runtime.version,
      }));

    setLanguageOptions(options);
  };

  const handleLanguageChange = (selectedOption) => {
    setSelectedLanguage(selectedOption); // Update selected language state
    console.log("Selected language:", selectedOption);
  };

  useEffect(() =>{
    getRunTimes();
  }, [])

  const createProj =() =>{
    fetch(api_base_url + "/createProject", {
      mode: "cors",
      method: "POST",
      headers:{
        "Content-Type" : "application/json"
      },
      body: JSON.stringify({
        name:name,
        projectType: selectedLanguage.value,
        token: localStorage.getItem("token")
      })
    }).then(res =>res.json()).then(data =>{
      if(data.success){
        navigate("/editor/ + data.projectId")
      }
      else{
        toast.error(data.msg)
      }

    })

  }

  return (
    <>
    <Navbar />
    <div className='flex items-center px-[100px] justify-between mt-5 '>
    <h3 className='text-2xl !text-black'>Welcome User!</h3>
    <div className='flex items-center '>
      <button onClick={() =>{setIsCreateModel(true)}} className='btnNormal bg-[#0f1026] mr-8 text-white transition-all flex items-center !w-[100%] hover:bg-orange-600 font-semibold text-lg'><IoIosAdd className='mr-2 !text-2xl '/>Create Project
      </button>
    </div>
    </div>

    <div className='projects px-[100px] mt-5'>
      <div className='project w-full p-[15px] flex items-center justify-between bg-[#0f0e0e]' >
        <div className='flex items-center gap-[15px]'>
        <img src={python}  className='w-[100px] h-[100px] object-cover' alt="" />
        <div>
          <h3 className='text-xl !text-[black'>Python Project</h3>
          <p className='text-[15px] !text-[gray]'>5 Jan, 2025</p>
        </div>
        </div>

        <div className='flex items-center gap-[15px]'>
          <button className='btnNormal bg-[#0f1026]  hover:bg-orange-600 font-semibold flex items-center !w-[100%] text-lg'><MdEdit className='mr-2'/> Edit</button>
          <button className='btnNormal bg-[#0f1026]  hover:bg-orange-600 font-semibold !w-[100%] text-lg flex items-center'><MdDeleteOutline className='mr-2 !text-xl'/>Delete</button>
        </div>
        

      </div>


    </div>

    {
      isCreateModel &&
      <div 
      // onClick={(e) => {
      //   if(e.target.classList.contains("modelContainer")){
      //     setIsCreateModel(false)
      //   }
      // }}
       className=' modelContainer flex flex-col items-center justify-center w-screen h-screen fixed top-0 left-0 bg-[rgba(0,0,0,0.5)]'> 
      <div className='modelBox flex flex-col items-start w-[50vh] h-[40vh] p-[20px] rounded-xl bg-white'>
      <div className="flex items-center justify-between w-full">
      <h3 className="text-2xl text-black font-semibold">Create Project</h3>
      <IoClose
        onClick={() => setIsCreateModel(false)}
        className="text-black text-2xl cursor-pointer hover:text-red-500"/>
      </div>
        <div className='inputBox'>
          <input type='text'  onChange = {(e) => {setName(e.target.value)}} value={name} placeholder='Enter Your Project Name' />
        </div>
          <Select placeholder="Select a Language" options={languageOptions} styles={customStyles} onChange={handleLanguageChange} />
          {selectedLanguage && (
              <>
                <p className="text-[14px] text-green-500 mt-2">
                  Selected Language: {selectedLanguage.label}
                </p>
                <button onClick={createProj} className="btnNormal bg-orange-500 transition-all hover:bg-orange-600 mt-2 !w-[100%]">Create</button>
              </>
            )}

      </div>
      </div>  

    }
      
    </>
  )
}

export default Home
