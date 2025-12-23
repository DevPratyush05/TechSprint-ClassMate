import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebaseConfig";

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredential.user, { displayName: name });
      alert("Account Created! Redirecting...");
      navigate("/dashboard");
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
    }
    setLoading(false);
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleSignup} style={cardStyle}>
        <h2 style={titleStyle}>Create Admin Account</h2>

        {error && <p style={errorStyle}>{error}</p>}

        <div style={inputGroupStyle}>
          <label style={labelStyle}>Full Name</label>
          <input
            type="text"
            placeholder="John Doe"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />
        </div>

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
            placeholder="Min 6 chars"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />
        </div>

        <button type="submit" style={buttonStyle} disabled={loading}>
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <p style={footerTextStyle}>
          Already have an account?{" "}
          <Link to="/login" style={linkBoldStyle}>
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

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

export default Signup;
