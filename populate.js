#! /usr/bin/env node

console.log('This script is running!!!!');


var async = require('async')
var Actor = require('./models/Actor.js');
var Script = require('./models/Script.js');
const _ = require('lodash');
const dotenv = require('dotenv');
var mongoose = require('mongoose');
var fs = require('fs')



//var actors_list = require('./input/actors.json');
var actors_list = [];
var posts_list = require('./input/posts.json');
var replies_list = require('./input/replies.json');

/*
var actors1 = require('./testdrive_actorv1.json');
var posts1 = require('./testdrive_postv1.json');
var post_reply1 = require('./testdrive_replyv1.json');
//var actorReply = require('./actorReply.json');
//var notify = require('./notify.json');
var dd = require('./upload_post_replyv1.json');
*/

dotenv.load({ path: '.env' });

var MongoClient = require('mongodb').MongoClient
 , assert = require('assert');


//var connection = mongo.connect('mongodb://127.0.0.1/test');

mongoose.connect(process.env.PRO_MONGODB_URI || process.env.PRO_MONGOLAB_URI);
var db = mongoose.connection;
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});



String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

function timeStringToNum (v) {
  var timeParts = v.split(":");
  if (timeParts[0] =="-0")
    return -1*parseInt(((timeParts[0] * (60000 * 60)) + (timeParts[1] * 60000)), 10);
  else if (timeParts[0].startsWith('-'))
    return parseInt( ((timeParts[0] * (60000 * 60)) + (-1*(timeParts[1] * 60000))), 10);
  else
    return parseInt(((timeParts[0] * (60000 * 60)) + (timeParts[1] * 60000)), 10);
};

function getLikes() {
  var notRandomNumbers = [1, 1, 1, 2, 2, 2, 3, 3, 4, 4, 5, 6];
  var idx = Math.floor(Math.random() * notRandomNumbers.length);
  return notRandomNumbers[idx];
}

function getReads(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}


function createActorInstances() {
  async.each(actors_list, function(actor_raw, callback) {

    actordetail = {};
    actordetail.profile = {};

    actordetail.profile.name = actor_raw.name
    actordetail.profile.gender = actor_raw.gender;
    actordetail.profile.location = actor_raw.location;
    actordetail.profile.picture = actor_raw.picture;
    actordetail.profile.bio = actor_raw.bio;
    actordetail.profile.age = actor_raw.age;
    actordetail.class = actor_raw.class;
    actordetail.username = actor_raw.username;
    
    var actor = new Actor(actordetail);
         
    actor.save(function (err) {
      if (err) {
        console.log("Something went wrong!!!");
        return -1;
      }
      console.log('New Actor: ' + actor.username);
      callback();
    });

    },
    function(err){
      //return response
      console.log("All DONE!!!")
    }
  );
}

function createPostInstances() {
  async.each(posts_list, function(new_post, callback) {

    Actor.findOne({ username: new_post.bot}, (err, act) => {
        //if (err) { console.log(err); return next(err); }
        console.log("start post for: "+new_post.id);

        if(act)
        {
          console.log('Looking up Actor username is : ' + act.username); 
          var postdetail = new Object();

          postdetail.module = new_post.module;
          postdetail.body = new_post.post

          //only for likes posts
          postdetail.post_id = 4000+new_post.id;

          postdetail.class = new_post.type;
          postdetail.picture = new_post.picture;
          postdetail.likes = new_post.likes || getLikes();
          //postdetail.likes = getLikes();
          postdetail.lowread = getReads(6,20);
          postdetail.highread = getReads(145,203);
          postdetail.actor = act;
          postdetail.time = timeStringToNum(new_post.time);

          //console.log('Looking up Actor: ' + act.username); 
          //console.log(mongoose.Types.ObjectId.isValid(postdetail.actor.$oid));
          //console.log(postdetail);
          
          var script = new Script(postdetail);

          script.save(function (err) {
          if (err) {
            console.log("Something went wrong in Saving POST!!!");
            console.log(err);
             callback(err);
          }
          console.log('Saved New Post: ' + script.id);
          callback();
        });
      }//if ACT

      else
      {
        //Else no ACTOR Found
        console.log("No Actor Found!!!");
        callback();
      }
      console.log("BOTTOM OF SAVE");

      });
    },
      function(err){
        if (err) {
          console.log("END IS WRONG!!!");
          console.log(err);
          callback(err);
        }
        //return response
        console.log("All DONE WITH POSTS!!!")
        //mongoose.connection.close();
      }
  );
}

//replies_list
function createPostRepliesInstances() {
  async.each(replies_list, function(new_replies, callback) {

    console.log("start REPLY for: "+new_replies.id);
    Actor.findOne({ username: new_replies.bot}, (err, act) => {

      if(act)
      {
          Script.findOne({ post_id: 4000+new_replies.post}, function(err, pr){

            if(pr){    
        
              console.log('Looking up Actor ID is : ' + act._id); 
              console.log('Looking up OP POST ID is : ' + pr._id); 
              var postdetail = new Object();
              //postdetail.actor = {};
              postdetail.body = new_replies.reply
              postdetail.post_id = 400 + new_replies.id;
              postdetail.module = new_replies.module;
              //postdetail.class = new_replies.type;
              //postdetail.picture = new_post.picture;
              postdetail.likes = new_replies.likes || getLikes();
              postdetail.lowread = getReads(6,20);
              postdetail.highread = getReads(145,203);
              
              postdetail.actor = act;
              postdetail.reply = pr;
              
              postdetail.time = timeStringToNum(new_replies.time);

              console.log('Looking up Actor: ' + act.username); 
              //console.log(mongoose.Types.ObjectId.isValid(postdetail.actor.$oid));
              //console.log(postdetail);
              
              var script = new Script(postdetail);

              script.save(function (err) {
              if (err) {
                console.log("Something went wrong in Saving POST!!!");
                console.log(err);
                 callback(err);
              }
              console.log('Saved New Post: ' + script.id);
              callback();
            });
            }// if PR

            else
            {
              //Else no ACTOR Found
              console.log("No POST Found!!!");
              callback();
            }
          });//Script.findOne
      }//if ACT

      else
      {
        //Else no ACTOR Found
        console.log("No Actor Found!!!");
        callback();
      }
      console.log("BOTTOM OF SAVE");

      });
    },
      function(err){
        if (err) {
          console.log("END IS WRONG!!!");
          console.log(err);
           callback(err);
        }
        //return response
        console.log("All DONE WITH REPLIES!!!")
        //mongoose.connection.close();
      }
  );
}


/*async.series([
    createPostInstances,
    createPostRepliesInstances
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('ALL DONE - Close now');
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});*/

//createPostInstances()
createPostRepliesInstances()

console.log('After Lookup:');






    //All done, disconnect from database
    //mongoose.connection.close();
