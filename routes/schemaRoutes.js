const express = require('express');
const bodyParser = require('body-parser');
const server = express();
const mongoose = require('mongoose');

const DB = require('../data/db').DB;

server.use(bodyParser.json());

server.post('/find', (req, res) => {
    return res.json([{'Endpoint':'schema/find'}]);
})

server.post('/list', (req, res) => {
    return res.json([{'Endpoint': 'schema/list'}]);
})


module.exports = server;