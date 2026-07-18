import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ full_name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Registration failed");
      }
      localStorage.setItem("user_name", form.full_name.split(" ")[0]);
      setSuccess("Account created! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
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
          <h1>Start Your <span>Career Journey</span> Today</h1>
          <p>Join thousands of professionals who found their perfect role using our AI-powered platform.</p>
        </div>
        <div className="auth-features">
          <div className="auth-feature"><div className="auth-feature-icon">🚀</div>Get matched in minutes</div>
          <div className="auth-feature"><div className="auth-feature-icon">🔒</div>Your data is secure</div>
          <div className="auth-feature"><div className="auth-feature-icon">💡</div>Personalised suggestions</div>
          <div className="auth-feature"><div className="auth-feature-icon">🌍</div>Jobs from top companies</div>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-form-box">
          <h2>Create your account</h2>
          <p className="subtitle">Free forever. No credit card required.</p>
          {error && <div className="error-msg">⚠ {error}</div>}
          {success && <div className="success-msg">✓ {success}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" placeholder="John Doe" value={form.full_name}
                onChange={e => setForm({ ...form, full_name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" placeholder="you@example.com" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="Create a strong password" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            <button className="btn-primary" type="submit" disabled={loading}>
              {loading && <span className="spinner" />}
              <span>{loading ? "Creating account..." : "Create Account"}</span>
            </button>
          </form>
          <div className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
