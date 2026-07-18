import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

const ALL_JOBS = [
  { tags: ["Python", "FastAPI", "GCP", "Docker"] },
  { tags: ["React", "TypeScript", "Azure", "SQL"] },
  { tags: ["Python", "PyTorch", "AWS", "MLOps"] },
  { tags: ["Docker", "Kubernetes", "Jenkins", "Linux"] },
  { tags: ["Python", "SQL", "Machine Learning", "Spark"] },
  { tags: ["React", "JavaScript", "CSS", "REST APIs"] },
  { tags: ["Python", "FastAPI", "PostgreSQL", "Git"] },
  { tags: ["React", "JavaScript", "HTML", "CSS"] },
  { tags: ["AWS", "Azure", "Docker", "Linux"] },
  { tags: ["Python", "Spark", "SQL", "Kafka"] },
  { tags: ["Python", "Machine Learning", "PyTorch", "SQL"] },
  { tags: ["Java", "React", "SQL", "Git"] },
  { tags: ["Node.js", "Express", "MongoDB", "Docker"] },
  { tags: ["Python", "Django", "PostgreSQL", "Redis"] },
  { tags: ["React", "Redux", "TypeScript", "Jest"] },
  { tags: ["Java", "Spring Boot", "MySQL", "Docker"] },
  { tags: ["Python", "TensorFlow", "Keras", "AWS"] },
  { tags: ["DevOps", "Jenkins", "Kubernetes", "Terraform"] },
  { tags: ["React", "Node.js", "MongoDB", "Express"] },
  { tags: ["Python", "FastAPI", "Redis", "Docker"] },
  { tags: ["Android", "Kotlin", "Firebase", "Git"] },
  { tags: ["iOS", "Swift", "Xcode", "Firebase"] },
  { tags: ["Python", "Pandas", "NumPy", "Tableau"] },
  { tags: ["React", "GraphQL", "Node.js", "PostgreSQL"] },
];

// All unique skills required across all jobs
const ALL_REQUIRED_SKILLS = [...new Set(ALL_JOBS.flatMap(j => j.tags))];

function computeMetrics(resumeSkills) {
  if (!resumeSkills || resumeSkills.length === 0) {
    return { precision: 0, recall: 0, f1: 0, accuracy: 0, tp: 0, fp: 0, fn: 0, tn: 0 };
  }

  const resumeSet = new Set(resumeSkills.map(s => s.toLowerCase()));
  const requiredSet = new Set(ALL_REQUIRED_SKILLS.map(s => s.toLowerCase()));

  // TP: skills in resume that are required by jobs
  const tp = [...resumeSet].filter(s => requiredSet.has(s)).length;
  // FP: skills in resume that are NOT required by any job
  const fp = [...resumeSet].filter(s => !requiredSet.has(s)).length;
  // FN: required skills NOT in resume
  const fn = [...requiredSet].filter(s => !resumeSet.has(s)).length;
  // TN: skills neither in resume nor required (approximated)
  const tn = Math.max(0, 80 - tp - fp - fn);

  const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
  const recall    = tp + fn > 0 ? tp / (tp + fn) : 0;
  const f1        = precision + recall > 0 ? 2 * precision * recall / (precision + recall) : 0;
  const accuracy  = tp + fp + fn + tn > 0 ? (tp + tn) / (tp + fp + fn + tn) : 0;

  return {
    precision: Math.round(precision * 100),
    recall:    Math.round(recall * 100),
    f1:        Math.round(f1 * 100),
    accuracy:  Math.round(accuracy * 100),
    tp, fp, fn, tn,
  };
}

function AnimatedNumber({ value, duration = 1200 }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = value / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setDisplay(value); clearInterval(timer); }
      else setDisplay(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [value, duration]);
  return <>{display}</>;
}

function MetricBar({ label, value, color, tooltip }) {
  const [width, setWidth] = useState(0);
  useEffect(() => { setTimeout(() => setWidth(value), 200); }, [value]);
  return (
    <div data-tooltip={tooltip} style={{ marginBottom: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <span style={{ fontSize: "13px", fontWeight: "600", color: "var(--text-mid)" }}>{label}</span>
        <span style={{ fontSize: "13px", fontWeight: "700", color }}>{value}%</span>
      </div>
      <div style={{ height: "8px", background: "var(--beige-dark)", borderRadius: "100px", overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${width}%`, background: color,
          borderRadius: "100px", transition: "width 1.2s cubic-bezier(0.4,0,0.2,1)"
        }} />
      </div>
    </div>
  );
}

function FloatingOrbs() {
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
      {[
        { w: 500, h: 500, top: "-10%", left: "-5%", color: "rgba(74,127,165,0.08)", dur: "20s" },
        { w: 400, h: 400, top: "50%", right: "-8%", color: "rgba(74,127,165,0.06)", dur: "25s" },
        { w: 300, h: 300, bottom: "10%", left: "30%", color: "rgba(200,184,154,0.12)", dur: "18s" },
        { w: 250, h: 250, top: "30%", left: "20%", color: "rgba(74,127,165,0.05)", dur: "22s" },
        { w: 200, h: 200, bottom: "20%", right: "20%", color: "rgba(200,184,154,0.08)", dur: "15s" },
      ].map((orb, i) => (
        <div key={i} style={{
          position: "absolute", width: orb.w, height: orb.h,
          top: orb.top, left: orb.left, right: orb.right, bottom: orb.bottom,
          background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
          borderRadius: "50%",
          animation: `floatOrb${i} ${orb.dur} ease-in-out infinite alternate`,
        }} />
      ))}
      <style>{`
        @keyframes floatOrb0{0%{transform:translate(0,0) scale(1)}100%{transform:translate(40px,60px) scale(1.1)}}
        @keyframes floatOrb1{0%{transform:translate(0,0) scale(1)}100%{transform:translate(-50px,40px) scale(0.9)}}
        @keyframes floatOrb2{0%{transform:translate(0,0) scale(1)}100%{transform:translate(30px,-50px) scale(1.15)}}
        @keyframes floatOrb3{0%{transform:translate(0,0) scale(1)}100%{transform:translate(-30px,30px) scale(0.95)}}
        @keyframes floatOrb4{0%{transform:translate(0,0) scale(1)}100%{transform:translate(20px,-40px) scale(1.05)}}
      `}</style>
    </div>
  );
}

function ParticleCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 2 + 0.5, dx: (Math.random() - 0.5) * 0.4,
      dy: (Math.random() - 0.5) * 0.4, opacity: Math.random() * 0.4 + 0.1,
    }));
    let animId;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(74,127,165,${p.opacity})`; ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(74,127,165,${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, opacity: 0.6 }} />;
}

export default function Dashboard() {
  const [resumeSkills, setResumeSkills] = useState([]);
  const [education, setEducation] = useState("");
  const [experience, setExperience] = useState("");
  const [matchedCount, setMatchedCount] = useState(ALL_JOBS.length);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [userName, setUserName] = useState("User");
  const [metrics, setMetrics] = useState({ precision: 0, recall: 0, f1: 0, accuracy: 0, tp: 0, fp: 0, fn: 0, tn: 0 });

  useEffect(() => {
    const name    = localStorage.getItem("user_name");
    const edu     = localStorage.getItem("resume_education");
    const exp     = localStorage.getItem("resume_experience");
    const applied = localStorage.getItem("applied_jobs");
    const saved   = localStorage.getItem("resume_skills");

    if (name) setUserName(name);
    if (edu) setEducation(edu);
    if (exp) setExperience(exp);
    if (applied) setAppliedJobs(JSON.parse(applied));

    if (saved) {
      const skills = JSON.parse(saved);
      setResumeSkills(skills);
      setMetrics(computeMetrics(skills));
      if (skills.length > 0) {
        const count = ALL_JOBS.filter(job =>
          job.tags.some(tag =>
            skills.some(s =>
              s.toLowerCase().includes(tag.toLowerCase()) ||
              tag.toLowerCase().includes(s.toLowerCase())
            )
          )
        ).length;
        setMatchedCount(count);
      }
    }
  }, []);

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <ParticleCanvas />
      <FloatingOrbs />

      <div className="page" style={{ position: "relative", zIndex: 1 }}>
        <div className="page-header">
          <h1>Welcome back, {userName} 👋</h1>
          <p>Here's what's happening with your job search today.</p>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card" data-tooltip="Jobs matched to your resume skills">
            <span className="stat-icon">🎯</span>
            <div className="stat-number"><AnimatedNumber value={matchedCount} /></div>
            <div className="stat-label">Job Matches</div>
          </div>
          <div className="stat-card" data-tooltip="Skills found in your resume">
            <span className="stat-icon">🧠</span>
            <div className="stat-number"><AnimatedNumber value={resumeSkills.length} /></div>
            <div className="stat-label">Skills Detected</div>
          </div>
          <div className="stat-card" data-tooltip="Jobs you have applied to">
            <span className="stat-icon">📨</span>
            <div className="stat-number"><AnimatedNumber value={appliedJobs.length} /></div>
            <div className="stat-label">Jobs Applied</div>
          </div>
        </div>

        {/* NLP Metrics */}
        {resumeSkills.length > 0 && (
          <div className="result-box" style={{ marginBottom: "24px" }}>
            <h3 style={{ marginBottom: "8px" }}>📊 NLP Model Performance Metrics</h3>
            <p style={{ fontSize: "13px", color: "var(--text-light)", marginBottom: "20px" }}>
              How well your resume skills match job market requirements
            </p>

            {/* Score cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px", marginBottom: "24px" }}>
              {[
                { label: "F1 Score", value: metrics.f1, color: "#4A7FA5", tooltip: "Harmonic mean of Precision and Recall — overall match quality" },
                { label: "Precision", value: metrics.precision, color: "#4a9e7a", tooltip: `${metrics.tp} of your skills are relevant to job market (TP=${metrics.tp}, FP=${metrics.fp})` },
                { label: "Recall", value: metrics.recall, color: "#e8a020", tooltip: `You have ${metrics.tp} of ${metrics.tp + metrics.fn} required skills (TP=${metrics.tp}, FN=${metrics.fn})` },
                { label: "Accuracy", value: metrics.accuracy, color: "#9b59b6", tooltip: `Overall skill coverage score (TP=${metrics.tp}, TN=${metrics.tn}, FP=${metrics.fp}, FN=${metrics.fn})` },
              ].map(m => (
                <div key={m.label} data-tooltip={m.tooltip} style={{
                  background: "var(--beige)", borderRadius: "12px", padding: "20px",
                  textAlign: "center", border: "1px solid var(--beige-dark)",
                  transition: "all 0.3s", cursor: "default",
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <div style={{ fontSize: "32px", fontWeight: "700", color: m.color, fontFamily: "Playfair Display, serif" }}>
                    <AnimatedNumber value={m.value} />%
                  </div>
                  <div style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-light)", textTransform: "uppercase", letterSpacing: "0.5px", marginTop: "4px" }}>
                    {m.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Progress bars */}
            <MetricBar label="F1 Score" value={metrics.f1} color="#4A7FA5" tooltip="Overall NLP match quality" />
            <MetricBar label="Precision" value={metrics.precision} color="#4a9e7a" tooltip="How relevant your skills are" />
            <MetricBar label="Recall" value={metrics.recall} color="#e8a020" tooltip="How many required skills you have" />
            <MetricBar label="Accuracy" value={metrics.accuracy} color="#9b59b6" tooltip="Overall skill coverage" />

            {/* Confusion matrix summary */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "10px", marginTop: "16px" }}>
              {[
                { label: "True Positive", value: metrics.tp, color: "#4a9e7a", bg: "rgba(74,158,122,0.1)", tooltip: "Skills you have that jobs need" },
                { label: "True Negative", value: metrics.tn, color: "#4A7FA5", bg: "rgba(74,127,165,0.1)", tooltip: "Skills neither you nor jobs have" },
                { label: "False Positive", value: metrics.fp, color: "#e8a020", bg: "rgba(232,160,32,0.1)", tooltip: "Skills you have but jobs don't need" },
                { label: "False Negative", value: metrics.fn, color: "#c0504a", bg: "rgba(192,80,74,0.1)", tooltip: "Skills jobs need but you don't have" },
              ].map(m => (
                <div key={m.label} data-tooltip={m.tooltip} style={{
                  background: m.bg, borderRadius: "8px", padding: "12px",
                  textAlign: "center", border: `1px solid ${m.color}30`,
                  transition: "all 0.3s", cursor: "default",
                }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                >
                  <div style={{ fontSize: "22px", fontWeight: "700", color: m.color }}>{m.value}</div>
                  <div style={{ fontSize: "11px", color: m.color, fontWeight: "600", marginTop: "2px" }}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="quick-actions">
          <Link to="/upload" className="action-card" data-tooltip="Upload resume for better matches">
            <div className="action-icon">📤</div>
            <div className="action-text">
              <h3>Upload Resume</h3>
              <p>Let AI extract your skills and experience</p>
            </div>
          </Link>
          <Link to="/jobs" className="action-card" data-tooltip="View matched jobs">
            <div className="action-icon">🔍</div>
            <div className="action-text">
              <h3>Browse Job Matches</h3>
              <p>See {matchedCount} roles tailored to your profile</p>
            </div>
          </Link>
        </div>

        {/* Skills */}
        {resumeSkills.length > 0 && (
          <div className="result-box" style={{ marginBottom: "20px" }}>
            <h3>🏆 Your Detected Skills ({resumeSkills.length})</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "12px" }}>
              {resumeSkills.map(skill => (
                <span key={skill} className="skills-badge" data-tooltip="Skill from your resume">{skill}</span>
              ))}
            </div>
          </div>
        )}

        {education && (
          <div className="result-box" style={{ marginBottom: "20px" }}>
            <h3>🎓 Education</h3>
            <div className="result-text" style={{ maxHeight: "120px" }}>{education}</div>
          </div>
        )}

        {experience && (
          <div className="result-box" style={{ marginBottom: "20px" }}>
            <h3>💼 Experience</h3>
            <div className="result-text" style={{ maxHeight: "120px" }}>{experience}</div>
          </div>
        )}

        {appliedJobs.length > 0 && (
          <div className="result-box" style={{ marginBottom: "20px" }}>
            <h3>📨 Jobs You Applied To ({appliedJobs.length})</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "12px" }}>
              {appliedJobs.map((job, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "12px 16px", background: "var(--beige)", borderRadius: "8px",
                  border: "1px solid var(--beige-dark)"
                }}>
                  <div>
                    <div style={{ fontWeight: "600", fontSize: "15px" }}>{job.title}</div>
                    <div style={{ fontSize: "13px", color: "var(--text-light)" }}>{job.company} · {job.location}</div>
                  </div>
                  <span style={{
                    background: "rgba(74,158,122,0.15)", color: "var(--success)",
                    padding: "4px 12px", borderRadius: "100px", fontSize: "12px", fontWeight: "600"
                  }}>Applied ✓</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {resumeSkills.length === 0 && (
          <div className="result-box" style={{ textAlign: "center" }}>
            <p style={{ color: "var(--text-light)", marginBottom: "16px" }}>
              Upload your resume to see personalised job matches, skill detection and NLP metrics
            </p>
            <Link to="/upload" style={{
              background: "var(--dark)", color: "white", padding: "12px 28px",
              borderRadius: "8px", textDecoration: "none", fontWeight: "600"
            }}>Upload Resume Now</Link>
          </div>
        )}
      </div>
    </div>
  );
}
