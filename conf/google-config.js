require('dotenv').config()

const googleConfig = {};

googleConfig.oAuthClientID = process.env.GOOGLE_AUTH_CLIENT_ID;
googleConfig.oAuthClientSecret = process.env.GOOGLE_AUTH_CLIENT_SECRET;
googleConfig.oAuthCallbackUrl = process.env.GOOGLE_AUTH_CALLBACK_URL;
googleConfig.oAuthAPIKey = process.env.GOOGLE_AUTH_API_KEY;
googleConfig.oAuthEnpoint = 'https://oauth2.googleapis.com';
googleConfig.scopes = [
  'https://www.googleapis.com/auth/photoslibrary.readonly',
  'https://www.googleapis.com/auth/userinfo.email',
];

googleConfig.photosToLoad = 50;
googleConfig.searchPageSize = 100;
googleConfig.photoApiEndpoint = 'https://photoslibrary.googleapis.com';
googleConfig.mapsApiEndpoint = 'https://maps.googleapis.com';


module.exports = googleConfig;
