import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./DisplayBldgInfo.css";
import PropertyUploader from "./PropertyUploader";

const DisplayBldgInfo = () => {
  const [buildings, setBuildings] = useState([]);
  const [filteredBuildings, setFilteredBuildings] = useState([]);
  const [subMarket, setSubMarket] = useState("");
  const [search, setSearch] = useState("");

  //set markets to possible values
  let markets = ["DTC", "Cenntenial", "Greenwood", "Inverness", "Meridian"];

  // Test
  // console.log(subMarket);

  // const [filters, setFilters] = useState({
  //   subMarket: "",
  //   vacancyRate: "",
  // });

  // Fetch data from the API
  const fetchBuildings = () => {
    axios
      .get("http://localhost:5000/api/items")
      .then((response) => {
        setBuildings(response.data);
        setFilteredBuildings(response.data); // Display the data immediately
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  };

  useEffect(() => {
    fetchBuildings(); // Initial fetch when component mounts
  }, []);

  // Deletes a building
  const handleDelete = (buildingId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this building?"
    );

    if (confirmDelete) {
      axios
        .delete(`http://localhost:5000/api/items/delete/${buildingId}`)
        .then((res) => {
          console.log("Building deleted successfully:", res.data);
          // Update the state to remove the deleted building
          setBuildings((prevBuildings) =>
            prevBuildings.filter(
              (building) => building.buildingId !== buildingId
            )
          );
          console.log("Updated buildings list:", buildings); // Check if the state is correctly updated
        })
        .catch((error) => {
          console.error("There was an error deleting the building!", error);
        });
    }
  };

  // Handle double-click to navigate to the building link
  const handleDoubleClick = (link) => {
    window.open(link, "_blank"); // Open in a new tab
  };

  return (
    <div className="container">
      <h2>Manager</h2>
      <PropertyUploader refreshBuildings={fetchBuildings} />
      <div className="table">
        <div className="filter-container">
          <div className="button-nav-container">
            {/* <button className="btn-add">
            <Link className="link-dec" to={`/add`}>
              Add +
            </Link>
          </button> */}
          </div>
          <div className="search-container">
            <input
              className="search-input"
              type="text"
              placeholder="Search by address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div class="dropdown">
              <button class="dropbtn">Sub-markets</button>
              <div class="dropdown-content">
                <button
                  className="subMarket-filter-btn"
                  value="DTC"
                  onClick={(e) => setSubMarket(e.target.value)}
                >
                  {" "}
                  DTC{" "}
                </button>
                <button
                  className="subMarket-filter-btn"
                  value="Centennial"
                  onClick={(e) => setSubMarket(e.target.value)}
                >
                  {" "}
                  Centennial{" "}
                </button>
              </div>
            </div>
            <div class="cleardropdown">
              <button
                class="clearbtn"
                value=""
                onClick={() => {
                  setSubMarket("");
                  setSearch("");
                }}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Address</th>
                <th>Sub-Market</th>
                <th>YOC</th>
                <th>Current Owner</th>
                <th>Previous Owner</th>
                <th>Lease Rate</th>
                <th>Vacancy Rate</th>
                <th>Last Sold For</th>
                <th>On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {buildings
                .filter((building) => {
                  // If the search is not empty, check if the building address matches the search term
                  if (search.toLowerCase() !== "") {
                    if (
                      !building.address
                        .toLowerCase()
                        .includes(search.toLowerCase())
                    ) {
                      return false;
                    }
                  }

                  // If the subMarket is not empty, check if the building subMarket matches the subMarket filter
                  if (subMarket.toLowerCase() !== "") {
                    if (
                      !building.subMarket
                        .toLowerCase()
                        .includes(subMarket.toLowerCase())
                    ) {
                      return false;
                    }
                  }

                  // If all conditions pass, return the building
                  return true;
                })
                .map((building) => (
                  <tr
                    key={building.buildingId}
                    onDoubleClick={() => handleDoubleClick(building.link)}
                  >
                    <td
                      className="link"
                      onDoubleClick={() => handleDoubleClick(building.link)}
                    >
                      {building.address}
                    </td>
                    <td>{building.subMarket}</td>
                    <td>{building.yoc}</td>
                    <td>{building.currentOwner}</td>
                    <td>{building.previousOwner}</td>
                    <td>{building.leaseRate}</td>
                    <td>{building.vacancyRate}%</td>
                    <td>${building.lsf}</td>
                    <td>{building.on}</td>
                    <td>
                      <div className="btn-layout">
                        <button
                          className="btn-del"
                          onClick={() => handleDelete(building.buildingId)}
                        >
                          Delete
                        </button>
                        <Link
                          className="btn-upd"
                          to={`/update/${building.buildingId}`}
                        >
                          Update
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DisplayBldgInfo;
