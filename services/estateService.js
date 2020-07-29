//const Estate = require('../data/db').Estate;
const DB = require('../data/db').DB;


const estateService = () => {
    const findAllEstates = (collectionName, body, callback, errorCallback) => {
        const collectionNameSchemaString = '../schemas/'+collectionName;
        const collectionNameSchema = require(collectionNameSchemaString.toString());
        var collectionNameString = collectionName[0].toUpperCase()+collectionName.substr(1);
        var base = DB.model(collectionNameString, collectionNameSchema); 
        base.find({}, function(err, result){
            if(err){
                errorCallback({status: 500, message: err});
            } else{
                retArr = [];
                result.forEach(obj => {
                    objArr = JSON.stringify(obj).split(',');
                    fieldArr = [];
                    valueArr = [];
                    objArr.forEach( element => {
                        fieldArr.push(element.split(':')[0]);
                        valueArr.push(element.split(':')[1]);
                    });
                    fieldArr[0] = fieldArr[0].substr(1);
                    valueArr[valueArr.length-1] = valueArr[valueArr.length-1].substr(0, valueArr[valueArr.length-1].length-1);
                    var i = 0;
                    var returnJson = {};
                    valueArr.forEach( value => {
                        if(typeFinder(value) === 'datetime'){
                            var dateObj = {
                                "$date": new Date(value.split('T')[0])
                            }
                            returnJson[fieldArr[i].toString().split('"')[1]] = dateObj;
                        } else{
                            returnJson[fieldArr[i].toString().split('"')[1]] = (Number(value).toString() != 'NaN') ? Number(value) : 
                            (value == 'false' || value == 'true') ? ((value == 'true') ? true : false) : value.split('"')[1];
                        }
                        i++
                    })
                    retArr.push(returnJson);
                });
                var jsonItems = (body.sort == null || body.sort == 0) ? retArr : retArr.sort(function(a, b){
                    if(body.sort[0].direction == 'asc'){
                        if(a[body.sort[0].fieldName] < b[body.sort[0].fieldName]){
                            return -1;
                        }else if(b[body.sort[0].fieldName] < a[body.sort[0].fieldName]){
                            return 1;
                        } else{
                            return 0;
                        }
                    } else if(body.sort[0].direction == 'desc'){
                        if(a[body.sort[0].fieldName] < b[body.sort[0].fieldName]){
                            return 1;
                        }else if(b[body.sort[0].fieldName] < a[body.sort[0].fieldName]){
                            return -1;
                        } else{
                            return 0;
                        }
                    }
                })
                retObj = {
                    items: jsonItems,
                    totalCount: retArr.length
                }
                console.log(retObj);
                callback({status: 200, package: retObj});
            }
        })
    }


    const findEstateById = (collectionName, estateId, callback, errorCallback) => {
        const collectionNameSchemaString = '../schemas/'+collectionName;
        const collectionNameSchema = require(collectionNameSchemaString.toString());
        var collectionNameString = collectionName[0].toUpperCase()+collectionName.substr(1);
        var base = DB.model(collectionNameString, collectionNameSchema);  
        base.findOne({_id: estateId}, function(err, estate){
            if(err){
                errorCallback({status: 500, message: err});
            } else{
                if(estate == null){
                    errorCallback({status: 404, message: 'Estate not found'});
                } else{
                    objArr = JSON.stringify(estate).split(',');
                    fieldArr = [];
                    valueArr = [];
                    objArr.forEach( element => {
                        fieldArr.push(element.split(':')[0]);
                        valueArr.push(element.split(':')[1]);
                    });
                    fieldArr[0] = fieldArr[0].substr(1);
                    valueArr[valueArr.length-1] = valueArr[valueArr.length-1].substr(0, valueArr[valueArr.length-1].length-1);
                    var i = 0;
                    var returnJson = {};
                    valueArr.forEach( value => {
                        if(typeFinder(value) === 'datetime'){
                            var dateObj = {
                                "$date": new Date(value.split('T')[0])
                            }
                            returnJson[fieldArr[i].toString().split('"')[1]] = dateObj;
                        } else{
                            returnJson[fieldArr[i].toString().split('"')[1]] = (Number(value).toString() != 'NaN') ? Number(value) : 
                            (value == 'false' || value == 'true') ? ((value == 'true') ? true : false) : value.split('"')[1];
                        }
                        i++
                    })
                    retObj = {
                        "item": returnJson
                    }
                    callback({status: 200, package: retObj});
                }
            }
        })
    }
    return {
        findAllEstates,
        findEstateById
    }
}

const typeFinder = line => {
    if(line[line.length -1] == '}'){
        line = line.substr(0, line.length -1);
    }
    if(Number(line).toString() != 'NaN'){
        return 'number';
    }
    if(Number(line[1]).toString() != 'NaN'){
        if(new Date(line.split('T')[0]) != 'Invalid Date'){
            return 'datetime';
        }
    }
    if(line === 'true' || line === 'false'){
        return 'boolean';
    }
    else{
        return 'text';
    }
}

module.exports = estateService();