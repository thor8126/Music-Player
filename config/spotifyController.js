const SpotifyWebApi = require("spotify-web-api-node");


const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.SECRET_KEY,
    redirectUri: "http://localhost:3000/callback",
  });

  // Get an access token using the client credentials grant flow
spotifyApi.clientCredentialsGrant().then(
    function (data) {
      // Save the access token so that it can be used for future requests
      spotifyApi.setAccessToken(data.body["access_token"]);
    },
    function (err) {
      console.log("Something went wrong!", err);
    }
  );


module.exports = spotifyApi;