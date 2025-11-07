// routes/contact.js
const express = require("express");
const router = express.Router();
const db = require("../db");

// @route   POST /api/contact-us
// @desc    Submit a contact form entry
// @access  Public
router.post("/", async (req, res) => {
  const { name, email, phone, messages } = req.body;

  // Basic validation
  if (!name || !email || !messages) {
    return res
      .status(400)
      .json({ msg: "Please provide name, email, and a message." });
  }

  try {
    const newEntry = await db.query(
      "INSERT INTO contact_us (name, email, phone, messages) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, phone, messages]
    );

    res.json({
      msg: "Your message has been received!",
      entry: newEntry.rows[0],
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
