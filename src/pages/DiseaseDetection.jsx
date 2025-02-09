import React, { useState, useEffect, useRef } from "react";
import * as tmImage from "@teachablemachine/image";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const DiseaseDetection = () => {
  const { t } = useTranslation(); // Translation hook
  const [image, setImage] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [detectedDisease, setDetectedDisease] = useState(""); // Store detected disease name
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const imgRef = useRef(null);
  const navigate = useNavigate();
  
  // Replace with your Teachable Machine model URLs
  const modelURL = "https://teachablemachine.withgoogle.com/models/cDtP-xVkO/model.json";
  const metadataURL = "https://teachablemachine.withgoogle.com/models/cDtP-xVkO/metadata.json";
  
  let modelRef = useRef(null);

  // Load the Teachable Machine model once when component mounts
  useEffect(() => {
    const loadModel = async () => {
      try {
        const loadedModel = await tmImage.load(modelURL, metadataURL);
        modelRef.current = loadedModel;
      } catch (err) {
        setError(t("diseaseDetection.modelLoadError"));
      }
    };
    loadModel();
  }, []);

  // Handle Image Upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Analyze the image and detect disease
  const analyzeImage = async () => {
    if (!image) return;
    if (!modelRef.current) {
      setError(t("diseaseDetection.modelNotLoaded"));
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const imgElement = imgRef.current;
      const prediction = await modelRef.current.predict(imgElement);
      
      // Find the highest probability disease
      const bestPrediction = prediction.reduce((prev, curr) =>
        prev.probability > curr.probability ? prev : curr
      );

      const detectedDiseaseName = bestPrediction.className;
      setPredictions(prediction);
      setDetectedDisease(detectedDiseaseName);
      
      // Navigate to Smart Recommendations with detected disease
      navigate(`/smart-recommendations?disease=${encodeURIComponent(detectedDiseaseName)}`);
    } catch (err) {
      setError(t("diseaseDetection.analysisError"));
    }
    setLoading(false);
  };

  return (
    <div className="container text-center">
      <h2>🌿 {t("diseaseDetection.title")}</h2>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      
      {image && (
        <div>
          <h5>📷 {t("diseaseDetection.imagePreview")}:</h5>
          <img src={image} alt="Uploaded Crop" ref={imgRef} width="300" />
          <br />
          <button className="btn btn-primary mt-2" onClick={analyzeImage} disabled={loading}>
            {loading ? t("diseaseDetection.analyzing") : "🔍 " + t("diseaseDetection.analyze")}
          </button>
        </div>
      )}

      {error && <div className="alert alert-danger mt-3">⚠️ {error}</div>}

      {detectedDisease && (
        <div className="mt-4">
          <h3>{t("diseaseDetection.detectedDisease")}:</h3>
          <h4 className="text-danger">{t(`disease_recommendations.${detectedDisease}.name`, detectedDisease)}</h4>
        </div>
      )}

      {predictions.length > 0 && (
        <div className="mt-3">
          <h3>📊 {t("diseaseDetection.predictionResults")}:</h3>
          <ul className="list-group">
            {predictions.map((pred, index) => (
              <li key={index} className="list-group-item">
                {t(`disease_recommendations.${pred.className}.name`, pred.className)} - 
                <strong>{(pred.probability * 100).toFixed(2)}%</strong>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DiseaseDetection;
