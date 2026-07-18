import { useState } from "react";

export default function Upload() {
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const uploadFile = async (file) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file only.");
      return;
    }
    setError(""); setResult(null); setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Single API call — returns text + skills + education + experience
      const res = await fetch("http://127.0.0.1:8000/api/v1/resume/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Upload failed");
      }

      const data = await res.json();

      // Save everything to localStorage
      localStorage.setItem("resume_skills", JSON.stringify(data.skills || []));
      localStorage.setItem("resume_education", data.education || "");
      localStorage.setItem("resume_experience", data.experience || "");

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Upload Your Resume</h1>
        <p>Upload a PDF and our AI will instantly extract your skills and match you with jobs.</p>
      </div>

      {error && <div className="error-msg">⚠ {error}</div>}

      <div
        className={`upload-zone ${dragging ? "dragging" : ""}`}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); uploadFile(e.dataTransfer.files[0]); }}
        data-tooltip="Click or drag your PDF resume here"
      >
        <input type="file" accept=".pdf" onChange={e => uploadFile(e.target.files[0])} />
        <span className="upload-icon">{loading ? "⏳" : "📂"}</span>
        <h3>
          {loading ? "Extracting & analysing..." : dragging ? "Drop it here!" : "Drag & Drop your PDF"}
        </h3>
        <p>
          {loading
            ? "Reading your resume and detecting skills..."
            : "or click anywhere here to browse — PDF only, max 5MB"}
        </p>
        {loading && (
          <div style={{ marginTop: "16px", display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
            {["Reading PDF...", "Extracting text...", "Detecting skills..."].map((step, i) => (
              <span key={i} style={{
                background: "rgba(74,127,165,0.15)", color: "var(--blue)",
                padding: "4px 12px", borderRadius: "100px", fontSize: "12px",
                animation: `fadeIn 0.5s ease ${i * 0.4}s both`
              }}>{step}</span>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {result && (
        <>
          {result.skills && result.skills.length > 0 && (
            <div className="result-box" style={{ marginTop: "24px" }}>
              <h3>🎯 Skills Detected ({result.skills.length})</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "12px" }}>
                {result.skills.map(skill => (
                  <span key={skill} className="skills-badge" data-tooltip={`Found: ${skill}`}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {result.skills && result.skills.length === 0 && (
            <div className="error-msg" style={{ marginTop: "24px" }}>
              ⚠ No skills detected. Make sure your resume clearly mentions technologies like Python, React, etc.
            </div>
          )}

          {result.education && (
            <div className="result-box" style={{ marginTop: "16px" }}>
              <h3>🎓 Education Detected</h3>
              <div className="result-text" style={{ maxHeight: "150px" }}>{result.education}</div>
            </div>
          )}

          {result.experience && (
            <div className="result-box" style={{ marginTop: "16px" }}>
              <h3>💼 Experience Detected</h3>
              <div className="result-text" style={{ maxHeight: "150px" }}>{result.experience}</div>
            </div>
          )}

          <div className="result-box" style={{ marginTop: "16px" }}>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "16px" }}>
              <span className="pill">📄 {result.filename}</span>
              <span className="pill blue">{result.char_count.toLocaleString()} characters</span>
              <span className="pill blue">{result.page_hint}</span>
              <span className="pill blue">✓ {result.skills?.length || 0} skills found</span>
            </div>
            <h3>📄 Extracted Text</h3>
            <div className="result-text">{result.raw_text}</div>
          </div>
        </>
      )}
    </div>
  );
}
