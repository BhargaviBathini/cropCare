import React, { useState } from "react";
import { Container, Button, Form, Spinner, Alert, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import * as tmImage from "@teachablemachine/image";
import { useTranslation } from "react-i18next";
import { getRecommendations } from "../api";
import "./CropHealth.css";

const MODEL_URL = "https://teachablemachine.withgoogle.com/models/cDtP-xVkO/";

const CropHealth = () => {
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [disease, setDisease] = useState("");
  const navigate = useNavigate();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImageURL(URL.createObjectURL(file));
      setError("");
      setDisease("");
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) {
      setError(t("cropHealth.errorMessage"));
      return;
    }

    setLoading(true);
    setError("");

    try {
      const model = await tmImage.load(MODEL_URL + "model.json", MODEL_URL + "metadata.json");
      const imgElement = document.getElementById("uploaded-image");

      const prediction = await model.predict(imgElement);
      const detectedDisease = prediction.reduce((prev, curr) =>
        prev.probability > curr.probability ? prev : curr
      ).className;

      setDisease(detectedDisease);

      const recommendations = await getRecommendations(detectedDisease);
      navigate(`/smart-recommendations?disease=${detectedDisease}`, { state: { recommendations } });

    } catch (err) {
      setError(t("cropHealth.modelError"));
      console.error("Error:", err);
    }

    setLoading(false);
  };

  return (
    <Container className="crop-health-container">
      <Card className="crop-health-card">
        <Card.Body>
          <h2>🌿 {t("cropHealth.title")}</h2>
          <p>{t("cropHealth.subtitle")}</p>

          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>{t("cropHealth.selectImage")}</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
          </Form.Group>

          {imageURL && (
            <div className="image-preview-container">
              <img id="uploaded-image" className="image-preview" src={imageURL} alt="Selected Crop" />
            </div>
          )}

          {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

          <Button className="mt-3 analyze-btn" variant="primary" onClick={analyzeImage} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : `🔍 ${t("cropHealth.analyzeButton")}`}
          </Button>

          {disease && (
            <div className="result-section mt-4">
              <h4>🦠 {t("cropHealth.detectedDisease")}: <strong>{disease}</strong></h4>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CropHealth;
