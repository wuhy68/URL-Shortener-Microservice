const mongoose = require('mongoose');

const newUrl = new mongoose.Schema({
    shortUrl: String,
    url: String
});

module.exports = mongoose.model('Url', newUrl);