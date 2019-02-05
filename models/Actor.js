const mongoose = require('mongoose');

const actorSchema = new mongoose.Schema({
  class: String, //normal, bully, victim, highread,cohort (not used in TestDrive)
  username: String, //username of actor - acts as a key to this actor
  profile: { //profile of this actor
    name: String,
    gender: String,
    age: Number,
    location: String,
    bio: String,
    picture: String
  }
}, { timestamps: true });

//get the URL of this actor, don't remember if I use this
actorSchema
.virtual('url')
.get(function () {

  //var diff = Date.now() - this.time;
  return '/user/' + this.username;
});

const Actor = mongoose.model('Actor', actorSchema);

module.exports = Actor;
