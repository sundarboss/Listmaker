const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var taskSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, min: 3 },
    description: { type: String, required: true, min: 5 },
    created: Date,
    completed: Boolean,
    comp_date: Date
});

module.exports = mongoose.model('Task', taskSchema);