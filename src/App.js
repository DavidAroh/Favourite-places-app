import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import CategorySelection from "./components/CategorySelection";
import MapComponent from "./components/MapComponent";
import "leaflet/dist/leaflet.css";

function App({ userId }) {
  return (
    <Router>
      <Routes>
        {/* Authentication Pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Home Page */}
        <Route path="/" element={<HomePage />} />

        {/* Category Selection and Map Components */}
        <Route path="/categories" element={<CategorySelection userId={userId} />} />
        <Route path="/map" element={<MapComponent userId={userId} />} />
      </Routes>
    </Router>
  );
}

export default App;
