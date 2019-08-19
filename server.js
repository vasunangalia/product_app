const express = require("express");
const connectDB = require("./config/db");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

// EJS
app.use(expressLayouts);
app.set("view engine", "ejs");

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Define Routes
app.use("/api/product/", require("./routes/api/product"));
app.use("/", require("./routes/api/index"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
