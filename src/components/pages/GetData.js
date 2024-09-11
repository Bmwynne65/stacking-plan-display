import React from "react";
import "../../App.css";
import Footer from "../Footer";
import GetData from "../GetData";
import Navbar from "../Navbar";

function Home() {
  return (
    <>
      <Navbar />
      <GetData />
      <Footer />
    </>
  );
}

export default Home;
