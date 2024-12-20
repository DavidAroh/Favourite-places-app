import React from "react";
import { useNavigate } from "react-router-dom"; // Updated hook for v6
import Auth from "../components/Auth";

const LoginPage = () => {
  const navigate = useNavigate(); // Use navigate instead of useHistory

  const onAuthSuccess = () => {
    // Redirect to the dashboard or another page after login
    navigate("/"); // Use navigate to change the route
  };

  return <Auth type="login" onAuthSuccess={onAuthSuccess} />;
};

export default LoginPage;
