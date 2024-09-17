import React, { useEffect, useState } from "react";
import "./Update.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "./Navbar";

function Update() {
  const { id } = useParams();
  const [values, setValues] = useState({
    id: id,
    address: "",
    yoc: "",
    currentOwner: "",
    previousOwner: "",
    leaseRate: "",
    vacancyRate: "",
    lsf: "",
    on: "",
  });

  const [imageBuffer, setImageBuffer] = useState(null); // To store the binary of the uploaded image
  const [imagePreview, setImagePreview] = useState(""); // To preview the uploaded image

  useEffect(() => {
    // Fetch data from the API on component mount
    axios
      .get("http://localhost:5000/api/items/" + id)
      .then((res) => {
        setValues({
          ...values,
          address: res.data[0].address,
          subMarket: res.data[0].subMarket,
          yoc: res.data[0].yoc,
          currentOwner: res.data[0].currentOwner,
          previousOwner: res.data[0].previousOwner,
          leaseRate: res.data[0].leaseRate,
          vacancyRate: res.data[0].vacancyRate,
          lsf: res.data[0].lsf,
          on: res.data[0].on,
          link: res.data[0].link,
          img: res.data[0].imageBlob, // Assuming imageBlob is the base64 string
        });
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);

  // console.log("img:", values.img); // Debugging line to check values
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare the data object
    const data = {
      ...values,
      img: imageBuffer ? Array.from(imageBuffer) : null, // Ensure we send the binary image as an array
    };

    axios
      .put("http://localhost:5000/api/items/" + id, data)
      .then((res) => {
        console.log("Update successful:", res.data);
        navigate("/manager");
      })
      .catch((error) => {
        console.error("There was an error updating the data!", error);
      });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const arrayBuffer = reader.result; // This is an ArrayBuffer
        const buffer = new Uint8Array(arrayBuffer); // Convert ArrayBuffer to Uint8Array
        setImageBuffer(buffer); // Set image buffer for binary storage

        // Optionally, you can display a preview
        const blob = new Blob([buffer], { type: file.type });
        const previewUrl = URL.createObjectURL(blob);
        setImagePreview(previewUrl);
      };
      reader.readAsArrayBuffer(file); // Read the file as an ArrayBuffer
    } else {
      alert("Please upload a valid image file.");
    }
  };
  return (
    <div>
      <Navbar />
      <div className="container2">
        <h2 className="header">Update</h2>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-div">
            <label className="label">Address:</label>
            <input
              className="input"
              type="text"
              name="address"
              placeholder="Enter Address"
              value={values.address}
              onChange={(e) =>
                setValues({ ...values, address: e.target.value })
              }
            />
          </div>
          <div className="form-div">
            <label className="label">Sub Market:</label>
            <input
              className="input"
              type="text"
              name="subMarket"
              placeholder="Enter Sub Market"
              value={values.subMarket}
              onChange={(e) =>
                setValues({ ...values, subMarket: e.target.value })
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
              value={values.yoc}
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
              value={values.currentOwner}
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
              value={values.previousOwner}
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
              value={values.leaseRate}
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
              value={values.vacancyRate}
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
              placeholder="Enter Last Sold For Price"
              value={values.lsf}
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
              value={values.on}
              onChange={(e) => setValues({ ...values, on: e.target.value })}
            />
          </div>
          <div className="form-div">
            <label className="label">link:</label>
            <input
              className="input"
              type="text"
              name="link"
              placeholder="Enter Date Purchased"
              value={values.link}
              onChange={(e) => setValues({ ...values, link: e.target.value })}
            />
          </div>
          {/* Display the current image if it exists */}
          <div className="form-div">
            <label className="label">Current Image:</label>
            {values.img ? (
              <figure className="fig">
                <img
                  src={values.img} // Reference the imageBlob containing base64 string
                  alt={"Picture of " + values.address}
                  style={{ width: "200px", height: "auto" }} // Optional styling for image size
                />
              </figure>
            ) : (
              <p>No image available</p>
            )}
          </div>

          {/* Image uploader */}
          <div className="form-div">
            <label className="label">Upload New Image:</label>
            <input
              className="input"
              type="file"
              accept="image/*"
              name="image"
              onChange={handleImageChange}
            />
          </div>

          {/* Preview of the uploaded image */}
          {imagePreview && (
            <div className="form-div">
              <label className="label">Image Preview:</label>
              <img
                src={imagePreview}
                alt="Preview"
                style={{ width: "200px", height: "auto" }}
              />
            </div>
          )}

          <button className="btn2">Update</button>
        </form>
      </div>
    </div>
  );
}

export default Update;
