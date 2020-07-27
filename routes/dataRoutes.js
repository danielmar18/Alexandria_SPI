const express = require('express');
const bodyParser = require('body-parser');
const server = express();
const mongoose = require('mongoose');

const DB = require('../data/db').DB;

server.use(bodyParser.json());
//GET
server.post('/get', (req, res) => {
    console.log('The request body in data/get:' + req.body);
    return res.json([{'Endpoint': 'data/get'}]);
});

//FIND
server.post('/find', (req, res) => {
    console.log('The request body in data/find:' + req.body);
    DB.db.collection(req.body.collectionName.toString).find({}, function(err, results){
        if(err){
            console.log('fuck');
        } else{
            return res.json(results);
        }
    });
});

//COUNT
server.post('/count', (req, res) => {
    console.log('The request body in data/count:' + req.body);
    return res.json([{'Endpoint': 'data/count'}]);
});



module.exports = server;