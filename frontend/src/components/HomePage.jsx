import React from "react";
import Footer from "../components/Footer";
import EvFinder from "../components/EvFinder"; 

function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col">
      {/* Background wrapper */}
      <div className="absolute inset-0 -z-10">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/bg-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Content */}
      <div className="flex-grow flex flex-col items-center justify-center text-center py-20 px-6 relative z-10">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4 drop-shadow-lg">
          Welcome to EV Finder
        </h1>
        <p className="text-gray-800 text-lg max-w-xl drop-shadow-md mb-1">
          EV Finder helps electric vehicle owners easily locate charging stations based on their preferences and location, making the transition to electric mobility seamless and accessible.
        </p>
        <div className="w-full px-[2cm] max-w-screen-xl mx-auto">
          <EvFinder />
        </div>
      </div>

      {/* Footer */}
    </div>
  );
}

export default HomePage;
