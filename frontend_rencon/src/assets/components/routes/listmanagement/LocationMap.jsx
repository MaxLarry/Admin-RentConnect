import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { FaMapMarkerAlt } from 'react-icons/fa';
import locationPin from "../../../img/location-pin.png"

// Use a URL or path to an image for the marker icon
const customIcon = new L.Icon({
    iconUrl: locationPin,
    iconSize: [50, 50],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
  

const MapComponent = ({ location }) => {
  // Destructure coordinates from the location object
  const [longitude, latitude] = location.coordinates;

  return (
    <div style={{ height: '500px', width: '80%' }}>
      <MapContainer center={[latitude, longitude]} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[latitude, longitude]} icon={customIcon}>
          <Popup>
            <FaMapMarkerAlt /> Location
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapComponent;
