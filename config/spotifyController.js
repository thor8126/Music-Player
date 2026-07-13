const SpotifyWebApi = require("spotify-web-api-node");

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.SECRET_KEY,
  redirectUri: "http://localhost:3000/callback",
});

// Fetch a client-credentials access token and schedule a refresh before it
// expires. Spotify tokens are valid for ~1 hour, so without this every API
// request would start failing an hour after the server booted.
function refreshAccessToken() {
  return spotifyApi.clientCredentialsGrant().then(
    function (data) {
      spotifyApi.setAccessToken(data.body["access_token"]);
      // Refresh a minute before the token actually expires.
      const expiresInMs = (data.body["expires_in"] || 3600) * 1000;
      setTimeout(refreshAccessToken, Math.max(expiresInMs - 60 * 1000, 0));
    },
    function (err) {
      console.log("Something went wrong retrieving Spotify token!", err);
      // Retry shortly so the app can recover from a transient failure.
      setTimeout(refreshAccessToken, 30 * 1000);
    }
  );
}

refreshAccessToken();

module.exports = spotifyApi;
