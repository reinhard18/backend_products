// routes/products.js
const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth"); // Import auth middleware

// ### Create a Product
// @route   POST /api/products
// @desc    Create a new product
// @access  Private
router.post("/", auth, async (req, res) => {
  // Accept either `image` or `images` from client payload (older clients may send `images`)
  const { name, image, images, description, price } = req.body;
  const imageValue = image || images || null;

  try {
    const newProduct = await db.query(
      "INSERT INTO products (name, image, description, price) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, imageValue, description, price]
    );
    res.json(newProduct.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// ### Read All Products
// @route   GET /api/products
// @desc    Get all products
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const allProducts = await db.query("SELECT * FROM products");
    res.json(allProducts.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// ### Read One Product
// @route   GET /api/products/:id
// @desc    Get a single product by ID
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const product = await db.query("SELECT * FROM products WHERE id = $1", [
      req.params.id,
    ]);

    if (product.rows.length === 0) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.json(product.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// ### Update a Product
// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private
router.put("/:id", auth, async (req, res) => {
  const { name, images, description, price } = req.body;

  const { id } = req.params;

  try {
    const updatedProduct = await db.query(
      "UPDATE products SET name = $1, images = $2, description = $3, price = $4 WHERE id = $5 RETURNING *",
      [name, images, description, price, id]
    );

    if (updatedProduct.rows.length === 0) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.json(updatedProduct.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// ### Delete a Product
// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const deleteProduct = await db.query(
      "DELETE FROM products WHERE id = $1 RETURNING *",
      [req.params.id]
    );

    if (deleteProduct.rows.length === 0) {
      return res.status(404).json({ msg: "Product not found" });
    }

    res.json({ msg: "Product deleted", product: deleteProduct.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
