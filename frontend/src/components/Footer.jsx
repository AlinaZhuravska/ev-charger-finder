// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FiMapPin } from "react-icons/fi"; // Stylish location icon

const Footer = () => {
  return (
    <footer className="bg-black text-white text-sm px-6 py-6">
      <div className="max-w-7xl mx-auto flex justify-center items-center flex-wrap gap-4 text-center border-t border-gray-700 pt-4">
        {/* Clickable location icon and country name */}
        <Link
          to="/map"
          className="flex items-center gap-1 text-gray-400 hover:text-yellow-500 transition"
        >
          <FiMapPin className="text-base align-middle" />
          <span>Switzerland</span>
        </Link>

        {/* Clickable branding leading to Home */}
        <Link
          to="/"
          className="text-gray-400 hover:text-yellow-500 transition"
        >
          © 2025 EV Finder
        </Link>

        {/* Navigation links */}
        <Link to="/contact" className="hover:text-yellow-500 text-gray-400 transition">Contact</Link>
        <Link to="/privacy" className="hover:text-yellow-500 text-gray-400 transition">Privacy</Link>
        <Link to="/about" className="hover:text-yellow-500 text-gray-400 transition">About</Link>
      </div>
    </footer>
  );
};

export default Footer;
