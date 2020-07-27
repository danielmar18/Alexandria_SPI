const express = require('express');
const bodyParser = require('body-parser');
const server = express();
const mongoose = require('mongoose');

const db = require('../data/db').DB;

server.use(bodyParser.json());
//GET
server.post('/get', (req, res) => {
    console.log('The request body in data/get:' + req.body);
    return res.json([{'Endpoint': 'data/get'}]);
});

//FIND
server.post('/find', (req, res) => {
    console.log('The request body in data/find:' + req.body);
    return res.json([{'Endpoint': 'data/find'}]);
});

//COUNT
server.post('/count', (req, res) => {
    console.log('The request body in data/count:' + req.body);
    return res.json([{'Endpoint': 'data/count'}]);
});



module.exports = server;