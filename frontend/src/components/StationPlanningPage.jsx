import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const defaultIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const predictedIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png", // red
  iconSize: [35, 41],
  iconAnchor: [12, 41],
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});


// Fix default Leaflet icon paths to avoid broken images
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Component that listens to map move and zoom events
function MapEventHandler({ onBoundsChange }) {
  useMapEvents({
    moveend: (e) => {
      const bounds = e.target.getBounds();
      onBoundsChange(bounds);
    },
    zoomend: (e) => {
      const bounds = e.target.getBounds();
      onBoundsChange(bounds);
    },
  });
  return null;
}

function MapPage() {
  const [position, setPosition] = useState(null);
  const [stations, setStations] = useState([]);

  // Get the user's geolocation on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = [pos.coords.latitude, pos.coords.longitude];
          setPosition(coords);
        },
        () => {
          // Fallback to a default location (center of Switzerland) if geolocation fails
          const fallback = [46.8182, 8.2275];
          setPosition(fallback);
        }
      );
    }
  }, []);

  // Fetch charging stations based on the current map bounds
  const fetchStationsByBounds = async (bounds) => {
    const north = bounds.getNorth();
    const south = bounds.getSouth();
    const east = bounds.getEast();
    const west = bounds.getWest();

    try {
      const response = await fetch(
        `/stations-nearby?north=${north}&south=${south}&east=${east}&west=${west}`
      );
      const data = await response.json();

      console.log("Fetched stations:", data);
      setStations(data);
    } catch (err) {
      console.error("Failed to fetch stations:", err);
    }
  };
  console.log("Sample station: ", stations[0]);



  return (
    <section className="w-full h-[600px] mt-16">
      {position && (
        <MapContainer
          center={position}
          zoom={13}
          scrollWheelZoom
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CartoDB</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
  
          <MapEventHandler onBoundsChange={fetchStationsByBounds} />
  
          {/* Marker showing the user's current location */}
          <Marker position={position}>
            <Popup>Your location</Popup>
          </Marker>
  
          {/* Render charging station markers */}
          {stations.map((station) => {
            console.log(
              `Rendering ${station.name} with`,
              station.is_predicted === 1 ? "predictedIcon" : "defaultIcon"
            );

            return (
              <Marker
                key={`${station.lat}-${station.lon}-${station.name}`}
                position={[station.lat, station.lon]}
                icon={station.is_predicted === 1 ? predictedIcon : defaultIcon}
              >
                <Popup>
                  <strong>{station.name}</strong><br />
                  Population Density: {station.population_density}<br />
                  Traffic Density: {station.traffic_density}<br />
                  Existing Stations: {station.existing_stations}
                </Popup>
              </Marker>
            );
          })}

  
        </MapContainer>
      )}
    </section>
  );
  
}

export default MapPage;
