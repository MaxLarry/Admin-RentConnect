import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { FaMapMarkerAlt } from 'react-icons/fa';

// Use a URL or path to an image for the marker icon
const markerIcon = new L.Icon({
  iconUrl: 'https://example.com/path-to-your-marker-icon.png', // Replace with the actual path to your marker icon
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

function MapComponent() {
  const [showMap, setShowMap] = useState(false);

  return (
    <div>
      {/* Map Display */}
      {showMap && (
        <div style={{ position: 'fixed', bottom: '16px', right: '40px', borderRadius: '40px', overflow: 'hidden' }}>
          <MapContainer
            center={[9.74006635645179, 118.73764516844255]}
            zoom={15}
            style={{ width: '300px', height: '300px', borderRadius: '40px' }}
          >
            <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[9.74006635645179, 118.73764516844255]} icon={markerIcon} />
          </MapContainer>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setShowMap(!showMap)}
        style={{
          position: 'fixed',
          backgroundColor: 'white',
          borderRadius: '50%',
          width: '60px',
          height: '60px',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          display: 'relative',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <FaMapMarkerAlt size={36} color="black" />
      </button>
    </div>
  );
}

export default MapComponent;
