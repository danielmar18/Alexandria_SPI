    const Schema = require('mongoose').Schema;

    module.exports = new Schema({
        eNum: Number,
        phase: Number,
        name: String,
        residentialCableLength: String,
        isp: String,
        applicationSubmitted: Boolean,
        createdAt: Date,
        updatedAt: Date
    });