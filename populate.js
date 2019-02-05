#! /usr/bin/env node

console.log('This script is running!!!!');


var async = require('async')
var Actor = require('./models/Actor.js');
var Script = require('./models/Script.js');
var Notification = require('./models/Notification.js');
const _ = require('lodash');
const dotenv = require('dotenv');
var mongoose = require('mongoose');
var fs = require('fs')

//input files
/********
TODO:
Use CSV files instead of json files
use a CSV file reader and use that as input
********/
var actors_list = require('./input/actors.json');
var posts_list = require('./input/posts.json');
var comment_list = require('./input/comments.json');

dotenv.load({ path: '.env' });

var MongoClient = require('mongodb').MongoClient
 , assert = require('assert');


//var connection = mongo.connect('mongodb://127.0.0.1/test');
mongoose.connect(process.env.PRO_MONGODB_URI);
var db = mongoose.connection;
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.');
  process.exit();
});


//capitalize a string
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

//usuful when adding comments to ensure they are always in the correct order
//(based on the time of the comments)
function insert_order(element, array) {
  array.push(element);
  array.sort(function(a, b) {
    return a.time - b.time;
  });
  return array;
}

//Transforms a time like -12:32 (minus 12 minutes and 32 seconds)
//into a time in milliseconds
function timeStringToNum (v) {
  var timeParts = v.split(":");
  if (timeParts[0] =="-0")
    return -1*parseInt(((timeParts[0] * (60000 * 60)) + (timeParts[1] * 60000)), 10);
  else if (timeParts[0].startsWith('-'))
    return parseInt( ((timeParts[0] * (60000 * 60)) + (-1*(timeParts[1] * 60000))), 10);
  else
    return parseInt(((timeParts[0] * (60000 * 60)) + (timeParts[1] * 60000)), 10);
};

//create a radom number (for likes) with a weighted distrubution
//this is for posts
function getLikes() {
  var notRandomNumbers = [1, 1, 1, 2, 2, 2, 3, 3, 4, 4, 5, 6];
  var idx = Math.floor(Math.random() * notRandomNumbers.length);
  return notRandomNumbers[idx];
}

function  randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

//create a radom number (for likes) with a weighted distrubution
//this is for comments
function getLikesComment() {
  var notRandomNumbers = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 3, 4];
  var idx = Math.floor(Math.random() * notRandomNumbers.length);
  return notRandomNumbers[idx];
}

//Create a random number between two values (like when a post needs a number of times it has been read)
function getReads(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

/*************************
createActorInstances:
Creates all the Actors in the simulation
Must be done first!
*************************/
function createActorInstances() {
  async.each(actors_list, function(actor_raw, callback) {

    actordetail = {};
    actordetail.profile = {};

    actordetail.profile.name = actor_raw.name
    actordetail.profile.location = actor_raw.location;
    actordetail.profile.picture = actor_raw.picture;
    actordetail.profile.bio = actor_raw.bio;
    actordetail.profile.age = actor_raw.age;
    //actordetail.class = actor_raw.class;
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

/*************************
createPostInstances:
Creates each post and uploads it to the DB
Actors must be in DB first to add them correctly to the post
*************************/
function createPostInstances() {
  async.each(posts_list, function(new_post, callback) {

    Actor.findOne({ username: new_post.actor}, (err, act) => {
        if (err) { console.log("createPostInstances"); console.log(err); return; }
        console.log("start post for: "+new_post.id);

        if(act)
        {
          console.log('Looking up Actor username is : ' + act.username); 
          var postdetail = new Object();

          postdetail.module = new_post.module;
          postdetail.body = new_post.body

          postdetail.likes = new_post.likes || getLikes();

          //only for likes posts
          postdetail.post_id = new_post.id;

          postdetail.class = new_post.type;
          postdetail.picture = new_post.picture;
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

/*************************
createPostRepliesInstances:
Creates inline comments for each post
Looks up actors and posts to insert the correct comment
Does this in series to insure comments are put in, in correct order
Takes a while because of this
*************************/
function createPostRepliesInstances() {
  async.eachSeries(comment_list, function(new_replies, callback) {

    console.log("start REPLY for: "+new_replies.id);
    Actor.findOne({ username: new_replies.actor}, (err, act) => {

      if(act)
      {
          Script.findOne({ post_id: new_replies.reply}, function(err, pr){

            if(pr){    
        
              console.log('Looking up Actor ID is : ' + act._id); 
              console.log('Looking up OP POST ID is : ' + pr._id); 
              var comment_detail = new Object();
              //postdetail.actor = {};
              comment_detail.body = new_replies.body
              comment_detail.commentID = new_replies.id;
              //comment_detail.class = new_replies.class;
              comment_detail.module = new_replies.module;
                
              comment_detail.likes = getLikesComment();
              comment_detail.time = timeStringToNum(new_replies.time);
              /*1 hr is 3600000
              console.log('Time is of POST is: ' + pr.time); 
              let comment_time = pr.time + randomIntFromInterval(300000,3600000)
              console.log('New Comment time is: ' + comment_time); 
              comment_detail.time = comment_time;
              console.log('NEW NON BULLY Time is : ' + comment_detail.time);
              
              console.log('NEW Time is : ' + comment_detail.time);
              */
              

              console.log('Adding in Actor: ' + act.username);
              comment_detail.actor = act;

              //pr.comments = insert_order(comment_detail, pr.comments);
              //console.log('Comment'+comment_detail.commentID+' on Post '+pr.post_id+' Length before: ' + pr.comments.length); 
              pr.comments.push(comment_detail);
              pr.comments.sort(function(a, b) {return a.time - b.time;});
              //console.log('Comment'+comment_detail.commentID+' on Post '+pr.post_id+' Length After: ' + pr.comments.length); 
              //var script = new Script(postdetail);

              pr.save(function (err) {
              if (err) {
                console.log("@@@@@@@@@@@@@@@@Something went wrong in Saving COMMENT!!!");
                console.log("Error IN: "+new_replies.id);
                console.log('Looking up Actor: ' + act.username);
                 console.log('Looking up OP POST ID: ' + pr._id); 
                console.log('Time is : ' + new_replies.time); 
                console.log('NEW Time is : ' + comment_detail.time);
                console.log(err);
                callback(err);
              }
              console.log('Added new Comment to Post: ' + pr.id);
              callback();
            });
            }// if PR

            else
            {
              //Else no ACTOR Found
              console.log("############Error IN: "+new_replies.id);
              console.log("No POST Found!!!");
              callback();
            }
          });//Script.findOne
      }//if ACT

      else
      {
        //Else no ACTOR Found
        console.log("****************Error IN: "+new_replies.id);
        console.log("No Actor Found!!!");
        callback();
      }
      console.log("BoTTom REPLY for: "+new_replies.id);
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
        console.log("All DONE WITH REPLIES/Comments!!!")
        //mongoose.connection.close();
      }
  );
}

/*
TODO: Create a asych function that runs 
all these functions in serial, in this order
Once all done, stop the program (Be sure to close the mongoose connection)
*/
//createActorInstances()
//createPostInstances()
createPostRepliesInstances()

console.log('All Done');

