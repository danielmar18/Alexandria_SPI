const express = require('express');
const bodyParser = require('body-parser');
const server = express();
const mongoose = require('mongoose');
const EstateService = require('../services/estateService');

const DB = require('../data/db').DB;

server.use(bodyParser.json());
//GET
server.post('/get', (req, res) => {
    EstateService.findAllEstates(req.body.collectionName.toString(), function(estates){
        return res.json(estates);
    }, function(err){
        return res.status(err.status).send(err.message);
    });
});

//FIND
server.post('/find', (req, res) => {
    console.log('The request body in data/find:' + req.body.collectionName);

});

//COUNT
server.post('/count', (req, res) => {
    console.log('The request body in data/count:' + req.body);
    return res.json([{'Endpoint': 'data/count'}]);
});



module.exports = server;