import React, { useState } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import "../styles/Auth.css";

const Auth = ({ onAuthSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
        setIsSignup(false); // Switch to login after successful sign-up
        navigate("/login"); // Navigate to the login page
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        onAuthSuccess(); // Notify the parent component about successful authentication
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle Google sign-in
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      onAuthSuccess(); // Notify the parent component about successful authentication
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-wrapper overlay-container ">
      <div className="container">
        <form onSubmit={handleAuth} className="auth-form">
          <div className="logo-header">
            <div>
              {isSignup
                ? "Ready to explore and share your top spots?"
                : "Your Favorite Places are Waiting!"}
            </div>
            <p className="logo-content">
              {isSignup ? (
                <p
                  style={{
                    color: "#2B2D2F66",
                    textAlign: "center",
                  }}
                >
                  Welcome to TripTrove
                </p>
              ) : (
                <p
                  style={{
                    color: "#2B2D2F66",
                    textAlign: "center",
                  }}
                >
                  Welcome back to TripTrove
                </p>
              )}
            </p>
          </div>
          <p className="started">{isSignup ? "Let’s get started" : ""}</p>
          <label className="auth-text">Email</label>
          <input
            type="email"
            placeholder="input email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <br />

          <label className="auth-text2">Password</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {isSignup ? (
            <div className="checkbox-container">
              <input type="checkbox" id="customCheckbox" />
              <label for="customCheckbox" className="remember"></label>
              <p>Remember me</p>
            </div>
          ) : (
            ""
          )}

          <div className="login-button">
            <button type="submit" className="login-btn">
              {isSignup ? "Sign up" : "Sign in"}
            </button>
          </div>
          <div className="btwn">
            <div className="h-line"></div>
              <p>OR</p>
            <div className="h-line"></div>
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div className="google-btn">
            <button onClick={handleGoogleSignIn} className="google">
              {" "}
              <FcGoogle className="google-icon" />
              Sign In with Gmail
            </button>
            <p onClick={() => setIsSignup(!isSignup)} className="signup">
              {isSignup
                ?(<span>Already have an account? <span className="blue">Login</span></span>)
                : (<span>Don't have an account? <span cla>Sign up</span></span>)}
            </p>
          </div>
        </form>
        <div className="auth-content-right">
          {isSignup ? (
            <div>
              <p
                style={{
                  color: "white",
                  position: "relative",
                  bottom: "-5%",
                }}
              >
                Discover. Save
              </p>
              <p className="content-text">
                Share your favorite <br />
                places around the <br />
                world
              </p>
            </div>
          ) : (
            <div>
              <p
                style={{
                  color: "white",
                  position: "relative",
                  bottom: "-5%",
                }}
              >
                Discover. Save
              </p>
              <p className="content-text">
                Continue exploring <br />
                your saved places <br />
                and plan your next <br />
                adventure
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
