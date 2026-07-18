import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        Job<span>AI</span>
      </Link>
      <div className="navbar-links">
        <Link to="/" className={location.pathname === "/" ? "active" : ""} data-tooltip="Your dashboard">
          Dashboard
        </Link>
        <Link to="/upload" className={location.pathname === "/upload" ? "active" : ""} data-tooltip="Upload your resume">
          Upload Resume
        </Link>
        <Link to="/jobs" className={location.pathname === "/jobs" ? "active" : ""} data-tooltip="Browse job matches">
          Job Matches
        </Link>
        <button className="btn-logout" onClick={logout} data-tooltip="Sign out">
          Logout
        </button>
      </div>
    </nav>
  );
}