const express = require('express');
const bodyParser = require('body-parser');
const server = express();
const mongoose = require('mongoose');
const EstateService = require('../services/estateService');

const DB = require('../data/db').DB;

server.use(bodyParser.json());
//GET
server.post('/get', (req, res) => {
    console.log('\n');
    console.log("The request body in data/get: "+JSON.stringify(req.body));
    console.log('\n');
    EstateService.findAllEstates(req.body.collectionName.toString(), function(estates){
        return res.json(estates);
    }, function(err){
        return res.status(err.status).send(err.message);
    });
});

//FIND
server.post('/find', (req, res) => {
    console.log('\n');
    console.log("The request body in data/find: "+JSON.stringify(req.body));
    console.log('\n');
    EstateService.findAllEstates(req.body.collectionName.toString(), function(estates){
        return res.json(estates);
    }, function(err){
        return res.status(err.status).send(err.message);
    });
});

//COUNT
server.post('/count', (req, res) => {
    console.log('\n');
    console.log("The request body in data/count: "+JSON.stringify(req.body));
    console.log('\n');
    EstateService.findAllEstates(req.body.collectionName.toString(), function(estates){
        return res.json({"totalCount": estates.totalCount});
    }, function(err){
        return res.status(err.status).send(err.message);
    });
});



module.exports = server;