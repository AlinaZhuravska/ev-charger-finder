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

// Component to handle map movement and zoom changes
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

  // Get user's geolocation on initial render
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = [pos.coords.latitude, pos.coords.longitude];
          setPosition(coords);
        },
        () => {
          // Use fallback location if geolocation fails
          const fallback = [46.8182, 8.2275]; // Switzerland center
          setPosition(fallback);
        }
      );
    }
  }, []);

  // Fetch stations based on current visible map bounds
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

      // Filter out predicted (non-real) stations
      const realStations = data.filter((station) => station.is_predicted !== 1);
      setStations(realStations);
    } catch (err) {
      console.error("Failed to fetch stations:", err);
    }
  };

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

          {/* User location marker */}
          <Marker position={position}>
            <Popup>Your location</Popup>
          </Marker>

          {/* Nearby charging stations */}
          {stations.map((station, i) => (
            <Marker key={i} position={[station.lat, station.lon]}>
              <Popup>
                <strong>{station.name}</strong>
                <br />
                {station.address}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </section>
  );
}

export default MapPage;
