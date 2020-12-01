require('dotenv').config()

const spotifyConfig = {};

spotifyConfig.oAuthClientID = process.env.SPOTIFY_AUTH_CLIENT_ID;
spotifyConfig.oAuthClientSecret = process.env.SPOTIFY_AUTH_CLIENT_SECRET;
spotifyConfig.oAuthCallbackUrl = process.env.SPOTIFY_AUTH_CALLBACK_URL;
spotifyConfig.oAuthEnpoint = 'https://accounts.spotify.com/api';
spotifyConfig.scopes = [
  'user-read-email',
  'user-read-private'
];

spotifyConfig.apiEndpoint = 'https://api.spotify.com/v1';


module.exports = spotifyConfig;
