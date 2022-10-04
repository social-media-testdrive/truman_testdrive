const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const classSchema = new mongoose.Schema({
    className: { type: String, default: '', trim: true }, //experimental or normal
    teacher: { type: Schema.ObjectId, ref: 'User' },
    students: [{ type: Schema.ObjectId, ref: 'User' }],
    accessCode: String,
    deleted: { type: Boolean, default: false }, // whether this class has been deleted by the instructor or not
    control: { type: Boolean, default: false } // Unique to Outcome Evaluation #3: Is class a control group? 
});


const Class = mongoose.model('Class', classSchema);

module.exports = Class;