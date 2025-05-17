// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./components/HomePage";
import MapPage from "./components/MapPage";
import StationPlanningPage from "./components/StationPlanningPage";
import AboutPage from "./components/AboutPage";
import ContactPage from "./components/ContactPage";  // Импортируем ContactPage
import LoginPage from "./components/LoginPage";
import PrivacyPage from "./components/PrivacyPage";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/stations" element={<StationPlanningPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />  {/* Добавляем маршрут для ContactPage */}
          <Route path="/login" element={<LoginPage />} />  {/* Добавляем маршрут для LoginPage */}
          <Route path="/privacy" element={<PrivacyPage />} />  {/* Добавляем маршрут для PrivacyPage */}
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;






