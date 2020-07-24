const express = require('express');
const bodyParser = require('body-parser');
const server = express();
const mongoose = require('mongoose');

const db = require('../data/db').DB;

server.use(bodyParser.json());
//GET
server.post('/get', (req, res) => {
    return res.json([{'Endpoint': 'data/get'}]);
});

//FIND
server.post('/find', (req, res) => {
    return res.json([{'Endpoint': 'data/find'}]);
});

//COUNT
server.post('/count', (req, res) => {
    return res.json([{'Endpoint': 'data/count'}]);
});



module.exports = server;