const File = require('../models/File');

exports.addFile = (req, res, next) => {
    const file = new File({
        ...req.body
    });
    file.save()
        .then((file) => {

            res.status(201).json(file)
        })
        .catch(error => res.status(400).json({ error }));
};

exports.updateFile = (req, res, next) => {
    File.updateOne({ signature : req.params.signature}, { ...req.body})
        .then((file) => res.status(200).json({ message: 'File updated' }))
        .catch(error => res.status(400).json({ error}));
};

exports.getFiles = (req, res, next) => {
    File.find().where('signature').in(req.params.signatures.split(';'))
        .then(files => res.status(200).json(files))
        .catch(error => res.status(404).json({ error}));
}

exports.getAllFiles = (req, res, next) => {
    File.find().limit(10)
        .then(files => res.status(200).json(files))
        .catch(error => res.status(400).json({ error}));
};
