const express = require('express');
const bodyParser = require('body-parser');
const server = express();
const mongoose = require('mongoose');

const DB = require('../data/db').DB;

server.use(bodyParser.json());

server.post('/find', async (req, res) => {
    var collection = await DB.db.listCollections().toArray();
    var collections = [];
    collection.forEach(base => {
        var object = {
            "name": base.name,
            "id": base.info.uuid
        }
        collections.push(object);
    });
    console.log('\n');
    console.log('--------------Tried to get Schemas(/schemas/find)---------------');
    console.log('\n');
    return res.json(collections);
})

server.post('/list', (req, res) => {
    var collection = await DB.db.listCollections().toArray();
    var collections = [];
    collection.forEach(base => {
        var object = {
            "name": base.name,
            "id": base.info.uuid
        }
        collections.push(object);
    });
    console.log('\n');
    console.log('--------------Tried to get Schemas(/schemas/list)---------------');
    console.log('\n');
    return res.json(collections);
})


module.exports = server;