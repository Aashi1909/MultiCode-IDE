import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api_base_url } from "../helper";
import Editor from "@monaco-editor/react";

export default function SharedView() {
  const { hash } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${api_base_url}/share/${hash}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load code");
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          setProject(data.project);
        } else {
          throw new Error(data.message);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [hash]);

  if (loading) return <div className="p-4 text-white">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="w-full h-screen bg-gray-900 text-white flex">
      <div className="left w-[50%] h-full">
        <Editor
          height="100%"
          width="100%"
          theme="vs-dark"
          language={project.projectType?.toLowerCase() || "javascript"}
          value={project.code}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            automaticLayout: true,
            scrollBeyondLastLine: false,
            renderWhitespace: "all",
          }}
        />
      </div>
    </div>
  );
}