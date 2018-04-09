const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const classSchema = new mongoose.Schema({
  className: {type: String, default: '', trim: true}, //experimental or normal
  teacher: {type: Schema.ObjectId, ref: 'User'},
  students: [{type: Schema.ObjectId, ref: 'User'}],
  accessCode: { type: String, unique: true }
});


const Class = mongoose.model('Class', classSchema);

module.exports = Class;
