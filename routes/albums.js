const express = require("express");
const router = express.Router();
const authUser = require("../middleware/auth");
const {
  getAlbums,
  getAlbum,
  createAlbum,
  updateAlbum,
  deleteAlbum,
} = require("../controllers/albums");
router.route("/").get(getAlbums).post(authUser, createAlbum);
router
  .route("/:id")
  .get(authUser, getAlbum)
  .put(authUser, updateAlbum)
  .delete(authUser, deleteAlbum);
module.exports = router;
