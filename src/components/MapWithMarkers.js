import React, { useState, useEffect, useRef } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  useJsApiLoader,
} from "@react-google-maps/api";
import axios from "axios";
import "./MapWithMarkers.css";

const containerStyle = {
  width: "100%",
  height: "90vh",
};

const MapWithMarkers = () => {
  const [locations, setLocations] = useState([]);
  const [activeMarker, setActiveMarker] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapCenter, setMapCenter] = useState({
    lat: 39.594651,
    lng: -104.882647,
  }); // Initial center state
  const mapRef = useRef(null); // Reference to the map instance
  const infoWindowRef = useRef(null); // Reference to the InfoWindow
  const ignoreNextClick = useRef(false); // Flag to ignore click after opening InfoWindow
  const geocoderRef = useRef(null); // Reference to the Geocoder

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    // googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    googleMapsApiKey: "AIzaSyCqfZOM1Hw_lbYjY3VIbFpEAK2FK6SYK60",
  });

  useEffect(() => {
    if (isLoaded) {
      geocoderRef.current = new window.google.maps.Geocoder(); // Initialize Geocoder when the API is loaded
    }
  }, [isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      // Fetch data from the backend
      axios
        .get("http://localhost:5000/api/items")
        .then((response) => {
          const fetchLocations = async () => {
            const geocodedLocations = await Promise.all(
              response.data.map(async (item) => {
                const geocode = await geocodeAddress(item.address);
                return {
                  ...item,
                  position: geocode,
                };
              })
            );
            setLocations(geocodedLocations);
          };

          fetchLocations();
        })
        .catch((error) => {
          console.error("There was an error fetching the data!", error);
        });
    }
  }, [isLoaded]);

  const geocodeAddress = (address) => {
    return new Promise((resolve, reject) => {
      if (geocoderRef.current) {
        geocoderRef.current.geocode({ address: address }, (results, status) => {
          if (status === "OK") {
            resolve(results[0].geometry.location);
          } else {
            console.error(
              "Geocode was not successful for the following reason: " + status
            );
            reject(null);
          }
        });
      } else {
        reject("Geocoder not initialized");
      }
    });
  };

  const handleMarkerClick = (index) => {
    setActiveMarker(index);
    ignoreNextClick.current = true;
  };

  const handleMapLoad = (map) => {
    mapRef.current = map;
    setMapLoaded(true);
  };

  const handleDragEnd = () => {
    if (mapRef.current) {
      const newCenter = mapRef.current.getCenter();
      setMapCenter({
        lat: newCenter.lat(),
        lng: newCenter.lng(),
      });
    }
  };

  const handleMapClick = () => {
    // Close the InfoWindow when clicking on the map
    setActiveMarker(null);
  };

  // Handle double-click to navigate to the building link
  const handleDoubleClick = (link) => {
    window.open(link, "_blank"); // Open in a new tab
  };

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={mapCenter} // Use the dynamic mapCenter state
      zoom={13}
      onLoad={handleMapLoad}
      onClick={handleMapClick} // Handle map click to close InfoWindow
      onDragEnd={handleDragEnd} // Update center on map drag end
    >
      {locations.map(
        (location, index) =>
          location.position && (
            <Marker
              key={index}
              position={location.position}
              title={location.address}
              onClick={() => handleMarkerClick(index)} // Set active marker
            >
              {activeMarker === index && (
                <InfoWindow
                  options={{ disableAutoPan: true }}
                  onCloseClick={() => setActiveMarker(null)} // Close InfoWindow
                >
                  <section className="articles">
                    <article className="art">
                      <div className="article-wrapper">
                        <figure className="fig">
                          <img
                            src={location.imageBlob}
                            alt={"Picture of " + location.address}
                          />
                        </figure>
                        <div className="article-body">
                          <h2>{location.address}</h2>
                          <p>
                            <strong>Year of Construction:</strong>{" "}
                            {location.yoc ? location.yoc : "N/A"}
                          </p>
                          <p>
                            <strong>Current Owner:</strong>{" "}
                            {location.currentOwner
                              ? location.currentOwner
                              : "N/A"}
                          </p>
                          <p>
                            <strong>Previous Owner:</strong>{" "}
                            {location.previousOwner
                              ? location.previousOwner
                              : "N/A"}
                          </p>
                          <p>
                            <strong>Lease Rate:</strong>{" "}
                            {location.leaseRate ? location.leaseRate : "N/A"}
                          </p>
                          <p>
                            <strong>Vacancy Rate:</strong>{" "}
                            {location.vacancyRate
                              ? location.vacancyRate + "%"
                              : "N/A"}
                          </p>
                          <p>
                            <strong>Last Sold For:</strong>
                            {location.lsf
                              ? " $" + location.lsf + " - " + location.on
                              : " N/A"}
                          </p>
                          <a
                            href="#"
                            className="read-more"
                            onDoubleClick={() =>
                              handleDoubleClick(location.link)
                            }
                          >
                            Read more{" "}
                            <span className="sr-only">{location.address}</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="icon"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </article>
                  </section>
                </InfoWindow>
              )}
            </Marker>
          )
      )}
    </GoogleMap>
  ) : (
    <></>
  );
};

export default MapWithMarkers;
