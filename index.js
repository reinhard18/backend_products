const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
// Enable CORS
app.use(cors());
// Body parser middleware
app.use(express.json());

// --- Define Routes ---
app.use("/api/auth", require("./routes/auth"));
app.use("/api/products", require("./routes/products"));
app.use("/api/contact-us", require("./routes/contact"));

// --- Test Route ---
app.get("/", (req, res) => {
  res.send("API is running...");
});

// --- Start Server ---
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
