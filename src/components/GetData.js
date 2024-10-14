import React, { useEffect, useState } from "react";
import axios from "axios";

const GetData = () => {
  const [buildings, setBuildings] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_URI}/api/items`)
      .then((response) => {
        setBuildings(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);

  return (
    <div>
      <h1>Building List</h1>
      <ul>
        {buildings.map((building) => (
          <li key={building.id}>
            <h2>{building.address}</h2>
            <p>
              <strong>Year of Construction:</strong> {building.yoc}
            </p>
            <p>
              <strong>Current Owner:</strong> {building.currentOwner}
            </p>
            <p>
              <strong>Previous Owner:</strong> {building.previousOwner}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GetData;
