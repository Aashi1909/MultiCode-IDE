import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { IoIosAdd } from "react-icons/io";
import { IoClose } from "react-icons/io5"; 
import python from "../images/pythonimg.png"
import js from "../images/js.png"
import cpp from "../images/cpp.png"
import c from "../images/c.png"
import java from "../images/java.png"
import bash from "../images/bash.png"
import { useNavigate } from 'react-router-dom';
import { MdEdit } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import Select from 'react-select'
import { api_base_url } from '../helper';
import { toast } from 'react-toastify';
import { useTheme } from "../context/ThemeContext"; 
import Swal from 'sweetalert2';




const Home = () => {
  const [isCreateModel, setIsCreateModel] = useState(false)
  const [languageOptions, setLanguageOptions] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(null); 
  const [projects, setProjects] = useState(null)
  const [isEditModelShow, setIsEditModelShow] = useState(false);

  const { darkMode } = useTheme();


  const navigate = useNavigate()

  const [name, setName] = useState('')

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: '#e2e2e2',
      // borderColor: '#555',
      color: 'black',
      padding: '5px',
      marginTop: '10px'
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#e2e2e2',
      color: 'black',
      width: "100%"
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#f3dfcd' : '#e2e2e2',
      color: 'black',
      cursor: 'pointer',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'black',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: 'black',
    }),
  };

  const getProjects = async() => {
    fetch(api_base_url + "/getProjects", {
      mode:"cors",
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        token: localStorage.getItem("token")
      })
    }).then(res => res.json()).then(data => {
      if(data.success){
        setProjects(data.projects)
      }
      else{
        toast.error(data.msg)
      }
    })
  }

  const getRunTimes = async()=> {
    let res = await fetch("https://emkc.org/api/v2/piston/runtimes");
    let data = await res.json();

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
    setSelectedLanguage(selectedOption); 
    console.log("Selected language:", selectedOption);
  };

  useEffect(() =>{
    getProjects();
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
        token: localStorage.getItem("token"),
        version : selectedLanguage.version
      })
    }).then(res =>res.json()).then(data =>{
      if(data.success){
        navigate("/editor/" + data.projectId)
      }
      else{
        toast.error(data.msg)
      }

    })

  }

  const closeModal = () => {
    setIsCreateModel(false);
    setName(""); 
    setSelectedLanguage(null); 
  };
  
  const deleteProject = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this project? ',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Yes, delete it!',
      reverseButtons: true,
      customClass: {
        confirmButton: 'swal-confirm-button',
        cancelButton: 'swal-cancel-button',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(api_base_url + '/deleteProject', {
          mode: 'cors',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            projectId: id,
            token: localStorage.getItem('token'),
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              toast.success('Project deleted successfully.');
              getProjects();
            } else {
              toast.error(data.msg);
            }
          })
          .catch((error) => {
            toast.error('An error occurred while deleting the project.');
          });
      } 
    });
  };
  

  const [editProjId, setEditProjId] = useState("");

  const updateProj = () => {
    fetch(api_base_url + "/editProject", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        projectId: editProjId,
        token: localStorage.getItem("token"),
        name: name,
      })
    }).then(res => res.json()).then(data => {
      if (data.success) {
        toast.success(data.msg);
        setIsEditModelShow(false);
        setName("");
        setEditProjId("");
        getProjects();
      }
      else {
        toast.error(data.msg);
        setIsEditModelShow(false);
        setName("");
        setEditProjId("");
        getProjects();
      }
    })
  };

  return (
    <>
    <Navbar />
    <div className='flex items-center px-[100px] justify-between mt-5 '>
    <h3 className={`text-3xl font-medium ${darkMode ? " !text-white" : "!text-black"}`}>Welcome User!</h3>
    <div className='flex items-center '>
      <button onClick={() =>{setIsCreateModel(true)}} className='btnNormal bg-orange-500 mr-8 text-white transition-all flex items-center !w-[100%] hover:bg-orange-600 font-semibold text-lg'><IoIosAdd className='mr-2 !text-2xl '/>Create Project
      </button>
    </div>
    </div>

    <div className="projects text-black text-lg font-normal px-[100px] mt-5 pb-10">
        {
          projects && projects.length > 0 ? projects.map((project, index) => {
            return <>
                <div className='project w-full p-[15px] flex items-center justify-between border border-black-300 rounded-lg shadow-md' >
                <div onClick={() => { navigate("/editor/" + project._id) }} className='flex w-full items-center gap-[15px]'>
                  {
                    project.projectType === "python" ?
                      <>
                        <img className='w-[130px] h-[100px] object-cover' src={python} alt="" />
                      </>
                      : project.projectType === "javascript" ?
                        <>
                          <img className='w-[130px] h-[100px] object-cover' src={js} alt="" />
                        </> : project.projectType === "cpp" ?
                          <>
                            <img className='w-[130px] h-[100px] object-cover' src={cpp} alt="" />
                          </> : project.projectType === "c" ?
                            <>
                              <img className='w-[130px] h-[100px] object-cover' src={c} alt="" />
                            </> : project.projectType === "java" ?
                              <>
                                <img className='w-[130px] h-[100px] object-cover' src={java} alt="" />
                              </> : project.projectType === "bash" ?
                                <>
                                  <img className='w-[130px] h-[100px] object-cover' src={bash} alt="" />
                                </> : ""
                  }
                  <div>
                    <h3 className='text-xl'>{project.name}</h3>
                    <p className='text-[17px] text-[gray]'>{new Date(project.date).toDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-[15px]">
                <button 
                  className="btnNormal bg-orange-500 transition-all hover:bg-orange-600 text-white flex items-center justify-center gap-2 !w-[100%]" 
                  onClick={() => {
                    setIsEditModelShow(true);
                    setEditProjId(project._id);
                    setName(project.name);
                  }}
                >
                  <MdEdit className="text-lg" /> Edit
                </button>
                <button 
                  onClick={() => { deleteProject(project._id) }} 
                  className="btnNormal bg-gray-500 text-white transition-all hover:bg-gray-600 flex items-center justify-center gap-2 !w-[100%]"
                >
                  <MdDeleteOutline className="text-lg" /> Delete
                </button>
              </div>

              </div>
            </>
          }) : "No Project Found !"
        } 

       


      </div>

    {
      isCreateModel &&
      <div className=' modelContainer flex flex-col items-center justify-center w-screen h-screen fixed top-0 left-0 bg-[rgba(0,0,0,0.5)]'> 
      <div className='modelBox flex flex-col items-start w-[50vh] h-[40vh] p-[20px] rounded-xl bg-white'>
      <div className="flex items-center justify-between w-full">
      <h3 className="text-2xl text-black font-semibold">Create Project</h3>
      <IoClose
        onClick={closeModal}
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
    
      {
        isEditModelShow &&
        <div className='modelCon flex flex-col items-center justify-center w-screen h-screen fixed top-0 left-0 bg-[rgba(0,0,0,0.5)]'>
          <div className="modelBox flex flex-col items-start rounded-xl p-[20px] w-[25vw] h-[auto] text-black bg-white relative">
          <div className="header flex items-center justify-between w-full mb-4">
          <h3 className="text-xl font-bold">Update Project</h3>
          <IoClose
            onClick={() => setIsEditModelShow(false)}
            className="text-black text-2xl cursor-pointer hover:text-red-500"
          />
        </div>
            <div className="inputBox !mt-1">
              <input onChange={(e) => { setName(e.target.value) }} value={name} type="text" placeholder='Enter your project name' className="text-black" />
            </div>

            <button onClick={updateProj} className="btnNormal text-white mt-4 bg-orange-500 transition-all hover:bg-orange-600 ">Update</button>

          </div>
        </div>
      }
    </>
  );
};

export default Home;
