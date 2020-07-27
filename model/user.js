const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: {type: String, required: true, min: 3},
    email: {type: String, required: true},
    password: {type: String, required: true, min: 4}
});

module.exports = mongoose.model('User', userSchema);