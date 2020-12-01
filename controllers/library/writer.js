const Redis = require("redis");
const redisConfig = require('../../configuration/redis-config');
const redis = Redis.createClient(redisConfig);

const { v4: uuid } = require('uuid');

this.dimensions = {};
this.dimensions.geospatiality = require("./dimensions/geospatiality");
this.dimensions.temporality = require("./dimensions/temporality");

this.target = {};

this.create = function (universe, object) {

    let root = "";

    for(let i = 0; i < universe.dimensions.length; i++)
        root += (i === 0 ? "" : ".") + universe.dimensions[i].base.root;

    let hash = this.name(universe, object);
    let value = object.type + "|" + object._id + "." + hash;

    this.add(hash, value, universe, root);
};

this.randomize = function (universe, name, number) {

    let root = "";

    for(let i = 0; i < universe.dimensions.length; i++)
        root += (i === 0 ? "" : ".") + universe.dimensions[i].base.root;

    for(let i = 0; i < number; i++) {

        let object = {};

        object.key = name+"|"+uuid();

        for(let j = 0; j < universe.dimensions.length; j++) {
            let dimension = this.dimensions[universe.dimensions[j].key];
            object[dimension.key] = dimension.random();
        }

        let hash = this.name(universe, object);
        let value = object.key + "." + hash;

        this.add(hash, value, universe, root);
    }
};
this.name = function(universe, object) {

    let hash = "";

    for(let i = 0; i < universe.dimensions.length; i++) {
        let dimension = this.dimensions[universe.dimensions[i].key];
        hash += (i === 0 ? "" : ".") + dimension.encode(universe.dimensions[i].base, universe.precision, object[dimension.key]);
        object[dimension.key] = object[dimension.key].toString();
    }

    return hash;
};
this.parent = function(hashes, universe) {

    let parent = "";
    let arr = hashes.split(".");

    for(let j = 0; j < arr.length; j++) {
        let tmp = this.dimensions[universe.dimensions[j].key].parent(universe.dimensions[j].base, arr[j]);

        if(tmp) {
            parent += (j === 0 ? "" : ".") + tmp;
        } else {
            return null;
        }
    }

    return parent;
};
this.add = function (hash, value, universe, root) {

    hash = this.parent(hash, universe);

    let key = universe.key  + "|list." + hash;
    let bind = {context: this, key: key, value: value, hash: hash, universe: universe, root: root};

    if(this.parent(hash, universe) === root) {

        redis.lpush(bind.key, bind.value, this.push.bind(bind));
    } else {

        redis.lpushx(bind.key, bind.value, this.push.bind(bind));
    }
};
this.push = function (err, res) {

    if (res === 0) {

        this.context.add(this.hash, this.value, this.universe, this.root);
    } else {

        this.context.index(this.key, this.hash, this.universe, this.root);

        if (res === this.universe.limit)
            this.context.transfer(this.hash, this.universe);

    }
};
this.index = function(value, hash, universe, root) {

    hash = this.parent(hash, universe);

    let key = universe.key  + "|index." + hash;

    redis.zincrby(key, 1, value);

    if(hash !== root)
        this.index(key, hash, universe, root);

};
this.transfer = function(hash, universe) {

    let arr = hash.split(".");
    let key = universe.key + "|list";
    this.target[hash] = 1;

    for (let i in arr)
        this.target[hash] *= universe.dimensions[i].base.alphabet.length;

    this.combinations(hash, key, arr, 0, universe);
};
this.combinations = function(hash, key, arr, i, universe) {

    for(var char1 of universe.dimensions[i].base.alphabet) {
        let tmp = key + "." + arr[i] + char1;

        if ((i + 1) === arr.length) {
            this.generate(tmp, hash, universe);
        } else {
            this.combinations(hash, tmp, arr, i+1, universe);
        }
    }
};
this.generate = function(key, hash, universe){

    redis.lpush(key, 1, function(err, res) {

        if(--this.context.target[this.hash] === 0) {

            this.context.complete(this.hash, this.universe);
        }

    }.bind({context: this, hash: hash, key: key, universe: universe}));
};
this.complete = function(hash, universe) {

    let key = universe.key + "|list." +hash;

    redis.rpop(key, function(err, object) {

        if(object != null) {

            if(object !== "1")
                this.context.add(object.split(/\.(.+)/)[1], object, this.universe, this.context.parent(this.hash, this.universe));

            this.context.complete(this.hash, this.universe);
        } else {

            this.context.erase(this.hash, this.universe);
        }
    }.bind({context: this, hash: hash, universe: universe}));
};
this.erase = function(hash, universe) {

    delete this.target[this.hash];

    let key = universe.key  + "|index." + this.parent(hash, universe);
    let value = universe.key  + "|list." + hash;

    redis.zrem(key, value);
};
