const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const passport = require('passport');
const auth = require('./middleware/google-auth');

auth(passport);

const userRoutes = require('./routes/user');
const fileRoutes = require('./routes/file');
const serviceRoutes = require('./routes/service');
const externalRoutes = require('./routes/external');
const positionRoutes = require('./routes/position');
const segmentRoutes = require('./routes/segment');
const universeRoutes = require('./routes/universe');
const photoRoutes = require('./routes/photo');

mongoose.connect('mongodb://localhost:27017/next',
    { useNewUrlParser: true,
        useUnifiedTopology: true })
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

app.use('/api/auth', userRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/external', externalRoutes);
app.use('/api/positions', positionRoutes);
app.use('/api/segments', segmentRoutes);
app.use('/api/universes', universeRoutes);
app.use('/api/photos', photoRoutes);

module.exports = app;
