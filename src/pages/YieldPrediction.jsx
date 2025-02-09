import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { predictYield } from "../api";
import { Form, Button, Spinner, Alert, Card } from "react-bootstrap";
import "./YeildPrediction.css";

const YieldPrediction = () => {
  const { t } = useTranslation();
  
  const [rainfall, setRainfall] = useState("");
  const [temperature, setTemperature] = useState("");
  const [soilType, setSoilType] = useState("");
  const [area, setArea] = useState("");
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setPrediction(null);
    setLoading(true);

    if (!rainfall || !temperature || !soilType || !area) {
      setError(t("yield.error"));
      setLoading(false);
      return;
    }

    const result = await predictYield(rainfall, temperature, soilType, area);
    if (result.error) {
      setError(result.error);
    } else {
      setPrediction(result.predicted_yield);
    }

    setLoading(false);
  };

  return (
    <div className="yield-container">
      <Card className="yield-card">
        <h2 className="yield-title">{t("yield.title")}</h2>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>{t("yield.rainfall")}</Form.Label>
            <Form.Control
              type="number"
              placeholder={t("yield.rainfallPlaceholder")}
              value={rainfall}
              onChange={(e) => setRainfall(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>{t("yield.temperature")}</Form.Label>
            <Form.Control
              type="number"
              placeholder={t("yield.temperaturePlaceholder")}
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>{t("yield.soilType")}</Form.Label>
            <Form.Select
              value={soilType}
              onChange={(e) => setSoilType(e.target.value)}
            >
              <option value="">{t("yield.selectSoilType")}</option>
              <option value="Clay">{t("yield.soilTypes.clay")}</option>
              <option value="Sandy">{t("yield.soilTypes.sandy")}</option>
              <option value="Loamy">{t("yield.soilTypes.loamy")}</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>{t("yield.area")}</Form.Label>
            <Form.Control
              type="number"
              placeholder={t("yield.areaPlaceholder")}
              value={area}
              onChange={(e) => setArea(e.target.value)}
            />
          </Form.Group>

          <Button className="predict-btn" type="submit" disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : t("yield.predictButton")}
          </Button>
        </Form>

        {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
        {prediction && <Alert variant="success" className="mt-3">{t("yield.predictionResult", { prediction })}</Alert>}
      </Card>
    </div>
  );
};

export default YieldPrediction;
