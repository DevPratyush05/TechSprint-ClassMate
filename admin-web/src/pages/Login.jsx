import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Invalid Email or Password");
    }
    setLoading(false);
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleLogin} style={cardStyle}>
        <h2 style={titleStyle}>Admin Portal</h2>

        {error && <p style={errorStyle}>{error}</p>}

        <div style={inputGroupStyle}>
          <label style={labelStyle}>Email Address</label>
          <input
            type="email"
            placeholder="admin@college.edu"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />
        </div>

        <div style={linkContainerStyle}>
          <Link to="/forgot-password" style={linkStyle}>
            Forgot Password?
          </Link>
        </div>

        <button type="submit" style={buttonStyle} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p style={footerTextStyle}>
          New Admin?{" "}
          <Link to="/signup" style={linkBoldStyle}>
            Create Account
          </Link>
        </p>
      </form>
    </div>
  );
};

// --- STYLES ---
const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  width: "100vw",
  backgroundColor: "#f0f4f8",
  margin: 0,
  padding: 0,
  position: "fixed",
  top: 0,
  left: 0,
};

const cardStyle = {
  backgroundColor: "#ffffff",
  padding: "40px",
  borderRadius: "12px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  width: "100%",
  maxWidth: "400px",
  display: "flex",
  flexDirection: "column",
  gap: "15px",
};

const titleStyle = {
  textAlign: "center",
  color: "#1e293b",
  marginBottom: "10px",
  fontSize: "24px",
  fontWeight: "bold",
};

const errorStyle = {
  backgroundColor: "#fee2e2",
  color: "#ef4444",
  padding: "10px",
  borderRadius: "6px",
  fontSize: "14px",
  textAlign: "center",
};

const inputGroupStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "6px",
};

const labelStyle = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#475569",
};

const inputStyle = {
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #cbd5e1",
  fontSize: "16px",
  outline: "none",
  transition: "border 0.2s",
};

const linkContainerStyle = {
  textAlign: "right",
  marginBottom: "5px",
};

const linkStyle = {
  color: "#4f46e5",
  fontSize: "13px",
  textDecoration: "none",
};

const buttonStyle = {
  padding: "14px",
  borderRadius: "8px",
  border: "none",
  backgroundColor: "#4f46e5",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "background 0.2s",
};

const footerTextStyle = {
  textAlign: "center",
  fontSize: "14px",
  color: "#64748b",
  marginTop: "10px",
};

const linkBoldStyle = {
  color: "#4f46e5",
  fontWeight: "bold",
  textDecoration: "none",
};

export default Login;
