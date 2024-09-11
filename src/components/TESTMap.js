import React from "react";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";

function BuildingMap() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "process.env.REACT_APP_GOOGLE_MAPS_API_KEY",
  });

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);
  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";

  return (
    <GoogleMap
      defaultZoom={13}
      defaultCenter={{ lat: 39.594651, lng: -104.882647 }}
      onLoad={onMapLoad}
    />
  );
}

export default BuildingMap;
