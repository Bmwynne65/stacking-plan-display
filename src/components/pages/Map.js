import React from "react";
import "../../App.css";
import Footer from "../Footer";
import BuildingMap from "./Map";
import MapWithMarkers from "../MapWithMarkers";
import Navbar from "../Navbar";

function Map() {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      {/* <BuildingMap /> */}
      <Navbar />
      <MapWithMarkers />
      <Footer />
    </div>
  );
}

export default Map;
