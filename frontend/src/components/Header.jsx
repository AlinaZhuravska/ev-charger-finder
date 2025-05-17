// src/components/Header.jsx

import React from "react";
import { Link } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";
import logo from "../assets/logo.png";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto flex items-center px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="h-8 w-auto" />
          <span className="font-bold text-gray-800 text-lg">EV Finder</span>
        </Link>

        {/* Navigation - pushed to right */}
        <nav className="ml-auto flex gap-6 text-sm font-medium text-gray-700">
          <Link to="/" className="hover:text-yellow-500">Home</Link>
          <Link to="/map" className="hover:text-yellow-500">Map</Link>
          <Link to="/stations" className="hover:text-yellow-500">Station Planning</Link>
          <Link to="/about" className="hover:text-yellow-500">About</Link>
          <Link to="/login" className="hover:text-yellow-500">Login</Link>
        </nav>

        {/* Language switcher */}
        <div className="ml-6">
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
