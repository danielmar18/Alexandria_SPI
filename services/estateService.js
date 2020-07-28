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
                callback(result);
            }
        })
    }
    return {
        findAllEstates
    }
}

module.exports = estateService();