const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activitySchema = new mongoose.Schema({
  userID: {type: Schema.ObjectId, ref: 'User'}, // ID for the user for this activity data
  module: String, // which module this activity data is for
  newPosts: [String], // list containing the body of each user-created post
  freeplayComments: [new Schema({
    postID: {type: Schema.ObjectId, ref: 'Script'}, // ID of the post the user interacted with
    postBody: {type: String, default: '', trim: true}, // body of the post the user interacted with
    userComments: [{type: String, trim: true}], // list containing the body of each user comment
  })]
});

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
