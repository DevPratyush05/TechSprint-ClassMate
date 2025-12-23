import React, { useState } from "react";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebaseConfig";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Check your email for the reset link!");
    } catch (err) {
      console.error(err);
      setError("Failed to send reset email. Check if email is correct.");
    }
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleReset} style={cardStyle}>
        <h2 style={titleStyle}>Reset Password</h2>
        <p style={{ textAlign: "center", color: "#64748b", fontSize: "14px" }}>
          Enter your admin email address and we'll send you a link to reset your
          password.
        </p>

        {message && <p style={successStyle}>{message}</p>}
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

        <button type="submit" style={buttonStyle}>
          Send Reset Link
        </button>

        <Link to="/login" style={backLinkStyle}>
          ← Back to Login
        </Link>
      </form>
    </div>
  );
};

// Styles (Reusing most)
const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  width: "100vw",
  backgroundColor: "#f0f4f8",
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
  marginBottom: "5px",
  fontSize: "24px",
  fontWeight: "bold",
};
const successStyle = {
  backgroundColor: "#dcfce7",
  color: "#166534",
  padding: "10px",
  borderRadius: "6px",
  fontSize: "14px",
  textAlign: "center",
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
const labelStyle = { fontSize: "14px", fontWeight: "600", color: "#475569" };
const inputStyle = {
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #cbd5e1",
  fontSize: "16px",
  outline: "none",
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
  marginTop: "10px",
};
const backLinkStyle = {
  textAlign: "center",
  color: "#64748b",
  fontSize: "14px",
  textDecoration: "none",
  marginTop: "10px",
};

export default ForgotPassword;
