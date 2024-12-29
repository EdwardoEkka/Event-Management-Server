const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors"); // Import the cors package
const userRoutes = require("./src/routes/userRoutes")
const eventRoutes= require("./src/routes/eventRoutes")
const requestRoutes= require("./src/routes/requestRoutes")

dotenv.config();

const app = express();

// Apply CORS middleware
app.use(cors());

// Body parser middleware
app.use(bodyParser.json());


app.use("/user", userRoutes);
app.use("/events", eventRoutes);
app.use("/requests",requestRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
