const googleConfig = {};

googleConfig.oAuthClientID = '426494770490-knqhdab0n39hu4qpv8drc7tjfr6ua3a3.apps.googleusercontent.com';
googleConfig.oAuthclientSecret = '_uzOH88EsriNSTrHVSYs1kaG';
googleConfig.oAuthCallbackUrl = 'http://127.0.0.1:3000/api/external/google/callback';
googleConfig.scopes = [
  'https://www.googleapis.com/auth/photoslibrary.readonly',
  'https://www.googleapis.com/auth/userinfo.email',
];

googleConfig.photosToLoad = 50;
googleConfig.searchPageSize = 100;
googleConfig.apiEndpoint = 'https://photoslibrary.googleapis.com';

module.exports = googleConfig;
