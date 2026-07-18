import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Jobs from "./pages/Jobs";
import Navbar from "./components/Navbar";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<PrivateRoute><><Navbar /><Dashboard /></></PrivateRoute>} />
        <Route path="/upload" element={<PrivateRoute><><Navbar /><Upload /></></PrivateRoute>} />
        <Route path="/jobs" element={<PrivateRoute><><Navbar /><Jobs /></></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
