//const Estate = require('../data/db').Estate;
const DB = require('../data/db').DB;


const estateService = () => {
    const findAllEstates = (collectionName, callback, errorCallback) => {
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
                            var resultIndex = result.indexOf(obj);
                            var field = fieldArr[i].toString();
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
                    // console.log(returnJson);
                    // console.log(obj);
                    retArr.push(returnJson);
                })
                //console.log(retArr);
                retObj = {
                    items: retArr
                }
                callback(retObj);
            }
        })
    }
    return {
        findAllEstates
    }
}

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

module.exports = estateService();