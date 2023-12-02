const mongoose = require("mongoose");

const albumSchema = new mongoose.Schema({
  artist: {
    type: String,
    required: [true, "Artist must be provided"],
    trim: true,
  },
  title: {
    type: String,
    required: [true, "title must be provided"],
    trim: true,
  },
  year: {
    type: Number,
    min: [1900, "release year must be above 1900"],
    max: [new Date().getFullYear(), "release year can not exceed current year"],
  },
  genre: {
    type: String,
    required: [true, "genre must be provided"],
    trim: true,
  },
  tracks: {
    type: Number,
    min: [0, "track amount cannot be negative"],
  },
  owner: {
    type: String,
    required: [true, "owner must be provided"],
  },
});

const Album = mongoose.model("albums", albumSchema);

module.exports = Album;
