import React from "react";
import "../../App.css";
import Footer from "../Footer";
import DisplayBldgInfo from "../DisplayBldgInfo";
import Navbar from "../Navbar";

function AddEditRemove() {
  return (
    <>
      <Navbar />
      <DisplayBldgInfo />
      <Footer />
    </>
  );
}

export default AddEditRemove;
