import React, { useState, useEffect } from "react";
import { Container, Card, Spinner, Alert } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getRecommendations, fetchCropRecommendations } from "../api";

const SmartRecommendations = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const detectedDisease = params.get("disease");
  const selectedSoil = params.get("soil");
  const selectedLocation = params.get("location");

  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (detectedDisease) {
      fetchDiseaseRecommendations(detectedDisease);
    } else if (selectedSoil && selectedLocation) {
      fetchSoilRecommendations(selectedSoil, selectedLocation);
    }
  }, [detectedDisease, selectedSoil, selectedLocation]);

  const fetchDiseaseRecommendations = async (disease) => {
    setLoading(true);
    setError(null);
    setRecommendations(null);
    try {
      const data = await getRecommendations(disease);
      setRecommendations(data);
    } catch (err) {
      setError(t("smartRecommendations.fetchError"));
    }
    setLoading(false);
  };

  const fetchSoilRecommendations = async (soil, loc) => {
    setLoading(true);
    setError(null);
    setRecommendations(null);
    try {
      const crops = await fetchCropRecommendations(soil, loc);
      if (!crops || crops.length === 0 || crops[0] === "No data available") {
        setError(t("smartRecommendations.noCropsFound"));
      } else {
        setRecommendations({ crops });
      }
    } catch (err) {
      setError(t("smartRecommendations.fetchError"));
    }
    setLoading(false);
  };

  return (
    <Container className="mt-4 text-center">
      <h2 className="mb-3">🌿 {t("smartRecommendations.title")}</h2>

      {loading && <Spinner animation="border" role="status" />}
      {error && <Alert variant="danger">{error}</Alert>}

      {recommendations && (
        <Card className="p-4 shadow-lg">
          {detectedDisease ? (
            <>
              <h4 className="text-danger">
                🦠 {t("recommendations.disease")}: {t(`diseases.${detectedDisease}`, detectedDisease)}
              </h4>
              <p>
                <strong>🌱 {t("fertilizer")}:</strong>{" "}
                {t(`disease_recommendations.${detectedDisease}.fertilizer`, recommendations.fertilizer)}
              </p>
              <p>
                <strong>💧 {t("water")}:</strong>{" "}
                {t(`disease_recommendations.${detectedDisease}.water`, recommendations.water)}
              </p>
              <p>
                <strong>🪴 {t("soil")}:</strong>{" "}
                {t(`disease_recommendations.${detectedDisease}.soil`, recommendations.soil)}
              </p>
            </>
          ) : (
            <>
              <h4 className="text-primary">🧪 {t("recommendations.soil")}: {t(`soilTypes.${selectedSoil}`, selectedSoil)}</h4>
              <h4 className="text-success">📍 {t("smartRecommendations.location")}: {t(`locations.${selectedLocation}`, selectedLocation)}</h4>
              <p>
                <strong>🌾 {t("smartRecommendations.recommendedCrops")}:</strong>{" "}
                {recommendations.crops.map(crop => t(`crops.${crop}`, crop)).join(", ")}
              </p>
            </>
          )}
        </Card>
      )}
    </Container>
  );
};

export default SmartRecommendations;
