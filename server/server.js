const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

// Increase the payload size limit
app.use(bodyParser.json({ limit: "50mb" })); // For JSON bodies
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true })); // For URL-encoded bodies

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

// Create a MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER, // Replace with your MySQL username
  password: process.env.DB_PASS, // Replace with your MySQL password
  database: process.env.DB_NAME, // Replace with your database name
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("Could not connect to MySQL:", err);
  } else {
    console.log("Connected to MySQL");
  }
});

// Helper function to check if an address already exists in the database
const addressExists = (address, callback) => {
  const query = "SELECT COUNT(*) AS count FROM buildingInfo WHERE address = ?";
  db.query(query, [address], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    const count = results[0].count;
    callback(null, count > 0);
  });
};

// Delete item
app.delete("/api/items/delete/:id", (req, res) => {
  const id = req.params.id;
  const query = "DELETE FROM buildingInfo WHERE buildingID = ?"; // Correct SQL query

  db.query(query, [id], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error deleting the building");
    } else {
      console.log(results);
      res.status(200).send("Building deleted successfully");
    }
  });
});

// Route to get all items
app.get("/api/items", (req, res) => {
  const query = "SELECT * FROM buildingInfo";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err });
    }

    // Convert buffer to Base64
    const items = results.map((item) => {
      if (item.img) {
        const base64Image = Buffer.from(item.img).toString("base64");
        return {
          ...item,
          imageBlob: `data:image/jpeg;base64,${base64Image}`, // Create Base64 string
        };
      }
      return item;
    });

    res.json(items);
  });
});

// Route to get specific item
app.get("/api/items/:id", (req, res) => {
  const id = req.params.id;
  const query = "SELECT * FROM buildingInfo WHERE buildingID = ?"; // Replace with your table name
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Convert the buffer (binary data) to Base64
    const items = results.map((item) => {
      if (item.img) {
        // Convert the buffer into a base64-encoded string
        const base64Image = Buffer.from(item.img).toString("base64");
        return {
          ...item,
          imageBlob: `data:image/jpeg;base64,${base64Image}`, // Base64 string with MIME type
        };
      }
      return item;
    });

    // Send the modified result with the imageBlob field to the client
    res.json(items);
  });
});

// Route to update specific item
app.put("/api/items/:id", (req, res) => {
  const id = req.params.id;
  const values = req.body;
  let imageBuffer = null;

  if (values.img) {
    try {
      // Convert the image data (which should be an array) back to a buffer
      imageBuffer = Buffer.from(values.img); // Ensure `values.img` is an array of bytes (like Uint8Array)
      console.log("Received image buffer:", imageBuffer);
    } catch (error) {
      console.error("Failed to process image buffer:", error);
      return res.status(400).json({ error: "Invalid image data" });
    }
  }

  // Ensure proper SQL query with placeholders
  const query =
    "UPDATE buildingInfo SET address = ?, subMarket = ?, yoc = ?, currentOwner = ?, previousOwner = ?, leaseRate = ?, vacancyRate = ?, lsf = ?, `on` = ?, link = ?, img = ? WHERE buildingID = ?";
  const data = [
    values.address,
    values.subMarket,
    values.yoc,
    values.currentOwner,
    values.previousOwner,
    values.leaseRate,
    values.vacancyRate,
    values.lsf,
    values.on,
    values.link,
    imageBuffer, // This is the binary data for the image
    id,
  ];

  console.log("Received data:", data);

  db.query(query, data, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    console.log(results);
    res.json({ message: "Item updated successfully" });
  });
});

//Route to insert item
app.post("/api/items/add", (req, res) => {
  console.log("Data Entered Post Request");
  const values = req.body;
  console.log("Received data:", values);
  const address = values.address;

  let imageBuffer = null;

  if (values.img) {
    try {
      // Convert the image data (which should be an array) back to a buffer
      imageBuffer = Buffer.from(values.img); // Ensure `values.img` is an array of bytes (like Uint8Array)
      console.log("Received image buffer:", imageBuffer);
    } catch (error) {
      console.error("Failed to process image buffer:", error);
      return res.status(400).json({ error: "Invalid image data" });
    }
  }

  // First query to check if the address already exists
  const checkAddressQuery = "SELECT * FROM buildingInfo WHERE address = ?";
  db.query(checkAddressQuery, [address], (err, results) => {
    if (err) {
      console.error("Error checking address:", err);
      return res.status(500).json({ error: err.message });
    }

    // If the address already exists, return a message
    if (results.length > 0) {
      console.log("Address already exists:", address);
      return res.status(400).json({ message: "Address already exists" });
    }

    // If the address doesn't exist, proceed with the insert query
    const insertQuery = `
      INSERT INTO buildingInfo (address, subMarket, yoc, currentOwner, previousOwner, leaseRate, vacancyRate, lsf, \`on\`, link, img)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const data = [
      values.address,
      values.subMarket,
      values.yoc === "" ? null : values.yoc,
      values.currentOwner,
      values.previousOwner,
      values.leaseRate === "" ? null : values.leaseRate,
      values.vacancyRate === "" ? null : values.vacancyRate, // Handle empty vacancyRate as null
      values.lsf,
      values.on,
      values.link,
      imageBuffer,
    ];

    db.query(insertQuery, data, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).json({ error: err.message });
      }
      console.log("Query successful:", results);
      res.json({ message: "Item added successfully" });
    });
  });
});

// API endpoint to handle data submission
app.post("/submit-property", (req, res) => {
  const {
    address,
    subMarket,
    yoc,
    currentOwner,
    previousOwner,
    leaseRate,
    vacancyRate,
    lsf,
    on,
    link,
    img,
  } = req.body;

  console.log("Received request body:", req.body); // Log the request body for debugging

  // Check if address already exists
  addressExists(address, (err, exists) => {
    if (err) {
      console.error("Error checking if address exists:", err); // Log the error
      return res.status(500).json({ message: "Database error", error: err });
    }

    if (exists) {
      return res.status(400).json({ message: "Address already exists" });
    }

    // Insert the new property data into the database
    const query = `
      INSERT INTO buildingInfo (address, subMarket, yoc, currentOwner, previousOwner, leaseRate, vacancyRate, lsf, \`on\`, link, img)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(
      query,
      [
        address,
        subMarket,
        yoc,
        currentOwner,
        previousOwner,
        leaseRate,
        vacancyRate,
        lsf,
        on,
        link,
        img,
      ],
      (err, results) => {
        if (err) {
          console.error("Error inserting property:", err); // Log the error
          return res
            .status(500)
            .json({ message: "Database error2", error: err });
        }

        return res.status(200).json({ message: "Property saved successfully" });
      }
    );
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
