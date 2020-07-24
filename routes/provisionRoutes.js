const express = require('express');
const bodyParser = require('body-parser');
const server = express();
const mongoose = require('mongoose');

const db = require('../data/db').DB;

server.use(bodyParser.json());

server.post('', (req, res) => {
    if(db.readyState === 1){
        return res.json([{'Hi':'My Name is'}]);
    }
});

module.exports = server;