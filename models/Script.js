const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scriptSchema = new mongoose.Schema({
  body: {type: String, default: '', trim: true}, //body of the post
  post_id: Number, //post ID used in the CSV input file 
  class: String, //experimental or normal (not used in TestDrive)
  module: String, //name of lesson mod for this script (i.e. cyberbullying, etc)
  picture: String, //filename of the image for this post
  highread: Number, //not used in TestDrive (should kill)
  lowread: Number, //not used in TestDrive (should kill)
  likes: Number, //number of likes this post has
  info_text: String,
  actor: {type: Schema.ObjectId, ref: 'Actor'}, // Actor who "wrote" this post

  //reply: {type: Schema.ObjectId, ref: 'Script'},
  time: Number, //relative time of the post in millisecons

  //comments for this post (is an array)
  comments: [new Schema({
    class: String, //Bully, Marginal, normal, etc
    module: String, //name of mod for this script
    actor: {type: Schema.ObjectId, ref: 'Actor'},
    body: {type: String, default: '', trim: true}, //body of post or reply
    commentID: Number, //ID of the comment
    time: Number,//millisecons
    new_comment: {type: Boolean, default: false}, //is new comment
    likes: Number
    }, { versionKey: false })] //versioning messes up our updates to the DB sometimes, so we kill it here
},{ versionKey: false });


const Script = mongoose.model('Script', scriptSchema);

module.exports = Script;
