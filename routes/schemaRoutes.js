const express = require('express');
const bodyParser = require('body-parser');
const server = express();
const mongoose = require('mongoose');

const DB = require('../data/db').DB;

server.use(bodyParser.json());

server.post('/find', async (req, res) => {
    console.log('The request body in schema/find:' + req.body);
    var schemaArray = [];
    var counter = 0;
    var collections = await DB.db.listCollections().toArray();
    const numberOfCollections = collections.length;
    collections.forEach(coll => {
        DB.db.collection(coll.name.toString()).findOne({}, function(err, result){
            if(err){console.log('We fucked up');}
            else{
                fieldArr = {};
                var obj = JSON.stringify(result);
                lines = obj.split(',');
                lines.forEach( line => {
                    var tmp = '';
                    if(line[0] == '{'){
                        tmp = line+'}';
                    } else if(line[line.length-1] == '}'){
                        tmp = '{'+line;
                    } else{
                        tmp = '{' + line + '}';
                    }
    
                    tmpField = line.split(':')[0];
                    tmpFieldType = typeFinder(line.split(/:(.+)/)[1]);
                    tmpField2 = tmpField.split('"')[1];
                    fieldObj = {    
                        "displayName": tmpField2,
                        "type": tmpFieldType,
                        "queryOperators": [
                            "eq",
                            "lt",
                            "gt",
                            "hasSome",
                            "and",
                            "lte",
                            "gte",
                            "or",
                            "not",
                            "ne",
                            "startsWith",
                            "endsWith"
                        ]
                    };
                    //foo[tmpField2.toString()] = fieldObj;
                    fieldArr[tmpField2.toString()] = fieldObj;
                });
                schema = {
                    "displayName": coll.name,
                    "id": coll.name,
                    "maxPageSize": 50,
                    "allowedOperations": [
                        "get",
                        "find",
                        "count"
                    ],
                    "ttl": 3600,
                    "fields": fieldArr 
                }
                schemaArray.push(schema);
            }
            retObj = {
                "schemas": schemaArray
            }
            counter++;
            if(counter == numberOfCollections){
                return res.json(retObj);
            }
        });
    });
})

server.post('/list', async (req, res) => {
    console.log('The request body in schema/list:' + req.body);
    var schemaArray = [];
    var counter = 0;
    var collections = await DB.db.listCollections().toArray();
    const numberOfCollections = collections.length;
    collections.forEach(coll => {
        var a = [];
        DB.db.collection(coll.name.toString()).findOne({}, function(err, result){
            if(err){console.log('We fucked up');}
            else{
                fieldArr = {};
                var obj = JSON.stringify(result);
                lines = obj.split(',');
                lines.forEach( line => {
                    var tmp = '';
                    if(line[0] == '{'){
                        tmp = line+'}';
                    } else if(line[line.length-1] == '}'){
                        tmp = '{'+line;
                    } else{
                        tmp = '{' + line + '}';
                    }
    
                    tmpField = line.split(':')[0];
                    tmpFieldType = typeFinder(line.split(/:(.+)/)[1]);
                    tmpField2 = tmpField.split('"')[1];
                    //var foo = {};
                    //var name = tmpField2.toString();
                    fieldObj = {    
                        "displayName": tmpField2,
                        "type": tmpFieldType,
                        "queryOperators": [
                            "eq",
                            "lt",
                            "gt",
                            "hasSome",
                            "and",
                            "lte",
                            "gte",
                            "or",
                            "not",
                            "ne",
                            "startsWith",
                            "endsWith"
                        ]
                    };
                    //foo[tmpField2.toString()] = fieldObj;
                    fieldArr[tmpField2.toString()] = fieldObj;
                });
                schema = {
                    "displayName": coll.name,
                    "id": coll.name,
                    "maxPageSize": 50,
                    "allowedOperations": [
                        "get",
                        "find",
                        "count"
                    ],
                    "ttl": 3600,
                    "fields": fieldArr,
                    
                }
                schemaArray.push(schema);
            }
            retObj = {
                "schemas": schemaArray
            }
            counter++;
            if(counter == numberOfCollections){
                return res.json(retObj);
            }
        });
    });
})

const typeFinder = line => {
    if(line[line.length -1] == '}'){
        line = line.substr(0, line.length -1);
    }
    if(Number(line).toString() != 'NaN'){
        return 'number';
    }
    if(new Date(line.split('T')[0]) != 'Invalid Date'){
        return 'datetime';
    }
    if(line === 'true' || line === 'false'){
        return 'boolean';
    }
    else{
        return 'text';
    }
}

const fieldFinder = collectionName => {
    DB.db.collection(collectionName).findOne({}, function(err, result){
        if(err){console.log('We fucked up');}
        else{
            retArr = [];
            var obj = JSON.stringify(result);
            lines = obj.split(',');
            lines.forEach( line => {
                var tmp = '';
                if(line[0] == '{'){
                    tmp = line+'}';
                } else if(line[line.length-1] == '}'){
                    tmp = '{'+line;
                } else{
                    tmp = '{' + line + '}';
                }

                tmpField = line.split(':')[0];
                tmpFieldType = typeFinder(line.split(/:(.+)/)[1]);
                tmpField2 = tmpField.split('"')[1];
                fieldObj = {
                    "field": tmpField2,
                    "fieldType": tmpFieldType
                };
                retArr.push(fieldObj);
            });
            return res.json(retArr);
        }
    });
}

module.exports = server;