/* const mongoose = require("mongoose"); */
require("dotenv").config();
const Album = require("../models/Album");
const CustomError = require("../error/CustomError");
const { isAdmin, isAuthorized } = require("../Utils/AuthenticationUtils");
const APIError = require("../error/api_err");

const getAlbums = async (req, res) => {
  const { artist, title, year, genre, tracks, sort, numericFilter, fieldFilter } = req.query;

  const queryObject = {};
  if (artist) queryObject.artist = { $regex: artist, $options: "i" };
  if (title) queryObject.title = { $regex: title, $options: "i" };
  if (genre) queryObject.genre = genre;

  if (numericFilter) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };

    const regEx = /\b(<|>|>=|=|<|<=)\b/g;
    let filters = numericFilter.replace(regEx, (match) => `-${operatorMap[match]}-`);
    const options = ["year"];
    filters = filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");
      if (options.includes(field)) {
        queryObject[field] = { [operator]: Number(value) };
      }
    });
  }

  const albums = await Album.find(queryObject).sort(sort).select(fieldFilter);
  res.status(200).json({
    success: true,
    sorted: sort,
    queryObject: queryObject,
    fieldFilter: fieldFilter,
    data: albums,
  });
};

const getAlbum = async (req, res) => {
  try {
    const { id } = req.params;
    const albums = await Album.find({ _id: id }).catch((err) => {
      throw new CustomError(err, 404);
    });
    return res.status(200).json({ success: true, data: albums });
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
};

const createAlbum = async (req, res) => {
  try {
    const { artist, title, year, genre, tracks } = req.body;
    const albumObj = {
      artist: artist,
      title: title,
      year: year,
      genre: genre,
      tracks: tracks,
      owner: req.session.user._id,
    };
    const album = await Album.create(albumObj).catch((err) => {
      throw new Error(err);
    });
    res.status(201).json({ success: true, data: album });
  } catch (err) {
    return res.status(402).send({ success: false, msg: err.message });
  }
};

const updateAlbum = async (req, res) => {
  try {
    if (!isAdmin(req.session.user)) {
      throw new CustomError("Unauthorized", 404);
    }
    const { id } = req.params;
    const album = await Album.findOneAndUpdate({ _id: id }, req.body).catch((err) => {
      throw new CustomError(err, 400);
    });
    return res.status(200).json({ success: true, data: album });
  } catch (e) {
    res.status(500).json({ msg: e.message });
  }
};

const deleteAlbum = async (req, res) => {
  try {
    const { id } = req.params;
    const res = await Album.findOne({ _id: id }).select({ owner: 1 });
    if (!isAuthorized(req.session.user, res)) {
      throw new CustomError("Unauthorized", 400);
    }
    const album = await Album.deleteOne({ _id: id });
    res.status(200).send({ success: true, data: album });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

module.exports = {
  getAlbum,
  getAlbums,
  createAlbum,
  updateAlbum,
  deleteAlbum,
};
