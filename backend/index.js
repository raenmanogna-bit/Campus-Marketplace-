const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Marketplace listings
let listings = [
  {
    id: 1,
    title: "Scientific Calculator",
    description: "Casio calculator in excellent condition.",
    price: 500,
    category: "Electronics",
    condition: "Like New",
    imageUrl:
      "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=500",
    location: "Block A",
  },
  {
    id: 2,
    title: "Engineering Mathematics Book",
    description: "First-year engineering mathematics textbook.",
    price: 250,
    category: "Books",
    condition: "Good",
    imageUrl:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500",
    location: "Library",
  },
  {
    id: 3,
    title: "College Cycle",
    description: "Well-maintained cycle, perfect for campus.",
    price: 3000,
    category: "Vehicles",
    condition: "Good",
    imageUrl:
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=500",
    location: "Hostel Block",
  },
];

// GET all listings
app.get("/api/listings", (req, res) => {
  res.json(listings);
});

// GET single listing
app.get("/api/listings/:id", (req, res) => {
  const listing = listings.find(
    (item) => item.id === Number(req.params.id)
  );

  if (!listing) {
    return res.status(404).json({
      message: "Listing not found",
    });
  }

  res.json(listing);
});

// CREATE listing
app.post("/api/listings", (req, res) => {
  const newListing = {
    id: Date.now(),
    title: req.body.title,
    description: req.body.description,
    price: Number(req.body.price),
    category: req.body.category,
    condition: req.body.condition,
    imageUrl: req.body.imageUrl || "",
    location: req.body.location || "",
  };

  listings.push(newListing);

  res.status(201).json(newListing);
});

// UPDATE listing
app.put("/api/listings/:id", (req, res) => {
  const id = Number(req.params.id);

  const index = listings.findIndex(
    (item) => item.id === id
  );

  if (index === -1) {
    return res.status(404).json({
      message: "Listing not found",
    });
  }

  listings[index] = {
    ...listings[index],
    ...req.body,
    price: Number(req.body.price),
    imageUrl: req.body.imageUrl || "",
    location: req.body.location || "",
  };

  res.json(listings[index]);
});

// DELETE listing
app.delete("/api/listings/:id", (req, res) => {
  const id = Number(req.params.id);

  const exists = listings.some(
    (item) => item.id === id
  );

  if (!exists) {
    return res.status(404).json({
      message: "Listing not found",
    });
  }

  listings = listings.filter(
    (item) => item.id !== id
  );

  res.json({
    message: "Listing deleted successfully",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(
    `Backend server running at http://localhost:${PORT}`
  );
});