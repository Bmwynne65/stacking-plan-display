import "./App.css";
import { React, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/pages/Home";
import Map from "./components/pages/Map";
// import GetData from "./components/pages/GetData";
import Manager from "./components/pages/Manager";
import Update from "./components/Update";
import Add from "./components/Add";
import ScrollToTop from "./components/ScrollToTop";
import SignIn from "./components/SignIn";
import SignUp from "./components/Signup";


function App() {
  const [Form, setForm] = useState("login");

  return (
    <>
      {/* {Form === "login" ? (
        <SignIn FormHandle={setForm} />
      ) : (
        <SignUp FormHandle={setForm} />
      )} */}
      <Router basename="/stacking-plan-display">
        <ScrollToTop />
        <Routes>
          <Route path="/sign-in" exact element={<SignIn />} />
          <Route path="/" exact element={<Home />} />
          <Route path="/map" exact element={<Map />} />
          {/* <Route path="/getdata" exact element={<GetData />} /> */}
          <Route path="/manager" exact element={<Manager />} />
          <Route path="/update/:id" exact element={<Update />} />
          <Route path="/add" exact element={<Add />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
