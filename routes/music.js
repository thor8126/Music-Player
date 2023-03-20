const express = require("express");
const router = express.Router();
const spotifyApi = require("../controller/spotifyController");

router.get("/api/playlists", async (req, res) => {
  try {
    const {
      body: { playlists },
    } = await spotifyApi.getFeaturedPlaylists({ limit: 4 });
    const latestPlaylists = playlists.items;
    res.json(latestPlaylists);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.get("/api/albums", async (req, res) => {
  try {
    const {
      body: { albums },
    } = await spotifyApi.getNewReleases({ limit: 4 });
    const latestAlbums = albums.items;
    res.json(latestAlbums);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

router.get("/playlist/:id", (req, res) => {
  const playlistId = req.params.id;
  spotifyApi
    .getPlaylist(playlistId)
    .then((data) => {
      const tracks = data.body.tracks.items;

      const simplifiedTracks = tracks.map((track) => ({
        name: track.track.name,
        artist: track.track.artists[0].name,
        album: track.track.album.name,
        image: track.track.album.images[0].url,
        duration: track.track.duration_ms,
        id: track.track.id,
      }));
      res.render("MusicList", {
        layout: "base1",
        title: "Songs",
        tracks: simplifiedTracks,
      });
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

router.get("/track/:id", (req, res) => {
  const trackId = req.params.id;
  spotifyApi
    .getTrack(trackId)
    .then((data) => {
      const track = data.body;
      const simplifiedTrack = {
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        image: track.album.images[0].url,
        duration: track.duration_ms,
        id: track.id,
        preview_url: track.preview_url,
      };
      res.send(simplifiedTrack);
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

router.get("/album/:id", (req, res) => {
  const albumId = req.params.id;
  spotifyApi
    .getAlbumTracks(albumId)
    .then((data) => {
      const tracks = data.body.items;
      const simplifiedTracks = tracks.map((track) => ({
        name: track.name,
        artist: track.artists[0].name,
        duration: track.duration_ms,
        id: track.id,
        preview_url: track.preview_url,
      }));
      res.render("MusicList", {
        layout: "base1",
        title: "Songs",
        tracks: simplifiedTracks,
      });
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
});

router.post("/search", async (req, res) => {
    try {
      const query = req.body.q;
      const {
        body: { tracks },
      } = await spotifyApi.searchTracks(query);
      //filter out the tracks that don't have an preview url
      const filteredResults = tracks.items.filter((track) => track.preview_url);
      //simplify the results
      const simplifiedResults = filteredResults.map((track) => ({
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        image: track.album.images[0].url,
        duration: track.duration_ms,
        id: track.id,
        preview_url: track.preview_url,
      }));
      console.log(simplifiedResults);
      // res.send(simplifiedResults);
      res.render("MusicList", {
        layout: "base1",
        title: "Search Results",
        tracks: simplifiedResults,
      });
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  });

module.exports = router;