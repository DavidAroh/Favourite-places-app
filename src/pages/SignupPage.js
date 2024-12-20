import React from "react";
import Auth from "../components/Auth";

const SignupPage = ({ onAuthSuccess }) => {
  return <Auth type="signup" onAuthSuccess={onAuthSuccess} />;
};

export default SignupPage;
