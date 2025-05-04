import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api_base_url } from "../helper";
import Editor from "@monaco-editor/react"; // Make sure this is installed

export default function SharedView() {
  const { hash } = useParams();
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${api_base_url}/share/${hash}`)
      .then((res) => {
        if (!res.ok) throw new Error("Server error");
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          setCode(data.project.code);
          setLanguage(data.project.projectType || "javascript");
        } else {
          setError(data.message || "Failed to load project.");
        }
      })
      .catch((err) => {
        setError(err.message || "Something went wrong.");
      })
      .finally(() => setLoading(false));
  }, [hash]);

  return (
    <div className="w-full h-screen bg-gray-900 text-white flex">
      <div className="flex-1 h-full flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold">
            {data.project?.name || "Shared Code"}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Language: {language}
          </p>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <Editor
            height="100%"
            width="100%"
            theme="vs-dark"
            language={language}
            value={code}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false
            }}
          />
        </div>
      </div>
    </div>
  );
}