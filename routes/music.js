const express = require("express");
const router = express.Router();
const spotifyApi = require("../config/spotifyController");
const User = require("../models/User");
const isAuthenticated = require("../config/isAuthenticated");
const { searchMusic, playlists, albums ,playlistId, trackId, albumId, addToFavourites, fetchFavourites } = require("../controllers/musicController");

router.get("/api/playlists",isAuthenticated, playlists);

router.get("/api/albums",isAuthenticated, albums);

router.get("/playlist/:id", isAuthenticated, playlistId);

router.get("/track/:id", isAuthenticated, trackId);

router.get("/album/:id", isAuthenticated, albumId);

router.post("/search", isAuthenticated, searchMusic);

router.get('/addtofavourites/:id', isAuthenticated, addToFavourites);

router.get('/fav', isAuthenticated, fetchFavourites);

// /fav/:{{user.id}}/:{{track.id}}

module.exports = router;