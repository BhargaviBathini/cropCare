import React from "react";
import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./Header.css";

const Header = () => {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" fixed="top" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          🌱 {t("header.cropCare")}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/crop-health">{t("header.cropHealth")}</Nav.Link>
            <Nav.Link as={Link} to="/crop-recommendation">{t("header.cropRecommendation")}</Nav.Link>
            <Nav.Link as={Link} to="/smart-recommendations">{t("header.smartRecommendations")}</Nav.Link>
            <Nav.Link as={Link} to="/weather">{t("header.weather")}</Nav.Link>
            <Nav.Link as={Link} to="/yield">{t("header.yieldPrediction")}</Nav.Link> 
          </Nav>

          {/* Language Dropdown */}
          <Dropdown>
            <Dropdown.Toggle variant="success">
              {t(`languages.${i18n.language}`) || t("languages.en")}
            </Dropdown.Toggle>
            <Dropdown.Menu align="end">
              <Dropdown.Item onClick={() => handleLanguageChange("en")}>{t("languages.en")}</Dropdown.Item>
              <Dropdown.Item onClick={() => handleLanguageChange("hi")}>{t("languages.hi")}</Dropdown.Item>
              <Dropdown.Item onClick={() => handleLanguageChange("te")}>{t("languages.te")}</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
