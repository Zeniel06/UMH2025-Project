'use client'

import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet marker icons in Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map position changes
const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

export default function MapComponent({ regions, selectedRegion, setSelectedRegion, getMarkerColor }) {
  // State to track if the map is ready (for client-side rendering)
  const [isMapReady, setIsMapReady] = useState(false);
  
  // Map center and zoom level state
  const [mapCenter, setMapCenter] = useState([4.2105, 108.9758]); // Center of Malaysia
  const [mapZoom, setMapZoom] = useState(6);
  
  // When a region is selected, center the map on it
  useEffect(() => {
    if (selectedRegion) {
      setMapCenter([selectedRegion.lat, selectedRegion.lng]);
      setMapZoom(8);
    } else {
      setMapCenter([4.2105, 108.9758]);
      setMapZoom(6);
    }
  }, [selectedRegion]);
  
  // Set map as ready after component mounts (for SSR compatibility)
  useEffect(() => {
    setIsMapReady(true);
  }, []);
  
  if (!isMapReady) {
    return <div className="w-full h-full bg-gray-100 flex items-center justify-center">Loading map...</div>;
  }
  
  return (
    <MapContainer 
      center={mapCenter}
      zoom={mapZoom}
      style={{ height: '100%', width: '100%' }}
      zoomControl={true}
      attributionControl={true}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <ChangeView center={mapCenter} zoom={mapZoom} />
      
      {regions.map((region) => (
        <CircleMarker
          key={region.id}
          center={[region.lat, region.lng]}
          radius={selectedRegion && selectedRegion.id === region.id ? 20 : 15}
          pathOptions={{
            fillColor: getMarkerColor(region.needIndex),
            color: getMarkerColor(region.needIndex),
            fillOpacity: 0.7,
            weight: selectedRegion && selectedRegion.id === region.id ? 3 : 1,
          }}
          eventHandlers={{
            click: () => setSelectedRegion(region),
          }}
        >
          <Tooltip direction="top" offset={[0, -10]} opacity={1}>
            <div>
              <strong>{region.name}</strong>
              <div>Need Index: {region.needIndex}</div>
              <div>Cases: {region.cases}</div>
            </div>
          </Tooltip>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}