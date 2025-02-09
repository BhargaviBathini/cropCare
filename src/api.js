import axios from "axios";
import recommendations from "../src/data/recommendations.json";

const API_URL = "http://127.0.0.1:5000/predict";  // Flask backend URL

// 🟢 Function to Predict Crop Yield
export const predictYield = async (rainfall, temperature, soilType, area) => {
  try {
    const response = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rainfall: parseFloat(rainfall),
        temperature: parseFloat(temperature),
        soil_type: soilType,
        area: parseFloat(area),
      }),
    });

    if (!response.ok) {
      throw new Error("Prediction request failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return { error: error.message };
  }
};




// 🟢 Function to Get Recommendations Based on Disease
export const getRecommendations = async (disease) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(recommendations.disease_recommendations[disease] || { 
                fertilizer: "No data", 
                water: "No data", 
                soil: "No data" 
            });
        }, 500);
    });
};

// 🟢 Function to Get Crop Recommendations Based on Soil Type and Location
export const fetchCropRecommendations = async (soilType, location) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (recommendations.soil_recommendations[soilType]) {
                resolve(recommendations.soil_recommendations[soilType][location] || ["No data available"]);
            } else {
                resolve(["No data available in this location"]);
            }
        }, 500);
    });
};
