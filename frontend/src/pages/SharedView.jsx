import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api_base_url } from "../helper";

export default function SharedView() {
  const { hash } = useParams();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${api_base_url}/share/${hash}`, 
      // method: "POST",
      // headers: {
      //   "Content-Type": "application/json",
      // },
      // body: JSON.stringify({ hash }), // using POST as per your backend
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCode(data.project.code);
        } else {
          setError(data.message || "Failed to load project.");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Something went wrong.");
        setLoading(false);
      });
  }, [hash]);

  return (
    <div className="p-6 bg-gray-900 text-white h-screen">
      <h1 className="text-xl font-bold mb-4">Shared Code</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <pre className="bg-[#1e1e1e] p-4 rounded overflow-auto h-[80vh]">{code}</pre>
      )}
    </div>
  );
}
