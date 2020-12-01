require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const passport = require('passport');
const googleAuth = require('./middleware/google-auth');
const spotifyAuth = require('./middleware/spotify-auth');

googleAuth(passport);
spotifyAuth(passport);

const authRoutes = require('./routes/auth');
const sourceRoutes = require('./routes/source');
const externalRoutes = require('./routes/external');
const positionRoutes = require('./routes/position');
const segmentRoutes = require('./routes/segment');
const photoRoutes = require('./routes/photo');
const musicRoutes = require('./routes/music');
const watchRoutes = require('./routes/watch');
const websiteRoutes = require('./routes/website');
const universeRoutes = require('./routes/universe');

const mongoose = require('mongoose');
const mongoConfig = require('./configuration/mongodb-config');
mongoose.connect(mongoConfig.host, mongoConfig.options)
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content,Accept,Content-Type,Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
    next();
});

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', authRoutes);
app.use('/api/sources', sourceRoutes);
app.use('/api/external', externalRoutes);
app.use('/api/positions', positionRoutes);
app.use('/api/segments', segmentRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/musics', musicRoutes);
app.use('/api/watches', watchRoutes);
app.use('/api/websites', websiteRoutes);
app.use('/api/universes', universeRoutes);

module.exports = app;
