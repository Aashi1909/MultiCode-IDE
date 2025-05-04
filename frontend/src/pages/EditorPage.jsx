import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Editor from "@monaco-editor/react";
import LinkPopup from '../components/LinkPopup';
import { VscRunCoverage } from "react-icons/vsc";
import { useParams } from "react-router-dom";
import { api_base_url } from "../helper";
import { toast } from "react-toastify";
import { IoShareSocialOutline } from "react-icons/io5";
import Swal from 'sweetalert2';


const EditorPage = () => {
  const [code, setCode] = useState("");
  const [data, setData] = useState(null);
  const [output, setOutput] = useState("");
  const [error, setError] = useState(false);
  const [generatedLink, setGeneratedLink] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [project, setProject] = useState(null);



  let { id } = useParams();

  useEffect(() => {
    fetch(api_base_url + "/getOneProject", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: localStorage.getItem("token"),
        projectId: id,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCode(data.project.code);
          setData(data.project);
          setProject(data.project)
        } else {
          toast.error(data.msg);
        }
      });
  }, [id]);

  const saveProject = () => {
    const trimmedCode = code?.toString().trim();

    fetch(`${api_base_url}/saveProject`, {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: localStorage.getItem("token"),
        projectId: id,
        code: trimmedCode,
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
        console.error("Error saving project:", err);
        toast.error("Failed to save the project.");
      });
  };

  const handleSaveShortcut = (e) => {
    if (e.ctrlKey && e.key === "s") {
      e.preventDefault();
      saveProject();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleSaveShortcut);
    return () => {
      window.removeEventListener("keydown", handleSaveShortcut);
    };
  }, [code]);

  const runProject = () => {
    fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language: data.projectType,
        version: data.version,
        files: [
          {
            filename:
              data.name + data.projectType === "python"
                ? ".py"
                : data.projectType === "java"
                ? ".java"
                : data.projectType === "javascript"
                ? ".js"
                : data.projectType === "c"
                ? ".c"
                : data.projectType === "cpp"
                ? ".cpp"
                : data.projectType === "bash"
                ? ".sh"
                : data.projectType === "go"
                ? ".go"
                : "",
            content: code,
          },
        ],
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setOutput(data.run.output);
        setError(data.run.code === 1 ? true : false);
      });
  };

  const generateLink = async (id) => {
    try {
      const response = await fetch(api_base_url + "/generateLink", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: id,
        }),
      });
  
      const data = await response.json();
      if (response.ok && data.success) {
        setGeneratedLink(data.link);
        setIsPopupOpen(true); 
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message || "Failed to generate the link",
        });
      }
    } catch(error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong. Please try again later.",
      });
    }
  };

  return (
    <>
      {/* <Navbar /> */}
      <div
        className="flex items-center justify-between"
        style={{ height: "calc(100vh - 90px)" }}
      >
        <div className="left w-[50%] h-full ">
          <Editor
            onChange={(newCode) => setCode(newCode || "")}
            theme="vs-dark"
            height="100%"
            width="100%"
            language="javascript"
            value={code}
          />
          ;
        </div>

        <div className="right p-[15px] w-[50%] h-full bg-[#27272a]">
          <div className="pb-3 border-b-[1px] border-b-[#1e1e1f] flex items-center justify-between px-[30px]">
            <p className="text-lg">Output</p>

            <div className="flex items-center space-x-4">
            <button
              className="btnNormal flex items-center justify-center !w-[90px] text-white px-4 py-2 rounded-lg hover:bg-orange-500"
              onClick={() => {
                if (project && project._id) { 
                  generateLink(project._id);
                } else {
                  Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Project is not defined!',
                  });
                }
              }}
              style={{ border: "1px solid #ef6e00" }}
            >
              <IoShareSocialOutline className="mr-2 text-2xl text-white" />
              Share
            </button>

              <LinkPopup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                link={generatedLink}
              />
              <button
                onClick={runProject}
                className="btnNormal bg-orange-500 flex items-center justify-center !w-[90px] text-white px-4 py-2 rounded-lg hover:bg-orange-600"
              >
                <VscRunCoverage className="mr-2 text-2xl" />
                Run
              </button>
            </div>
          </div>

          <pre
            className={`w-full h-[75vh] ${error ? "text-red-500" : ""}`}
            style={{ textWrap: "nowrap", overflow: "auto" }}
          >
            {output}
          </pre>
        </div>
      </div>
    </>
  );
};

export default EditorPage;
