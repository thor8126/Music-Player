const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const hbs = require("hbs");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
require("dotenv").config();
const axios = require("axios");
const { spawn } = require("child_process");

const SpotifyWebApi = require("spotify-web-api-node");

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.SECRET_KEY,
  redirectUri: "http://localhost:3000/callback",
});


// Get an access token using the client credentials grant flow
spotifyApi.clientCredentialsGrant().then(
  function (data) {
    console.log(data.body['access_token']);
    // Save the access token so that it can be used for future requests
    spotifyApi.setAccessToken(data.body['access_token']);
  },
  function (err) {
    console.log('Something went wrong!', err);
  }
);


app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.engine(
  "hbs",
  exphbs.engine({
    defaultLayout: "base1",
    extname: ".hbs",
    layoutsDir: path.join(__dirname, "views/layouts"),
    partialsDir: path.join(__dirname, "views/partials"),
  })
);

app.get("/", (req, res) => {
  res.render("Home", { layout: "base1", title: "Home" });
});

app.get('/list', (req, res) => {
  res.render('MusicList', { layout: 'base1', title: 'List' });
});

app.get("/about", (req, res) => {
  res.render("About", { layout: "base1", title: "About" });
});

app.get("/login", (req, res) => {
  res.render("Login", { layout: "base2", title: "Login" });
});

app.get("/register", (req, res) => {
  res.render("Register", { layout: "base2", title: "Register" });
});


app.get('/search', (req, res) => {
  const query = req.query.q; // Get the search query from the request query parameters
  spotifyApi.searchTracks(query)
    .then(data => {
      const tracks = data.body.tracks.items; // Extract the matching tracks from the API response
      res.json(tracks); // Send the matching tracks as a JSON response
    })
    .catch(err => {
      console.error(err);
      res.sendStatus(500); // Send a 500 Internal Server Error response if there was an error
    });
});


app.get('/api/playlists', async (req, res) => {
  try {
    const { body: { playlists } } = await spotifyApi.getFeaturedPlaylists({ limit: 4 });
    const latestPlaylists = playlists.items;
    res.json(latestPlaylists);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});






app.listen(port, () => console.log(`Example app listening on port ${port}!`));
