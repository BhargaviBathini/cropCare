import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import CropHealth from "./pages/CropHealth.jsx";
import Weather from "./pages/Weather.jsx"; // Import Weather component
import SmartRecommendations from "./pages/SmartRecommendations.jsx";
import DiseaseDetection from "./pages/DiseaseDetection.jsx";
import CropRecommendations from "./pages/CropRecommendations.jsx";
import YieldPrediction from "./pages/YieldPrediction.jsx";
import './app.css';
const App = () => {
  return (
    <>
      <Header />
      <Routes>
      <Route
  path="/"
  element={<h1 className="welcome-text">🌾 Welcome to Crop Care 🌾</h1>}
/>

        <Route path="/weather" element={<Weather />} />
        <Route path="/crop-health" element={<CropHealth />} />
        <Route path="/smart-recommendations" element={<SmartRecommendations />} />
        <Route path="/disease-detection" element={<DiseaseDetection />} />
        <Route path="/crop-recommendation" element={<CropRecommendations />} />
        <Route path="/yield" element={<YieldPrediction />} />
      </Routes>
    </>
  );
};

export default App;
