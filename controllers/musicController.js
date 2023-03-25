const spotifyApi = require("../config/spotifyController");
const User = require("../models/User");
const Favourite = require("../models/Favourite");
const router = require("../routes/auth");

function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

//search music from search page and render the results to musiclist api
module.exports.searchMusic = async (req, res) => {
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
      duration: millisToMinutesAndSeconds(track.duration_ms),
      id: track.id,
      preview_url: track.preview_url,
    }));
    const user = await User.findById(req.session.passport.user);
    res.render("SearchResult", {
      layout: "base1",
      title: "Search Results",
      tracks: simplifiedResults,
      user: user,
    });
  }
  catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

//get the 4 featured playlists and render them to the home page
module.exports.playlists = async (req, res) => {
  try {
    const {
      body: { playlists },
    } = await spotifyApi.getFeaturedPlaylists({ limit: 10 });
    const latestPlaylists = playlists.items;
    res.json(latestPlaylists);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}

//get the 4 featured albums and render them to the home page
module.exports.albums = async (req, res) => {
  try {
    const { body: { albums } } = await spotifyApi.getNewReleases({ limit: 10 });
    const albumss = albums.items;
    const latestAlbums = albumss.filter((album) => album.images[0]);
    res.json(latestAlbums);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}


//on click of the playlist, get the playlist id and render the tracks to the musiclist page
module.exports.playlistId = (req, res) => {
  const playlistId = req.params.id;
  spotifyApi
    .getPlaylist(playlistId)
    .then( async (data) => {
      const tracks = data.body.tracks.items;
      const simplifiedTracks = tracks.map((track) => ({
        name: track.track.name,
        artist: track.track.artists[0].name,
        album: track.track.album.name,
        duration: millisToMinutesAndSeconds(track.track.duration_ms),
        id: track.track.id,
        // image: track.track.album.images[0].url,
      }));
      const poster = data.body.images[0].url;
      const user = await User.findById(req.session.passport.user);
      return res.render("MusicList", { layout: "base1", title: "List", user: user, tracks: simplifiedTracks, poster: poster });
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
}


//on click of the album, get the album id and render the tracks to the musiclist page
module.exports.albumId =  (req, res) => {
  const albumId = req.params.id;
  spotifyApi
    .getAlbumTracks(albumId)
    .then(async (data) => {
      const tracks = data.body.items;
      const simplifiedTracks = tracks.map((track) => ({
        name: track.name,
        artist: track.artists[0].name,
        duration: track.duration_ms,
        id: track.id,
        preview_url: track.preview_url,
      }));
      const user = await User.findById(req.session.passport.user);
      return res.render("MusicList", { layout: "base1", title: "List", user: user, tracks: simplifiedTracks });
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
}

//on click of the track, get the track id and send the track to the player
module.exports.trackId = (req, res) => {
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
}


// router.get('/addtofavourites/:id', isAuthenticated, addToFavourites);
// const favouriteSchema = new mongoose.Schema({
//     songId: String,
//     songName: String,
//     songArtist: String,
//     songImage: String,
//     songUrl: String,
//     songDuration: String,
//     userId: String,
//     date: {
//         type: Date,
//         default: Date.now
//     },
// });
    
module.exports.addToFavourites = async (req, res) => {
  try {
    const trackId = req.params.id;
    const check = await Favourite.findOne({ id: trackId, userId: req.session.passport.user });
    if (check) {
      await Favourite.deleteOne({ id: trackId });
      console.log('Track removed from favourites');
      return res.status(200).send('Track removed from favourites');
    }
    const track = await spotifyApi.getTrack(trackId);
    const simplifiedTrack = {
      id: track.body.id,
      name: track.body.name,
      artist: track.body.artists[0].name,
      image: track.body.album.images[0].url,
      preview_url: track.body.preview_url,
      duration: millisToMinutesAndSeconds(track.body.duration_ms),
      userId: req.session.passport.user,
    };
    const newFavourite = new Favourite(simplifiedTrack);
    await newFavourite.save();
    res.status(200).send('Track added to favourites');
  }
  catch (error) {
    console.error(error);
    res.status(500).send('Failed to add/remove track to/from favourites');
  }
};


module.exports.fetchFavourites = async (req, res) => {
  const user = await User.findById(req.session.passport.user);
  const favourites = await Favourite.find({ userId: user._id }).lean();
  res.render("LikedSongs", {
      layout: "base1",
      title: "Liked Songs",
      user: user,
      tracks: favourites,
    });
}


