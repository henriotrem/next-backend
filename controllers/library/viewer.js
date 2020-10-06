const Redis = require("redis");
const redis = Redis.createClient({port: 6379,host: '127.0.0.1'});

this.indexes = function(universe, ids, callback) {

    var target = ids.length;
    var result = {};

    for(let id of ids) {

        let key = universe + '|index.' + id;

        redis.zrevrange([key, 0, -1, 'WITHSCORES'], function (err, response) {

            result[this.key] = response;

            if (--target === 0)
                this.callback(result);

        }.bind({ key: key, callback: callback }));
    }
};
this.lists = function(universe, ids, callback) {

    var target = ids.length;
    var result = {};

    for(let id of ids) {

        let key = universe + '|list.' + id;

        redis.lrange([key, 0, -1], function (err, response) {

            result[this.key] = response;

            if (--target === 0)
                this.callback(result);

        }.bind({ key: key, callback: callback }));
    }
};
