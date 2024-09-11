import React, { useEffect, useState } from "react";
import "./Add.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "./Navbar";

function Add() {
  const [values, setValues] = useState({
    address: "",
    yoc: "",
    currentOwner: "",
    previousOwner: "",
    leaseRate: "",
    vacancyRate: "",
  });

  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5000/api/items/add", values)
      .then((res) => {
        console.log("Building added successful:", res.data);
        navigate("/manager");
      })
      .catch((error) => {
        console.error("There was an error adding the data!", error);
      });
  };
  return (
    <>
      <NavBar />
      <div className="container2">
        <h2 className="header">Add</h2>
        <div>
          <form className="form" onSubmit={handleSubmit}>
            <div className="form-div">
              <label className="label">Address:</label>
              <input
                className="input"
                type="text"
                name="address"
                placeholder="Enter Address"
                onChange={(e) =>
                  setValues({ ...values, address: e.target.value })
                }
              />
            </div>
            <div className="form-div">
              <label className="label">YOC:</label>
              <input
                className="input"
                type="text"
                name="yoc"
                placeholder="Enter Year of Completion"
                onChange={(e) => setValues({ ...values, yoc: e.target.value })}
              />
            </div>
            <div className="form-div">
              <label className="label">Current Owner:</label>
              <input
                className="input"
                type="text"
                name="current"
                placeholder="Enter Current Owner"
                onChange={(e) =>
                  setValues({ ...values, currentOwner: e.target.value })
                }
              />
            </div>
            <div className="form-div">
              <label className="label">Previous Owner:</label>
              <input
                className="input"
                type="text"
                name="previous"
                placeholder="Enter Previous Owner"
                onChange={(e) =>
                  setValues({ ...values, previousOwner: e.target.value })
                }
              />
            </div>
            <div className="form-div">
              <label className="label">Lease Rate:</label>
              <input
                className="input"
                type="text"
                name="lease"
                placeholder="Enter Lease Rate"
                onChange={(e) =>
                  setValues({ ...values, leaseRate: e.target.value })
                }
              />
            </div>
            <div className="form-div">
              <label className="label">Vacancy Rate:</label>
              <input
                className="input"
                type="text"
                name="vacancy"
                placeholder="Enter Vacancy Rate"
                onChange={(e) =>
                  setValues({ ...values, vacancyRate: e.target.value })
                }
              />
            </div>
            <div className="form-div">
              <label className="label">Last Sold For:</label>
              <input
                className="input"
                type="text"
                name="lsf"
                placeholder="Enter Last Sold For"
                onChange={(e) => setValues({ ...values, lsf: e.target.value })}
              />
            </div>
            <div className="form-div">
              <label className="label">On:</label>
              <input
                className="input"
                type="text"
                name="on"
                placeholder="Enter Date Purchased"
                onChange={(e) => setValues({ ...values, on: e.target.value })}
              />
            </div>
            <button className="btn2-add">Add</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Add;
