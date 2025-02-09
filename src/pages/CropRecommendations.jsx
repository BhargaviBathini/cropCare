import React, { useState } from "react";
import { Container, Form, Button, Card, Spinner, Alert } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import recommendationsData from "../data/recommendations.json"; // Import recommendations data
import "./CropRecommendation.css"; // Import new styles

const CropRecommendation = () => {
  const { t, i18n } = useTranslation();
  const [soilType, setSoilType] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendedCrops, setRecommendedCrops] = useState([]);
  const [error, setError] = useState("");

  const fetchCropRecommendations = (soil, loc) => {
    const formattedSoil = soil.toLowerCase();
    const formattedLoc = loc.charAt(0).toUpperCase() + loc.slice(1).toLowerCase();

    if (
      recommendationsData.soil_recommendations &&
      recommendationsData.soil_recommendations[formattedSoil] &&
      recommendationsData.soil_recommendations[formattedSoil][formattedLoc]
    ) {
      return recommendationsData.soil_recommendations[formattedSoil][formattedLoc];
    }
    return [];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setRecommendedCrops([]);

    if (!soilType || !location.trim()) {
      setError(t("cropRecommendation.error"));
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const crops = fetchCropRecommendations(soilType, location.trim());
      if (crops.length === 0) {
        setError(t("cropRecommendation.fetchError"));
      } else {
        setRecommendedCrops(crops);
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <Container className="crop-recommendation-container">
      <Card className="crop-recommendation-card">
        <Card.Body>
          <h2>🌱 {t("cropRecommendation.title")}</h2>
          <p>{t("cropRecommendation.description")}</p>

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>{t("cropRecommendation.soilTypeLabel")}</Form.Label>
              <Form.Select value={soilType} onChange={(e) => setSoilType(e.target.value)}>
                <option value="">{t("cropRecommendation.selectSoilType")}</option>
                <option value="clay">{t("cropRecommendation.soilTypes.clay")}</option>
                <option value="sandy">{t("cropRecommendation.soilTypes.sandy")}</option>
                <option value="loamy">{t("cropRecommendation.soilTypes.loamy")}</option>
                <option value="silt">{t("cropRecommendation.soilTypes.silt")}</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>{t("cropRecommendation.locationLabel")}</Form.Label>
              <Form.Control
                type="text"
                placeholder={t("cropRecommendation.locationPlaceholder")}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </Form.Group>

            <Button variant="primary" type="submit" disabled={loading} className="submit-btn">
              {loading ? <Spinner animation="border" size="sm" /> : t("cropRecommendation.submitButton")}
            </Button>
          </Form>

          {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

          {recommendedCrops.length > 0 && (
            <Card className="mt-4 p-3 recommendation-result">
              <h4>{t("cropRecommendation.recommendedCrops")}</h4>
              <ul>
                {recommendedCrops.map((crop, index) => (
                  <li key={index}>
                    {t(`crops.${crop.toLowerCase()}`, crop)}
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CropRecommendation;
