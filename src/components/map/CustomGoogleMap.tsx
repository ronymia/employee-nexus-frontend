"use client";

import { Map, AdvancedMarker, useMap } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";

interface ICustomGoogleMapProps {
  location?: { lat: number; lng: number } | null;
  className?: string;
  height?: string;
  defaultZoom?: number;
  radius?: number; // Radius in meters for geofencing circle
  onLocationChange?: (lat: number, lng: number) => void; // Callback when marker is dragged
}

export default function CustomGoogleMap({
  location,
  className = "",
  height = "300px",
  defaultZoom = 13,
  radius,
  onLocationChange,
}: ICustomGoogleMapProps) {
  // Default center (Dhaka, Bangladesh)
  const defaultCenter = { lat: 23.8103, lng: 90.4125 };

  const handleMarkerDragEnd = (e: google.maps.MapMouseEvent) => {
    if (e.latLng && onLocationChange) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      onLocationChange(lat, lng);
    }
  };

  return (
    <div
      className={`w-full rounded-xl overflow-hidden border border-base-content/10 shadow-sm ${className}`}
      style={{ height }}
    >
      <Map
        defaultCenter={defaultCenter}
        defaultZoom={location ? 17 : defaultZoom}
        gestureHandling="auto"
        disableDefaultUI={false}
        mapTypeControl={false}
        streetViewControl={false}
        fullscreenControl={false}
        zoomControl={true}
        draggable={true}
        clickableIcons={true}
        mapId="DEMO_MAP_ID"
      >
        {location && (
          <AdvancedMarker
            position={location}
            draggable={true}
            onDragEnd={handleMarkerDragEnd}
          />
        )}
        <MapCircle location={location} radius={radius} />
      </Map>
    </div>
  );
}

// Separate component to use useMap hook
function MapCircle({
  location,
  radius,
}: {
  location?: { lat: number; lng: number } | null;
  radius?: number;
}) {
  const map = useMap();
  const [circle, setCircle] = useState<google.maps.Circle | null>(null);

  // Update circle when location or radius changes
  useEffect(() => {
    if (!map) return;

    // Remove existing circle
    if (circle) {
      circle.setMap(null);
    }

    // Add new circle if location and radius exist
    if (location && radius && radius > 0) {
      const newCircle = new google.maps.Circle({
        strokeColor: "#4F46E5",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#4F46E5",
        fillOpacity: 0.15,
        map,
        center: location,
        radius: radius,
      });

      setCircle(newCircle);

      // Fit bounds to show entire circle
      const bounds = newCircle.getBounds();
      if (bounds) {
        map.fitBounds(bounds);
      }
    } else {
      setCircle(null);
    }

    return () => {
      if (circle) {
        circle.setMap(null);
      }
    };
  }, [map, location, radius]);

  return null;
}
