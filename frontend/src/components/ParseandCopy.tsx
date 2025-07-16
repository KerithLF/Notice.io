import React, { useState } from "react";

const ParseAndCopy: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedText, setParsedText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setParsedText("");
    }
  };

  const handleParse = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("http://localhost:8000/parse-file/", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setParsedText(data.parsed_text || data.error || "No data");
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", padding: 16 }}>
      <h2>Parse File and Copy Data</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleParse} disabled={!file || loading} style={{ marginLeft: 8 }}>
        {loading ? "Parsing..." : "Parse"}
      </button>
      {parsedText && (
        <div style={{ marginTop: 16 }}>
          <textarea
            value={parsedText}
            readOnly
            style={{ width: "100%", height: 300, fontFamily: "monospace", resize: "vertical" }}
          />
        </div>
      )}
    </div>
  );
};

export default ParseAndCopy;