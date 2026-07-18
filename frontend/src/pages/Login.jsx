import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Login failed");
      }
      const data = await res.json();
      localStorage.setItem("token", data.access_token);

      // Save name from email (first part before @)
      const name = form.email.split("@")[0];
      const formatted = name.charAt(0).toUpperCase() + name.slice(1);
      localStorage.setItem("user_name", formatted);

      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-brand">
          <h1>Find Your <span>Dream Job</span> with AI</h1>
          <p>Upload your resume and let our AI match you with the perfect opportunities tailored to your skills.</p>
        </div>
        <div className="auth-features">
          <div className="auth-feature"><div className="auth-feature-icon">🤖</div>AI-powered job matching</div>
          <div className="auth-feature"><div className="auth-feature-icon">📄</div>Smart resume analysis</div>
          <div className="auth-feature"><div className="auth-feature-icon">⚡</div>Real-time recommendations</div>
          <div className="auth-feature"><div className="auth-feature-icon">🎯</div>Skills gap detection</div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-form-box">
          <h2>Welcome back</h2>
          <p className="subtitle">Sign in to your account to continue</p>
          {error && <div className="error-msg">⚠ {error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="you@example.com" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="Enter your password" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            <button className="btn-primary" type="submit" disabled={loading}>
              {loading && <span className="spinner" />}
              <span>{loading ? "Signing in..." : "Sign In"}</span>
            </button>
          </form>
          <div className="auth-switch">
            Don't have an account? <Link to="/register">Create one free</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
