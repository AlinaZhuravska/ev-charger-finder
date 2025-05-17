// src/components/MapComponent.jsx

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom icon for markers
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapComponent() {
  const [stations, setStations] = useState([]);

  const fetchStations = (offset = 0) => {
    // Fetch stations with pagination
    fetch(`https://api.openchargemap.io/v3/poi/?output=json&countrycode=CH&maxresults=100&offset=${offset}&key=2a87c0ca-2e58-4fe3-886b-558b4826f7cd`)
      .then(response => response.json())
      .then(data => {
        // Append new stations to existing list
        setStations(prevStations => [...prevStations, ...data]);

        // If we received 100 results, there may be more — fetch next page
        if (data.length === 100) {
          fetchStations(offset + 100);
        }
      })
      .catch(error => console.error("Error fetching charging stations:", error));
  };

  useEffect(() => {
    fetchStations(); // Initial fetch
  }, []);

  return (
    <MapContainer
      center={[46.8182, 8.2275]} // Center of Switzerland
      zoom={7}
      scrollWheelZoom={true}
      style={{ height: '600px', width: '100%', borderRadius: '20px' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {/* Render station markers */}
      {stations.map((station, index) => {
        const coords = station.AddressInfo;
        return (
          <Marker
            key={index}
            position={[coords.Latitude, coords.Longitude]}
            icon={customIcon}
          >
            <Popup>
              <strong>{coords.Title}</strong><br />
              {coords.AddressLine1}<br />
              {coords.Town}, {coords.Postcode}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

export default MapComponent;
