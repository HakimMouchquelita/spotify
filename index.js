require("dotenv").config();
require("express-async-errors");
const express = require("express");
const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const songRoutes = require("./routes/songs");
const playlistRoutes = require("./routes/playlists");

const bcrypt = require("bcrypt-nodejs");
const mongoose = require("mongoose");

const app = express();

connection();
app.use(cors());
app.use(express.json());
app.use("/api/songs", songRoutes);

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

app.use("/api/playlists", playlistRoutes);

// string to hash
const start = async () => {
  try {
    var spotify = await mongoose.connect("mongodb://0.0.0.0:27017/spotify");
    if (spotify) {
      console.log("Connected to MongoDB");
    }

    return app.listen(3000, () => console.log("Server started on port 3000"));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
