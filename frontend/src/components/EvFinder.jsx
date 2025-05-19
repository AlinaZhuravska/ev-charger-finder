// src/components/EvFinder.jsx

import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Custom icon
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function EvFinder() {
  const [query, setQuery] = useState("");
  const [stations, setStations] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [center, setCenter] = useState([46.8182, 8.2275]); // Default: Switzerland center
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");

  const applyFilter = (stations, selectedFilter) => {
    if (selectedFilter === "free") {
      return stations.filter((s) => s.UsageType?.IsFree === true);
    } else if (selectedFilter === "ac") {
      return stations.filter((s) =>
        s.Connections?.some((c) => c.CurrentType?.Title?.includes("AC"))
      );
    } else if (selectedFilter === "dc") {
      return stations.filter((s) =>
        s.Connections?.some((c) => c.CurrentType?.Title?.includes("DC"))
      );
    }
    return stations;
  };

  const handleSearch = async () => {
    setError("");
    setStations([]);
    setFilteredStations([]);
    if (!query || query.trim().length < 2) {
      setError("Please enter a more specific address.");
      return;
    }

    setLoading(true);

    try {
      const geoUrl = `/geocode?address=${encodeURIComponent(
        query
      )}`;
      const response = await fetch(geoUrl);
      const data = await response.json();

      if (!data.length) {
        setError("Address not found or not within Switzerland.");
        setLoading(false);
        return;
      }

      const result = data[0];
      const lat = parseFloat(result.lat);
      const lon = parseFloat(result.lon);
      const address = result.display_name;
      const type = result.type;

      setCenter([lat, lon]);

      if (address.includes("Switzerland") && type === "country") {
        setError("Please enter a city or specific address in Switzerland.");
        setLoading(false);
        return;
      }

      if (["city", "town", "village"].includes(type)) {
        await fetchStations(lat, lon, 1);
      } else if (address.match(/\d{4}/) && !address.match(/\s\d+/)) {
        setError("Please enter the street name along with the postal code.");
        setLoading(false);
        return;
      } else {
        await fetchStations(lat, lon, 2);
      }
    } catch (err) {
      console.error(err);
      setError("Address search failed. Try again.");
      setLoading(false);
    }
  };

  const fetchStations = async (lat, lon, radius) => {
    const API_KEY = "2a87c0ca-2e58-4fe3-886b-558b4826f7cd";
    const url = `https://api.openchargemap.io/v3/poi/?output=json&latitude=${lat}&longitude=${lon}&distance=${radius}&distanceunit=KM&countrycode=CH&maxresults=20&key=${API_KEY}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      setStations(data);
      setFilteredStations(applyFilter(data, filter));
    } catch (err) {
      setError("Failed to fetch charging stations.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (value) => {
    setFilter(value);
    setFilteredStations(applyFilter(stations, value));
  };

  return (
    <section className="w-full max-w-7xl mx-auto mt-24 px-4">
      {/* Search */}
      <div className="flex items-center gap-2 mb-6">
        <input
          type="text"
          placeholder="Search by address or city in Switzerland"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow p-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-yellow-400 outline-none"
        />
        <button
          onClick={handleSearch}
          className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-3 rounded-xl shadow-md"
        >
          <FaSearch />
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Filters */}
      {stations.length > 0 && (
        <div className="flex gap-4 mb-4 text-sm font-medium">
          <button
            onClick={() => handleFilterChange("all")}
            className={`px-3 py-2 rounded-full ${
              filter === "all" ? "bg-yellow-500 text-white" : "bg-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleFilterChange("free")}
            className={`px-3 py-2 rounded-full ${
              filter === "free" ? "bg-yellow-500 text-white" : "bg-gray-200"
            }`}
          >
            Free
          </button>
          <button
            onClick={() => handleFilterChange("ac")}
            className={`px-3 py-2 rounded-full ${
              filter === "ac" ? "bg-yellow-500 text-white" : "bg-gray-200"
            }`}
          >
            AC
          </button>
          <button
            onClick={() => handleFilterChange("dc")}
            className={`px-3 py-2 rounded-full ${
              filter === "dc" ? "bg-yellow-500 text-white" : "bg-gray-200"
            }`}
          >
            DC
          </button>
        </div>
      )}

      {/* Station Cards */}
      {filteredStations.length > 0 && (
        <div className="overflow-x-auto mt-4">
          <div className="flex gap-4 pb-4">
            {filteredStations.map((station, idx) => {
              const info = station.AddressInfo;
              const connection = station.Connections[0];
              const addressParts = [info.AddressLine1, info.Town, info.Postcode];
              const fullAddress = addressParts.filter(Boolean).join(", ");

              return (
                <div
                  key={idx}
                  className="min-w-[250px] bg-white rounded-2xl shadow-md p-4 flex-shrink-0"
                >
                  <h3 className="font-semibold text-lg text-gray-800">
                    {info.Title}
                  </h3>
                  <p className="text-sm text-gray-600">{fullAddress}
                  </p>
                  <p className="text-sm mt-2">
                    <strong>Type:</strong>{" "}
                    {connection
                      ? connection.ConnectionType?.Title
                      : "Not specified"}
                  </p>
                  <p className="text-sm">
                    <strong>Cost:</strong>{" "}
                    {station.UsageCost
                        ? station.UsageCost.toLowerCase().includes("free")
                        ? "Free"
                        : station.UsageCost.toLowerCase().includes("jaarabonnement")
                            ? "Membership Required"
                            : station.UsageCost
                        : station.UsageType?.IsFree === true
                        ? "Free"
                        : "Paid"}
                    </p>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Map */}
      {/* <div className="mt-8 rounded-2xl overflow-hidden shadow-lg">
        <MapContainer
          center={center}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: "400px", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {filteredStations.map((station, index) => (
            <Marker
              key={index}
              position={[
                station.AddressInfo.Latitude,
                station.AddressInfo.Longitude,
              ]}
              icon={customIcon}
            >
              <Popup>
                <strong>{station.AddressInfo.Title}</strong>
                <br />
                {station.AddressInfo.AddressLine1}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div> */}
    </section>
  );
}

export default EvFinder;
