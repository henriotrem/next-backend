const mongoConfig = {};

mongoConfig.host = process.env.MONGODB_URL; //'mongodb://127.0.0.1:27017/next';
mongoConfig.options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

module.exports = mongoConfig;
