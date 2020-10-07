require('dotenv').config()

const googleConfig = {};

googleConfig.oAuthClientID = process.env.GOOGLE_AUTH_CLIENT_ID;
googleConfig.oAuthclientSecret = process.env.GOOGLE_AUTH_CLIENT_SECRET;
googleConfig.oAuthCallbackUrl = process.env.GOOGLE_AUTH_CALLBACK_URL;
googleConfig.scopes = [
  'https://www.googleapis.com/auth/photoslibrary.readonly',
  'https://www.googleapis.com/auth/userinfo.email',
];

googleConfig.photosToLoad = 50;
googleConfig.searchPageSize = 100;
googleConfig.apiEndpoint = 'https://photoslibrary.googleapis.com';

module.exports = googleConfig;
