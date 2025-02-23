//const Estate = require('../data/db').Estate;
const DB = require('../data/db').DB;


const estateService = () => {
    const findAllEstates = (collectionName, body, callback, errorCallback) => {
        const collectionNameSchemaString = '../schemas/'+collectionName;
        const collectionNameSchema = require(collectionNameSchemaString.toString());
        var collectionNameString = collectionName[0].toUpperCase()+collectionName.substr(1);
        var base = DB.model(collectionNameString, collectionNameSchema); 
        if(filterChecker(body.filter)){
            console.log('No filter');
            base.find({}, function(err, result){
                if(err){
                    errorCallback({status: 500, message: err});
                } else{
                    var retArr = [];
                    var retArr2 = [];
                    var i = 0;
                    result.forEach(obj => {
                        retArr.push(estatePopulator(obj));
                    });
                    retObj = {
                        items: sorter(body.sort, retArr),
                        totalCount: retArr.length
                    }
                    console.log(retObj);
                    callback({status: 200, package: retObj});
                }
            });
        } else{
            console.log('Filter on');
            var query = {};
            if(body.filter.value.length == 1){
                const bodyObj = body.filter.value[0];
                var obj = {};
                if(bodyObj.operator != '$contains'){
                    obj[bodyObj.operator] = bodyObj.value;
                    query[bodyObj.fieldName] = obj;
                } else{
                    query[bodyObj.fieldName] = {"$regex": bodyObj.value, "$options": "i"};
                }
                console.log(query);
            }
            //console.log(query);
            base.find(query, function(err, result){
                if(err){
                    console.log(err);
                } else{
                    var retArr = [];
                    result.forEach( obj => {
                        retArr.push(estatePopulator(obj));
                    });
                    retObj = {
                        items: sorter(body.sort, retArr),
                        totalCount: retArr.length
                    }
                    callback({status: 200, package: retObj});
                }
            });
        }
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
                    retObj = {
                        "item": estatePopulator(estate)
                    }
                    callback({status: 200, package: retObj});
                }
            }
        });
    }
    return {
        findAllEstates,
        findEstateById
    }
}

const filterChecker = bodyFilter => {
    console.log(typeof JSON.stringify(bodyFilter));
    console.log(typeof bodyFilter);
    if(bodyFilter != null){
        if(bodyFilter != 0){
            if(bodyFilter.value != 0){
                if(bodyFilter.value != undefined){
                    if(bodyFilter.value[0] != 0){
                        console.log('yo');
                        return false
                    }
                }
            }
        }
        return true
    }
    //return (bodyFilter == null || bodyFilter == {})? true : (bodyFilter == 0) ? console.log('One down') : (bodyFilter.value == 0) ? true : (bodyFilter.value[0].value == 0) ? true : false;
}

const sorter = (sortOrder, dataArray) => {
    var jsonItems = (sortOrder == null || sortOrder == 0) ? dataArray : dataArray.sort(function(a, b){
        if(sortOrder[0].direction == 'asc'){
            if(a[sortOrder[0].fieldName] < b[sortOrder[0].fieldName]){
                return -1;
            }else if(b[sortOrder[0].fieldName] < a[sortOrder[0].fieldName]){
                return 1;
            } else{
                return 0;
            }
        } else if(sortOrder[0].direction == 'desc'){
            if(a[sortOrder[0].fieldName] < b[sortOrder[0].fieldName]){
                return 1;
            }else if(b[sortOrder[0].fieldName] < a[sortOrder[0].fieldName]){
                return -1;
            } else{
                return 0;
            }
        }
    });
    return jsonItems;
}
const estatePopulator = (obj) => {
    objArr = JSON.stringify(obj).split(/(?<="),(?=")/g);
    //objArr = objSplitter(JSON.stringify(obj));
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
    });
    return returnJson;

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

// const objSplitter = obj => {
//     // retArr = [];
//     // var j = 0;
//     // for(var i = 0; i < obj.length; i++){
//     //     if((obj[i] == '{' && obj[i+1] == '"' ) || (obj[i] == ',' && obj[i+1] == '"' )){
//     //         j = i;
//     //     }
//     //     if((obj[i] == '"' && obj[i+1] == ',') || (obj[i] == '"' && obj[i+1] == '}')){
//     //         retArr.push(obj.substr(j, i).toString());
//     //     }
//     // }
//     // console.log(retArr);
//     // return retArr;
//     retArr = obj.split(',');
//     retArr2 = [];
//     //console.log(retArr);
//     for(var i = 0; i < retArr.length; i++){
//         // console.log('\n');
//         // console.log('String: '+retArr[i]);
//         // console.log('First letter of string: '+ retArr[i][0]);
//         // console.log('Length of array: '+retArr.length);
//         // console.log('Item number: '+i);
//         if(retArr[i][retArr.length -1] != '{' || retArr[i][retArr.length -1] != '"' ){
//             if(i != retArr.length - 1){
//                 var j = i+1;
//                 if(retArr[j][0] != '"'){
//                     retArr2.push((retArr[i]+retArr[j]).toString());
//                 }
//             } else{
//                 retArr2.push(retArr[i]);
//             }
//         } else{
//             retArr2.push(retArr[i]);
//         }
//         console.log('\n')
//         console.log(retArr[retArr[i].length - 1]);
//         console.log(retArr.length);
//     }
//     return retArr2;
// }

module.exports = estateService();