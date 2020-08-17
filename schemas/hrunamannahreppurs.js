const Schema = require('mongoose').Schema;

module.exports = new Schema({
    Stod: {type: String, default: ''},
    Samband: {type: String, default: ''},
    Endastadur: {type: String, default: ''},
    Heiti_Heimtaugar: {type: String, default: ''},
    Veita: {type: String, default: ''},
    Tengidagur: {type: Date},
    Port_veitu: {type: String, default: ''},
    Athugasemd: {type: String, default: ''},
    Athugasemnd: {type: String, default: ''},
});