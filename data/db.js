const mongoose = require('mongoose');

const connection = mongoose.createConnection('mongodb+srv://danielmar18:Skja9sia@alexandriadb-pqmll.mongodb.net/testdb?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// connection.on('open', () => {
//     connection.db.listCollections().toArray((err, names) => {
//         if(err){
//             console.log(err);
//         } else{
//             console.log(names);
//             console.log(connection.readyState);
//         }
//     });
// });


module.exports = {
    DB: connection
}