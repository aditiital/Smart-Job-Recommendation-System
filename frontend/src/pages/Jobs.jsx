import { useState, useEffect } from "react";

const ALL_JOBS = [
  { id: 1, title: "Backend Engineer", company: "Google", location: "Bangalore, India", desc: "Build scalable APIs and microservices for Google Cloud Platform using Python and Go.", tags: ["Python", "FastAPI", "GCP", "Docker"], link: "https://careers.google.com" },
  { id: 2, title: "Full Stack Developer", company: "Microsoft", location: "Hyderabad, India", desc: "Develop end-to-end features for Azure developer tools using React and .NET.", tags: ["React", "TypeScript", "Azure", "SQL"], link: "https://careers.microsoft.com" },
  { id: 3, title: "ML Engineer", company: "Amazon", location: "Remote", desc: "Train and deploy machine learning models at scale for Amazon recommendation systems.", tags: ["Python", "PyTorch", "AWS", "MLOps"], link: "https://amazon.jobs" },
  { id: 4, title: "DevOps Engineer", company: "Flipkart", location: "Bangalore, India", desc: "Manage CI/CD pipelines and Kubernetes clusters for India's largest e-commerce platform.", tags: ["Docker", "Kubernetes", "Jenkins", "Linux"], link: "https://www.flipkartcareers.com" },
  { id: 5, title: "Data Scientist", company: "Zomato", location: "Gurugram, India", desc: "Build predictive models to improve food delivery ETAs and restaurant recommendations.", tags: ["Python", "SQL", "Machine Learning", "Spark"], link: "https://www.zomato.com/careers" },
  { id: 6, title: "React Developer", company: "Razorpay", location: "Bangalore, India", desc: "Build beautiful payment interfaces and dashboards for India's top fintech company.", tags: ["React", "JavaScript", "CSS", "REST APIs"], link: "https://razorpay.com/jobs" },
  { id: 7, title: "Python Developer", company: "Infosys", location: "Pune, India", desc: "Develop backend systems and automate workflows using Python and FastAPI.", tags: ["Python", "FastAPI", "PostgreSQL", "Git"], link: "https://www.infosys.com/careers" },
  { id: 8, title: "Frontend Developer", company: "Swiggy", location: "Bangalore, India", desc: "Build fast and accessible user interfaces for millions of users across India.", tags: ["React", "JavaScript", "HTML", "CSS"], link: "https://careers.swiggy.com" },
  { id: 9, title: "Cloud Engineer", company: "TCS", location: "Chennai, India", desc: "Design and manage cloud infrastructure on AWS and Azure for enterprise clients.", tags: ["AWS", "Azure", "Docker", "Linux"], link: "https://www.tcs.com/careers" },
  { id: 10, title: "Data Engineer", company: "Paytm", location: "Noida, India", desc: "Build data pipelines and warehouses to process millions of transactions daily.", tags: ["Python", "Spark", "SQL", "Kafka"], link: "https://paytm.com/careers" },
  { id: 11, title: "AI Engineer", company: "CRED", location: "Bangalore, India", desc: "Build intelligent credit scoring and fraud detection systems using ML.", tags: ["Python", "Machine Learning", "PyTorch", "SQL"], link: "https://careers.cred.club" },
  { id: 12, title: "Software Engineer", company: "Wipro", location: "Hyderabad, India", desc: "Develop enterprise software solutions using modern web technologies.", tags: ["Java", "React", "SQL", "Git"], link: "https://careers.wipro.com" },
  { id: 13, title: "Node.js Developer", company: "Freshworks", location: "Chennai, India", desc: "Build high-performance backend services and integrations for SaaS products.", tags: ["Node.js", "Express", "MongoDB", "Docker"], link: "https://www.freshworks.com/company/careers" },
  { id: 14, title: "Django Developer", company: "Ola", location: "Bangalore, India", desc: "Build backend APIs and internal tools to power India's largest ride-sharing platform.", tags: ["Python", "Django", "PostgreSQL", "Redis"], link: "https://www.olacabs.com/careers" },
  { id: 15, title: "Frontend Engineer", company: "PhonePe", location: "Bangalore, India", desc: "Build scalable and performant React applications for 500M+ users.", tags: ["React", "Redux", "TypeScript", "Jest"], link: "https://www.phonepe.com/careers" },
  { id: 16, title: "Java Developer", company: "HCL", location: "Noida, India", desc: "Design and implement enterprise Java applications using Spring Boot.", tags: ["Java", "Spring Boot", "MySQL", "Docker"], link: "https://www.hcltech.com/careers" },
  { id: 17, title: "Deep Learning Engineer", company: "NVIDIA", location: "Pune, India", desc: "Research and develop deep learning models for computer vision and NLP.", tags: ["Python", "TensorFlow", "Keras", "AWS"], link: "https://www.nvidia.com/en-us/about-nvidia/careers" },
  { id: 18, title: "Platform Engineer", company: "Atlassian", location: "Remote", desc: "Build and maintain developer platforms using modern DevOps tools.", tags: ["DevOps", "Jenkins", "Kubernetes", "Terraform"], link: "https://www.atlassian.com/company/careers" },
  { id: 19, title: "MERN Stack Developer", company: "Byju's", location: "Bangalore, India", desc: "Develop full-stack features for India's leading EdTech platform.", tags: ["React", "Node.js", "MongoDB", "Express"], link: "https://byjus.com/jobs" },
  { id: 20, title: "API Developer", company: "Zerodha", location: "Bangalore, India", desc: "Build low-latency trading APIs and developer tools for India's largest stock broker.", tags: ["Python", "FastAPI", "Redis", "Docker"], link: "https://zerodha.com/careers" },
  { id: 21, title: "Android Developer", company: "ShareChat", location: "Bangalore, India", desc: "Build native Android features for India's largest regional social media platform.", tags: ["Android", "Kotlin", "Firebase", "Git"], link: "https://sharechat.com/careers" },
  { id: 22, title: "iOS Developer", company: "Meesho", location: "Bangalore, India", desc: "Build and ship iOS features for India's fastest growing social commerce app.", tags: ["iOS", "Swift", "Xcode", "Firebase"], link: "https://meesho.io/careers" },
  { id: 23, title: "Business Analyst", company: "Deloitte", location: "Mumbai, India", desc: "Analyse business data and build dashboards to drive strategic decisions.", tags: ["Python", "Pandas", "NumPy", "Tableau"], link: "https://www2.deloitte.com/in/en/careers.html" },
  { id: 24, title: "GraphQL Engineer", company: "Hasura", location: "Remote", desc: "Build and maintain GraphQL APIs and real-time data infrastructure.", tags: ["React", "GraphQL", "Node.js", "PostgreSQL"], link: "https://hasura.io/careers" },
];

export default function Jobs() {
  const [applied, setApplied] = useState([]);
  const [search, setSearch] = useState("");
  const [resumeSkills, setResumeSkills] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("resume_skills");
    if (saved) setResumeSkills(JSON.parse(saved));
    const savedApplied = localStorage.getItem("applied_jobs");
    if (savedApplied) {
      const jobs = JSON.parse(savedApplied);
      setApplied(jobs.map(j => j.id));
    }
  }, []);

  const getMatchScore = (job) => {
    if (resumeSkills.length === 0) return 0;
    return job.tags.filter(tag =>
      resumeSkills.some(skill =>
        skill.toLowerCase().includes(tag.toLowerCase()) ||
        tag.toLowerCase().includes(skill.toLowerCase())
      )
    ).length;
  };

  const sortedJobs = [...ALL_JOBS]
    .map(job => ({ ...job, matchScore: getMatchScore(job) }))
    .sort((a, b) => b.matchScore - a.matchScore);

  const filtered = sortedJobs.filter(j =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.company.toLowerCase().includes(search.toLowerCase()) ||
    j.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  );

  const handleApply = (job) => {
    if (applied.includes(job.id)) return;

    // Save to localStorage
    const savedApplied = localStorage.getItem("applied_jobs");
    const existing = savedApplied ? JSON.parse(savedApplied) : [];
    const updated = [...existing, { id: job.id, title: job.title, company: job.company, location: job.location }];
    localStorage.setItem("applied_jobs", JSON.stringify(updated));
    setApplied(prev => [...prev, job.id]);

    // Open official job link
    window.open(job.link, "_blank");
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Your Job Matches</h1>
        <p>
          {resumeSkills.length > 0
            ? `Showing ${filtered.length} jobs — sorted by best skill match`
            : `Showing all ${filtered.length} available jobs — upload your resume for personalised matches`}
        </p>
      </div>

      {resumeSkills.length > 0 && (
        <div className="result-box" style={{ marginBottom: "24px" }}>
          <h3>🎯 Matching based on your skills</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "12px" }}>
            {resumeSkills.map(skill => (
              <span key={skill} className="skills-badge" data-tooltip={`Filtering jobs by ${skill}`}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="form-group" style={{ marginBottom: "32px" }}>
        <input
          type="text"
          placeholder="🔍  Search by title, company or skill..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: "480px" }}
        />
      </div>

      {filtered.length === 0 && (
        <div className="result-box" style={{ textAlign: "center", color: "var(--text-light)" }}>
          No jobs match your search. Try a different keyword.
        </div>
      )}

      <div className="jobs-grid">
        {filtered.map(job => (
          <div key={job.id} className="job-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <div className="job-company">{job.company} · {job.location}</div>
              {job.matchScore > 0 && (
                <span style={{
                  background: job.matchScore >= 3 ? "var(--success)" : "var(--blue)",
                  color: "white", fontSize: "11px", fontWeight: "600",
                  padding: "3px 10px", borderRadius: "100px"
                }}>
                  {job.matchScore} skill{job.matchScore > 1 ? "s" : ""} match
                </span>
              )}
            </div>
            <div className="job-title">{job.title}</div>
            <div className="job-desc">{job.desc}</div>
            <div className="job-tags">
              {job.tags.map(tag => {
                const isMatched = resumeSkills.some(s =>
                  s.toLowerCase().includes(tag.toLowerCase()) ||
                  tag.toLowerCase().includes(s.toLowerCase())
                );
                return (
                  <span key={tag} className="job-tag"
                    data-tooltip={isMatched ? "✓ You have this skill!" : "Required skill"}
                    style={isMatched ? { background: "rgba(74,158,122,0.15)", borderColor: "var(--success)", color: "var(--success)" } : {}}
                  >
                    {tag}
                  </span>
                );
              })}
            </div>
            <button
              className="btn-apply"
              onClick={() => handleApply(job)}
              disabled={applied.includes(job.id)}
              data-tooltip={applied.includes(job.id) ? "Already applied!" : "Click to apply on official website"}
              style={applied.includes(job.id) ? { background: "var(--success)", color: "white", borderColor: "var(--success)" } : {}}
            >
              {applied.includes(job.id) ? "✓ Applied!" : "Apply Now →"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
