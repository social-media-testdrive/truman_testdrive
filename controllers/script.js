const Script = require('../models/Script.js');
const User = require('../models/User');
const Notification = require('../models/Notification');
const fs = require('fs')
const _ = require('lodash');
const aws = require('aws-sdk');


/**
 * GET /
 * List of Script posts for Feed
*/
exports.getScript = (req, res, next) => {

  //req.user.createdAt
  var time_now = Date.now();
  var time_diff = time_now;



  var time_limit = time_diff - 86400000;

  var user_ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  var userAgent = req.headers['user-agent'];


  //console.log("$#$#$#$#$#$#$START GET SCRIPT$#$#$$#$#$#$#$#$#$#$#$#$#");
  //console.log("time_diff  is now "+time_diff);
  //console.log("time_limit  is now "+time_limit);

  User.findById(req.user.id)
  .populate({
       path: 'posts.reply',
       model: 'Script',
       populate: {
         path: 'actor',
         model: 'Actor'
       }
    })
  .populate({
       path: 'posts.actorAuthor',
       model: 'Actor'
    })
  .populate({
       path: 'posts.comments.actor',
       model: 'Actor'
    })
  .exec(function (err, user) {

    //log user
    user.logUser(time_now, userAgent, user_ip);


    Script.find()
      //.where('time').lte(time_diff)//.gte(time_limit)
      .where('module').equals(req.params.modId)
      .sort('-time')
      .populate('actor')
      .populate({
       path: 'comments.actor',
       populate: {
         path: 'actor',
         model: 'Actor'
       }
    })
      .exec(function (err, script_feed) {
        if (err) { return next(err); }
        //Successful, so render

        //update script feed to see if reading and posts has already happened
        var finalfeed = [];

        var user_posts = [];

        //Look up Notifications??? And do this as well?

        //user_posts = user.getPostInPeriod(time_limit, time_diff);
        user_posts = user.getModPosts(req.params.modId)

        //console.log("@@@@@@@@@@ User Post is size: "+user_posts.length);

        user_posts.sort(function (a, b) {
            return b.relativeTime - a.relativeTime;
          });

        while(script_feed.length || user_posts.length) {
          //console.log(typeof user_posts[0] === 'undefined');
          //console.log(user_posts[0].relativeTime);
          //console.log(feed[0].time)
          if(typeof script_feed[0] === 'undefined') {
              //console.log("Script_Feed is empty, push user_posts");
              finalfeed.push(user_posts[0]);
              user_posts.splice(0,1);
          }
          else if(!(typeof user_posts[0] === 'undefined') && (script_feed[0].time < user_posts[0].relativeTime)){
              //console.log("Push user_posts");
              finalfeed.push(user_posts[0]);
              user_posts.splice(0,1);
          }
          else{

            //console.log("ELSE PUSH FEED");
            var feedIndex = _.findIndex(user.feedAction, function(o) { return o.post == script_feed[0].id; });


            if(feedIndex!=-1)
            {
              //console.log("WE HAVE AN ACTION!!!!!");

              //check to see if there are comments - if so remove ones that are not in time yet.
              //Do all comment work here for feed
              //if (Array.isArray(script_feed[0].comments) && script_feed[0].comments.length) {
              if (Array.isArray(user.feedAction[feedIndex].comments) && user.feedAction[feedIndex].comments)
              {

                //console.log("WE HAVE COMMENTS!!!!!");
                //iterate over all comments in post - add likes, flag, etc
                for (var i = 0; i < user.feedAction[feedIndex].comments.length; i++) {
                  //i is now user.feedAction[feedIndex].comments index

                    //is this action of new user made comment we have to add???
                    if (user.feedAction[feedIndex].comments[i].new_comment)
                    {

                      //console.log("Adding a new Comment by the USER");
                      var cat = new Object();
                      cat.body = user.feedAction[feedIndex].comments[i].comment_body;
                      cat.new_comment = user.feedAction[feedIndex].comments[i].new_comment;
                      cat.time = user.feedAction[feedIndex].comments[i].time;
                      cat.commentID = user.feedAction[feedIndex].comments[i].new_comment_id;
                      cat.likes = 0;

                      script_feed[0].comments.push(cat);
                      //console.log("Already have COMMENT ARRAY");


                    }

                    else
                    {
                      //Do something

                      var commentIndex = _.findIndex(script_feed[0].comments, function(o) { return o.id == user.feedAction[feedIndex].comments[i].comment; });

                      //If user action on Comment in Script Post
                      if(commentIndex!=-1)
                      {

                        //console.log("WE HAVE AN ACTIONS ON COMMENTS!!!!!");
                        //Action is a like (user liked this comment in this post)
                        if (user.feedAction[feedIndex].comments[i].liked)
                        {
                          script_feed[0].comments[commentIndex].liked = true;
                          script_feed[0].comments[commentIndex].likes++;
                          //console.log("Post %o has been LIKED", script_feed[0].id);
                        }

                        //Action is a FLAG (user Flaged this comment in this post)
                        if (user.feedAction[feedIndex].comments[i].flagged)
                        {
                          //console.log("Comment %o has been LIKED", user.feedAction[feedIndex].comments[i].id);
                          script_feed[0].comments.splice(commentIndex,1);
                        }
                      }
                    }//end of ELSE

                }//end of for loop

              }//end of IF Comments

              if (user.feedAction[feedIndex].readTime[0])
              {
                script_feed[0].read = true;
                script_feed[0].state = 'read';
                //console.log("Post: %o has been READ", script_feed[0].id);
              }
              else
              {
                script_feed[0].read = false;
                //script_feed[0].state = 'read';
              }

              if (user.feedAction[feedIndex].liked)
              {
                script_feed[0].like = true;
                script_feed[0].likes++;
                //console.log("Post %o has been LIKED", script_feed[0].id);
              }

              if (user.feedAction[feedIndex].replyTime[0])
              {
                script_feed[0].reply = true;
                //console.log("Post %o has been REPLIED", script_feed[0].id);
              }

              //If this post has been flagged - remove it from FEED array (script_feed)
              if (user.feedAction[feedIndex].flagTime[0])
              {
                script_feed.splice(0,1);
                //console.log("Post %o has been FLAGGED", script_feed[0].id);
              }

              //post is from blocked user - so remove  it from feed
              else if (user.blocked.includes(script_feed[0].actor.username))
              {
                script_feed.splice(0,1);
              }

              else
              {
                //console.log("Post is NOT FLAGGED, ADDED TO FINAL FEED");
                finalfeed.push(script_feed[0]);
                script_feed.splice(0,1);
              }

            }//end of IF we found Feed_action

            else
            {
              //console.log("NO FEED ACTION SO, ADDED TO FINAL FEED");
              if (user.blocked.includes(script_feed[0].actor.username))
              {
                script_feed.splice(0,1);
              }

              else
              {
                finalfeed.push(script_feed[0]);
                script_feed.splice(0,1);
              }
            }
            }//else in while loop
      }//while loop


      //shuffle up the list
      //finalfeed = shuffle(finalfeed);

      user.save((err) => {
        if (err) {
          //console.log("ERROR IN USER SAVE IS "+err);
          return next(err);
        }
        //req.flash('success', { msg: 'Profile information has been updated.' });
      });

      //console.log("Script Size is now: "+finalfeed.length);
      res.render('script', { script: finalfeed, mod: req.params.modId });

      });//end of Script.find()


  });//end of User.findByID

};//end of .getScript

exports.getScriptPost = (req, res) => {

	Script.findOne({ _id: req.params.id}, (err, post) => {
		//console.log(post);
		res.render('script_post', { post: post });
	});
};


/**
 * GET /
 * List of Script posts for Feed
 * Made for testing
*/
exports.getScriptFeed = (req, res, next) => {


  //console.log("$#$#$#$#$#$#$START GET FEED$#$#$$#$#$#$#$#$#$#$#$#$#");
  //console.log("time_diff  is now "+time_diff);
  //console.log("time_limit  is now "+time_limit);
  //study2_n0_p0
  //console.log("$#$#$#$#$#$#$START GET FEED$#$#$$#$#$#$#$#$#$#$#$#$#");
  var scriptFilter = "";



  var profileFilter = "";
  //study3_n20, study3_n80



  //scriptFilter = req.params.caseId;

  //req.params.modId
  //console.log("#############SCRIPT FILTER IS NOW " + scriptFilter);

  //{

    Script.find()
      //.where('time').lte(time_diff)//.gte(time_limit)
      .where('module').equals(req.params.modId)
      .sort('-time')
      .populate('actor')
      .populate({
       path: 'comments.actor',
       populate: {
         path: 'actor',
         model: 'Actor'
       }
    })
      .exec(function (err, script_feed) {
        if (err) { return next(err); }
        //Successful, so render

        //update script feed to see if reading and posts has already happened
        var finalfeed = [];
        finalfeed = script_feed;


      //shuffle up the list
      //finalfeed = shuffle(finalfeed);


      //console.log("Script Size is now: "+finalfeed.length);
      res.render('feed', { script: finalfeed});

      });//end of Script.find()

};//end of .getScript


/*
##############
Get WAIT page
##############
*/
exports.getWait = (req, res) => {
    res.render('wait', { sec: req.params.sec, mod: req.params.modId});
};

/*
##############
NEW POST
Add a new post to the DB from the user
#############
*/
exports.newPost = (req, res) => {

  //console.log("###########NEW POST#############");
  User.findById(req.user.id, (err, user) => {
    if (err) { return next(err); }


    //console.log("Text Body of Post is "+req.body.body);

    var post = new Object();
    post.body = req.body.body;
    post.module = req.body.module;
    post.absTime = Date.now();
    post.relativeTime = -1000;

    //if numPost/etc never existed yet, make it here - should never happen in new users
    if (!(user.numPosts) && user.numPosts < -1)
    {
      user.numPosts = -1;
      //console.log("numPost is "+user.numPosts);
    }

    if (!(user.numReplies) && user.numReplies < -1)
    {
      user.numReplies = -1;
      //console.log("numReplies is "+user.numReplies);
    }

    if (!(user.numActorReplies) && user.numActorReplies < -1)
    {
      user.numActorReplies = -1;
      //console.log("numActorReplies is "+user.numActorReplies);
    }


    post.picture = req.body.picinput;

    user.numPosts = user.numPosts + 1;
    post.postID = user.numPosts;
    post.type = "user_post";

    //console.log("numPost is now "+user.numPosts);
    user.posts.unshift(post);
    //console.log("CREATING NEW POST!!!");

    user.save((err) => {
          if (err) {
            return next(err);
          }
          /*
          //upload to S3
          aws.config.update({
            secretAccessKey: process.env.AWS_SECRET,
            accessKeyId: process.env.AWS_ACCESS,
            region: "us-east-2"
          });

          const s3 = new aws.S3();
          // call S3 to retrieve upload file to specified bucket
          var uploadParams = {Bucket: 'testdrive-filesystem', Key: '', ACL:'public-read', Body: ''};
          var file = "uploads/user_post/"+req.body.picinput;
          var fileStream = fs.createReadStream(file);
          fileStream.on('error', function(err) {
            console.log('File Error', err);
          });
          uploadParams.Body = fileStream;
          var path = require('path');
          uploadParams.Key = path.basename(req.body.picinput);

          // call S3 to retrieve upload file to specified bucket
          s3.upload (uploadParams, function (err, data) {
            if (err) {
              console.log("Error", err);
            } if (data) {
              console.log("Upload Success to s3", data.Location);
            }
          });*/
          res.redirect('/modual/'+req.body.module);
        });
  });
};

/**
 * POST /feed/
 * Update user's feed posts Actions.
 All likes, flags, new comments (with actions on those comments as well)
 get added here
 */
exports.postUpdateFeedAction = (req, res, next) => {

  User.findById(req.user.id, (err, user) => {
    //somehow user does not exist here
    if (err) { return next(err); }

    //console.log("@@@@@@@@@@@ TOP postID is  ", req.body.postID);

    //find the object from the right post in feed
    var feedIndex = _.findIndex(user.feedAction, function(o) { return o.post == req.body.postID; });

    //console.log("index is  ", feedIndex);

    if(feedIndex==-1)
    {
      //Post does not exist yet in User DB, so we have to add it now
      //console.log("$$$$$Making new feedAction Object! at post ", req.body.postID);
      var cat = new Object();
      cat.post = req.body.postID;
      if(!(req.body.start))
        {
          //console.log("!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!@!No start");
        }
      cat.startTime = 0;
      cat.rereadTimes = 0;
      //add new post into feedAction
      //user.feedAction.push(cat);
      feedIndex = user.feedAction.push(cat) - 1;
      //console.log("##### new index is at index "+ feedIndex);

    }

      //we found the right post, and feedIndex is the right index for it
      //console.log("##### FOUND post "+req.body.postID+" at index "+ feedIndex);

      //create a new Comment
      if(req.body.new_comment)
      {

          var cat = new Object();
          cat.new_comment = true;
          user.numReplies = user.numReplies + 1;
          cat.new_comment_id = user.numReplies;
          cat.comment_body = req.body.comment_text;
          //console.log("Start Time is: "+user.feedAction[feedIndex].startTime);
          //console.log("DATE Time is: "+req.body.new_comment);
          cat.commentTime = req.body.new_comment - user.feedAction[feedIndex].startTime;
          //console.log("Comment Time is: "+cat.commentTime);

          //create a new cat.comment id for USER replies here to do actions on them. Empty now

          cat.absTime = Date.now();
          cat.time = cat.absTime - user.createdAt;
          user.feedAction[feedIndex].comments.push(cat);
          user.feedAction[feedIndex].replyTime = [cat.time];

          //console.log("$#$#$#$#$#$$New  USER COMMENT Time: ", cat.commentTime);
      }

      //Are we doing anything with a comment?
      else if(req.body.commentID)
      {
        var commentIndex = _.findIndex(user.feedAction[feedIndex].comments, function(o) { return o.comment == req.body.commentID; });

        //no comment in this post-actions yet
        if(commentIndex==-1)
        {
          var cat = new Object();
          cat.comment = req.body.commentID;
          user.feedAction[feedIndex].comments.push(cat);
          commentIndex = 0;
        }

        //LIKE A COMMENT
        if(req.body.like)
        {
          let like = req.body.like - user.feedAction[feedIndex].startTime
          //console.log("!!!!!!New FIRST COMMENT LIKE Time: ", like);
          if (user.feedAction[feedIndex].comments[commentIndex].likeTime)
          {
            user.feedAction[feedIndex].comments[commentIndex].likeTime.push(like);

          }
          else
          {
            user.feedAction[feedIndex].comments[commentIndex].likeTime = [like];
            //console.log("!!!!!!!adding FIRST COMMENT LIKE time [0] now which is  ", user.feedAction[feedIndex].likeTime[0]);
          }
          user.feedAction[feedIndex].comments[commentIndex].liked = true;

        }

        //FLAG A COMMENT
        else if(req.body.flag)
        {
          let flag = req.body.flag - user.feedAction[feedIndex].startTime
          //console.log("!!!!!!New FIRST COMMENT flag Time: ", flag);
          if (user.feedAction[feedIndex].comments[commentIndex].flagTime)
          {
            user.feedAction[feedIndex].comments[commentIndex].flagTime.push(flag);

          }
          else
          {
            user.feedAction[feedIndex].comments[commentIndex].flagTime = [flag];
            //console.log("!!!!!!!adding FIRST COMMENT flag time [0] now which is  ", user.feedAction[feedIndex].flagTime[0]);
          }
          user.feedAction[feedIndex].comments[commentIndex].flagged = true;

        }

      }//end of all comment junk

      //not a comment - its a post action
      else
      {


        //array of flagTime is empty and we have a new (first) Flag event
        if ((!user.feedAction[feedIndex].flagTime)&&req.body.flag)
        {
          let flag = req.body.flag - user.feedAction[feedIndex].startTime
          //console.log("!!!!!New FIRST FLAG Time: ", flag);
          user.feedAction[feedIndex].flagTime = [flag];
          //console.log("!!!!!adding FIRST FLAG time [0] now which is  ", user.feedAction[feedIndex].flagTime[0]);
        }

        //Already have a flagTime Array, New FLAG event, need to add this to flagTime array
        else if ((user.feedAction[feedIndex].flagTime)&&req.body.flag)
        {
          let flag = req.body.flag - user.feedAction[feedIndex].startTime
          //console.log("%%%%%Add new FLAG Time: ", flag);
          user.feedAction[feedIndex].flagTime.push(flag);
        }

        //array of likeTime is empty and we have a new (first) LIKE event
        else if ((!user.feedAction[feedIndex].likeTime)&&req.body.like)
        {
          let like = req.body.like - user.feedAction[feedIndex].startTime
          //console.log("!!!!!!New FIRST LIKE Time: ", like);
          user.feedAction[feedIndex].likeTime = [like];
          user.feedAction[feedIndex].liked = true;
          //console.log("!!!!!!!adding FIRST LIKE time [0] now which is  ", user.feedAction[feedIndex].likeTime[0]);
        }

        //Already have a likeTime Array, New LIKE event, need to add this to likeTime array
        else if ((user.feedAction[feedIndex].likeTime)&&req.body.like)
        {
          let like = req.body.like - user.feedAction[feedIndex].startTime
          //console.log("%%%%%Add new LIKE Time: ", like);
          user.feedAction[feedIndex].likeTime.push(like);
          if(user.feedAction[feedIndex].liked)
          {
            user.feedAction[feedIndex].liked = false;
          }
          else
          {
            user.feedAction[feedIndex].liked = true;
          }
        }

        //array of replyTime is empty and we have a new (first) REPLY event
        else if ((!user.feedAction[feedIndex].replyTime)&&req.body.reply)
        {
          let reply = req.body.reply - user.feedAction[feedIndex].startTime
          //console.log("!!!!!!!New FIRST REPLY Time: ", reply);
          user.feedAction[feedIndex].replyTime = [reply];
          //console.log("!!!!!!!adding FIRST REPLY time [0] now which is  ", user.feedAction[feedIndex].replyTime[0]);
        }

        //Already have a replyTime Array, New REPLY event, need to add this to replyTime array
        else if ((user.feedAction[feedIndex].replyTime)&&req.body.reply)
        {
          let reply = req.body.reply - user.feedAction[feedIndex].startTime
          //console.log("%%%%%Add new REPLY Time: ", reply);
          user.feedAction[feedIndex].replyTime.push(reply);
        }

        else
        {
          //console.log("Got a POST that did not fit anything. Possible Error.")
        }
      }//end of ELSE ANYTHING NOT A COMMENT

       //console.log("####### END OF ELSE post at index "+ feedIndex);


    //console.log("@@@@@@@@@@@ ABOUT TO SAVE TO DB on Post ", req.body.postID);
    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'Something in feedAction went crazy. You should never see this.' });
          return res.redirect('/');
        }
        return next(err);
      }

      res.send({result:"success"});
    });
  });
};




/**
 * POST /deleteUserFeedActions/
 * Delete user's feed posts Actions.
 All likes, flags, new comments (with actions on those comments as well)
 gets deleted here
 */
exports.postDeleteFeedAction = (req, res, next) => {
  //console.log("Deleting user feed posts Actions")
  User.findById(req.user.id, (err, user) => {
    //somehow user does not exist here
    if (err) { return next(err); }
    //console.log("@@@@@@@@@@@  /deleteUserFeedActions req body  ", req.body);

    user.feedAction =[];
    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', { msg: 'Something in delete feedAction went crazy. You should never see this.' });
          return res.redirect('/');
        }
        return next(err);
      }
      res.send({result:"success"});
    });
  });
};
