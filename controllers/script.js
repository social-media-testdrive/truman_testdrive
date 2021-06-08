const Script = require('../models/Script.js');
const User = require('../models/User');
const Notification = require('../models/Notification');
const _ = require('lodash');

/**
 * GET /habitsNotificationTimes
 * Get the notification timestamps for the habits module
*/
exports.getNotificationTimes = (req, res) => {
  Script.find()
    .where('module').equals('habits')
    .where('type').equals('notification')
    .sort('time')
    .exec(function (err, script_feed) {
      if (err) {
        return next(err);
      }

      var notifTimestampArray = [];
      var notifTextArray = [];
      var notifPhotoArray = [];
      var notifCorrespondingPostArray = [];

      for(var i = 0; i < script_feed.length; i++){
        if (notifTimestampArray){
          notifTimestampArray.push(script_feed[i].time);
          notifTextArray.push(script_feed[i].body);
          notifPhotoArray.push(script_feed[i].picture);
          notifCorrespondingPostArray.push(parseInt(script_feed[i].info_text));
        } else {
          notifTimestampArray = [script_feed[i].time];
          notifTextArray = [script_feed[i].body];
          notifPhotoArray = [script_feed[i].picture];
          notifCorrespondingPostArray = parseInt([script_feed[i].info_text]);
        }
      }
      res.set({'Content-Type': 'application/json; charset=UTF-8'});
      res.json({
        notificationTimestamps: notifTimestampArray,
        notificationText: notifTextArray,
        notificationPhoto: notifPhotoArray,
        notifCorrespondingPost: notifCorrespondingPostArray
      });
    });
};

/*
 GET /getSinglePost/:postId
 Get a single post
*/
exports.getSinglePost = (req, res, next) => {
  Script.findById(req.params.postId)
  .exec(function(err, post){
    if (err) {
      console.log("ERROR");
      console.log(err);
      return next(err);
    }
    if (post == null){
      console.log("NULL");
      var myerr = new Error('Post not found!');
      return next(myerr);
    }
    res.set({'Content-Type': 'application/json; charset=UTF-8'});
    res.json({post: post});
  })
}

/**
 * GET /modual/:modId
 * Creates a list of the posts to show in the freeplay newsfeed
 * and renders the freeplay page.
*/
exports.getScript = (req, res, next) => {
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
    Script.find()
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
      if (err) {
        return next(err);
      }
      // Final array of all posts to go in the freeplay feed
      const finalfeed = [];
      // Array of any user-made posts in this module
      const user_posts = user.getModPosts(req.params.modId);
      // Sort the array by the time the post was created
      user_posts.sort(function (a, b) {
        return b.relativeTime - a.relativeTime;
      });

      // While there are regular posts or user-made posts to add to the final feed
      while(script_feed.length || user_posts.length) {
        if (typeof script_feed[0] === 'undefined') {
            // script_feed is empty, push the first element of user_posts
            finalfeed.push(user_posts[0]);
            // remove the element from user_posts
            user_posts.splice(0,1);
        } else if (!(typeof user_posts[0] === 'undefined') && (script_feed[0].time < user_posts[0].relativeTime)) {
            // There are user-made posts that were created sooner than the post
            // in script_feed, so push them in first
            finalfeed.push(user_posts[0]);
            user_posts.splice(0,1);
        } else {
          // Looking at the post in script_feed[0] now.
          // For this post, check if there is a user feedAction matching this
          // post's ID and get its index.
          const feedIndex = _.findIndex(user.feedAction, function(o) {
            return o.post == script_feed[0].id;
          });
          if (feedIndex != -1) {
            // There was a feedAction found for this post.
            // Perform various checks to determine what actions were taken.
            // Check to see if there are comment-type actions.
            if (Array.isArray(user.feedAction[feedIndex].comments) && user.feedAction[feedIndex].comments) {
              // There are comment-type actions on this post.
              // For each comment on this post, add likes, flags, etc.
              for (var i=0; i < user.feedAction[feedIndex].comments.length; i++) {
                if (user.feedAction[feedIndex].comments[i].new_comment) {
                  // This is a new, user-made comment. Add it to the comments
                  // list for this post.
                  const newComment = new Object();
                  newComment.body = user.feedAction[feedIndex].comments[i].comment_body;
                  newComment.new_comment = user.feedAction[feedIndex].comments[i].new_comment;
                  newComment.time = user.feedAction[feedIndex].comments[i].absTime;
                  newComment.commentID = user.feedAction[feedIndex].comments[i].new_comment_id;
                  newComment.likes = 0;
                  script_feed[0].comments.push(newComment);
                } else {
                  // This is not a new, user-created comment.
                  // Get the comment index that corresponds to the correct comment
                  const commentIndex = _.findIndex(script_feed[0].comments, function(o) {
                    return o.id == user.feedAction[feedIndex].comments[i].comment;
                  });
                  // If this comment's ID is found in script_feed, add likes, flags, etc.
                  if(commentIndex!=-1) {
                    // Check if there is a like recorded for this comment.
                    if (user.feedAction[feedIndex].comments[i].liked) {
                      // Update the comment in script_feed.
                      script_feed[0].comments[commentIndex].liked = true;
                      script_feed[0].comments[commentIndex].likes++;
                    }
                    // Check if there is a flag recorded for this comment.
                    if (user.feedAction[feedIndex].comments[i].flagged) {
                      // Remove the comment from the post if it has been flagged.
                      script_feed[0].comments.splice(commentIndex,1);
                    }
                  }
                }
              }
            }
            // No longer looking at comments on this post.
            // Now we are looking at the main post.
            // Check if there is a like recorded for this post.
            if (user.feedAction[feedIndex].liked) {
              // Update this post in script_feed.
              script_feed[0].like = true;
              script_feed[0].likes++;
            }
            // Check for cases where the post should be removed from script_feed.
            // Check if there is a flag recorded for this post.
            if (user.feedAction[feedIndex].flagTime[0]) {
              // Remove this post from script_feed.
              script_feed.splice(0,1);
            } else if (user.blocked.includes(script_feed[0].actor.username)) {
              // This post was from an account that the user blocked.
              // Remove this post from script_feed.
              // The 'block' feature is not emphasized in TestDrive, but it is present.
              script_feed.splice(0,1);
            } else {
              // There is no reason to remove this post from the feed
              // and we have updated this post with any user actions, so
              // push this post to finalfeed and remove it from script_feed.
              finalfeed.push(script_feed[0]);
              script_feed.splice(0,1);
            }
          } else {
            // At this point, there are no user actions on this post.
            // Check uf this post is not from an account that the user blocked.
            if (user.blocked.includes(script_feed[0].actor.username)) {
              // Remove this post from script_feed.
              // The 'block' feature is not emphasized in TestDrive, but it is present.
              script_feed.splice(0,1);
            } else {
              // There is nothing special to do to this post before adding it
              // to the final feed and removing it from script_feed.
              finalfeed.push(script_feed[0]);
              script_feed.splice(0,1);
            }
          }
        }
      }
      // This seems unnecesary, but commented out rather than removed.
      // TODO: Can remove later if it seems fine.
      // user.save((err) => {
      //   if (err) {
      //     return next(err);
      //   }
      // });

      // Render custom script pages for certain modules, otherwise use the default
      // script page.
      if (req.params.modId == "advancedlit"){
        res.render('advancedlit/advancedlit_script', { script: finalfeed, mod: req.params.modId});
      } else if (req.params.modId == "esteem"){
        res.render('esteem/esteem_script', { script: finalfeed, mod: req.params.modId});
      } else if (req.params.modId == "habits"){
        res.render('habits/habits_script', {
          script: finalfeed,
          mod: req.params.modId,
          habitsStart: user.firstHabitViewTime
        });
      } else if  (req.params.modId == "phishing"){
        res.render('phishing/phishing_script', { script: finalfeed, mod: req.params.modId});
      } else if (req.params.modId == "targeted"){
        res.render('targeted/targeted_script', { script: finalfeed, mod: req.params.modId});
      } else {
        res.render('script', { script: finalfeed, mod: req.params.modId});
      }
    });
  });
};

/**
 * GET /testing/:modId
 * Get list of Script posts for Feed
 * Made for load testing - not sure if it should be deleted
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
      //console.log("Script Size is now: "+finalfeed.length);
      res.render('feed', { script: finalfeed});
    });//end of Script.find()
};//end of .getScript

/**
 * POST /post/new
 * Upload a new user-created post to the database.
 */
exports.newPost = (req, res) => {
  User.findById(req.user.id, (err, user) => {
    if (err) {
      return next(err);
    }
    const post = new Object();
    post.type = "user_post";
    post.body = req.body.body;
    post.picture = req.body.picinput;
    post.module = req.body.module;
    post.absTime = Date.now();
    post.relativeTime = post.absTime - user.createdAt;
    // if numPost/etc never existed yet, make it here - should never happen in new users
    // Note: Not sure if these 3 checks are really needed, but it doesn't seem
    // to hurt to keep them.
    if (!(user.numPosts) && user.numPosts < -1) {
      user.numPosts = -1;
    }
    if (!(user.numReplies) && user.numReplies < -1) {
      user.numReplies = -1;
    }
    if (!(user.numActorReplies) && user.numActorReplies < -1) {
      user.numActorReplies = -1;
    }
    user.numPosts = user.numPosts + 1;
    post.postID = user.numPosts;

    user.posts.unshift(post);

    user.save((err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/modual/'+req.body.module);
    });
  });
};

function _postAction(req, res, next, functionToRun){
  User.findById(req.user.id, (err, user) => {
    if (err) {
      return next(err);
    }

    functionToRun(req, user);

    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          // You should never see this error.
          req.flash('errors', {
            msg: 'Something in feedAction went wrong.'
          });
          return res.redirect('/');
        }
        return next(err);
      }
      res.send({
        result:"success"
      });
    });
  });
}

function _postUpdateFeedAction(req, user){
  let userAction = user.feedAction;
  // Determine where this action occurred and set to record it in the appropriate field.
  switch(req.body.actionType) {
    case 'guided activity':
      userAction = user.guidedActivityAction;
      break;
    case 'tutorial':
      userAction = user.tutorialAction;
      break;
    default:
      userAction = user.feedAction;
      break;
  }

  // Then find the object from the right post in feed.
  let feedIndex = _.findIndex(userAction, function(o) {
    return o.post == req.body.postID;
  });
  if (feedIndex==-1) {
    //Post does not exist yet in User DB, so we have to add it now
    let cat = new Object();

    cat.modual = req.body.modual;
    cat.post = req.body.postID;
    cat.startTime = 0;
    //cat.rereadTimes = 0;
    // add new post into correct location
    feedIndex = userAction.push(cat) - 1;
  }

  // userAction is the correct action array
  // we found the right post
  // and feedIndex is the correct index for that post in the action array

  // interaction with a popup modal
  if (req.body.modalName) {
      let modalInfo = new Object();
      modalInfo.modalOpened = true;
      modalInfo.modalName = req.body.modalName;
      modalInfo.modalOpenedTime = req.body.modalOpenedTime;
      modalInfo.modalViewTime = req.body.modalViewTime;
      modalInfo.modalCheckboxesCount = req.body.modalCheckboxesCount;
      modalInfo.modalCheckboxesInput = req.body.modalCheckboxesInput;
      userAction[feedIndex].modal.push(modalInfo);
  }

  // create a new Comment
  if (req.body.new_comment) {
    let cat = new Object();
    cat.new_comment = true;
    user.numReplies = user.numReplies + 1;
    cat.new_comment_id = user.numReplies;
    cat.comment_body = req.body.comment_text;
    //cat.commentTime = req.body.new_comment - userAction[feedIndex].startTime;

    // create a new cat.comment id for USER replies here to do actions on them. Empty now
    cat.absTime = Date.now();
    // cat.time = cat.absTime - user.createdAt;
    userAction[feedIndex].comments.push(cat);

    //array of replyTime is empty and we have a new (first) REPLY event
    if ((!userAction[feedIndex].replyTime)) {
      userAction[feedIndex].replyTime = [cat.absTime];
    }

    //Already have a replyTime Array, New REPLY event, need to add this to replyTime array
    else if ((userAction[feedIndex].replyTime)) {
      userAction[feedIndex].replyTime.push(cat.absTime);
    }
  }

  // Are we doing anything with an existing comment?
  else if(req.body.commentID) {
    let commentIndex = _.findIndex(userAction[feedIndex].comments, function(o){
      return o.comment == req.body.commentID;
    });

    // no comment in this post-actions yet
    if(commentIndex==-1)
    {
      var cat = new Object();
      cat.comment = req.body.commentID;
      commentIndex = userAction[feedIndex].comments.push(cat) - 1;
    }

    // LIKE A COMMENT
    if(req.body.like)
    {
      let like = req.body.like;
      if (userAction[feedIndex].comments[commentIndex].likeTime) {
        // this is NOT the first like
        userAction[feedIndex].comments[commentIndex].likeTime.push(like);
      } else {
        // this IS the first like
        userAction[feedIndex].comments[commentIndex].likeTime = [like];
      }
      userAction[feedIndex].comments[commentIndex].liked = true;

    }

    // FLAG A COMMENT
    else if(req.body.flag) {
      let flag = req.body.flag;
      if (userAction[feedIndex].comments[commentIndex].flagTime) {
        // this is NOT the first flag
        userAction[feedIndex].comments[commentIndex].flagTime.push(flag);
      } else {
        // this IS the first flag
        userAction[feedIndex].comments[commentIndex].flagTime = [flag];
      }
      userAction[feedIndex].comments[commentIndex].flagged = true;
    }

  } // end of all comment junk

  // else not a comment - it's a post action
  else {

    // array of flagTime is empty and we have a new (first) Flag event
    if ((!userAction[feedIndex].flagTime)&&req.body.flag) {
      let flag = req.body.flag;
      userAction[feedIndex].flagTime = [flag];
      userAction[feedIndex].flagged = true;
    }

    //Already have a flagTime Array, New FLAG event, need to add this to flagTime array
    else if ((userAction[feedIndex].flagTime)&&req.body.flag) {
      let flag = req.body.flag;
      userAction[feedIndex].flagTime.push(flag);
      userAction[feedIndex].flagged = true;
    }

    //array of likeTime is empty and we have a new (first) LIKE event
    else if ((!userAction[feedIndex].likeTime)&&req.body.like) {
      let like = req.body.like;
      userAction[feedIndex].likeTime = [like];
      userAction[feedIndex].liked = true;
    }

    //Already have a likeTime Array, New LIKE event, need to add this to likeTime array
    else if ((userAction[feedIndex].likeTime)&&req.body.like)
    {
      let like = req.body.like;
      userAction[feedIndex].likeTime.push(like);
      userAction[feedIndex].liked = true;
    }

    else {
      //console.log("Got a POST that did not fit anything. Possible Error.")
    }
  }//end of ELSE ANYTHING NOT A COMMENT
}

/**
 * POST /feed
 * Update user's actions on posts throughout a module.
 * All likes, flags, popup interactions, new comments (with actions on those
 * comments as well) get added here
*/
exports.postUpdateFeedAction = (req, res, next) => {
  _postAction(req, res, next, _postUpdateFeedAction);
};

/**
 * POST /deleteUserFeedActions
 * Delete user's feed posts Actions.
 * All likes, flags, new comments (with actions on those comments as well)
 * gets deleted here. This route is currently not used anywhere.
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

/*
 * POST /startPageAction
 * Update an action on the start page
 * TODO: This function should probably be moved to the user controller.
*/
exports.postStartPageAction = (req, res, next) => {

  User.findById(req.user.id, (err, user) => {

    // somehow user does not exist here
    if (err) {
      return next(err);
    }

    // Define the push location
    let userAction = user.startPageAction;

    //Post does not exist yet in User DB, so we have to add it now
    let cat = new Object();

    cat = req.body.action;

    // add new post into correct location
    userAction.push(cat);

    // save to DB
    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', {
            msg: 'Something in startPageAction went crazy. You should never see this.'
          });
          return res.redirect('/');
        }
        return next(err);
      }
      res.send({
        result:"success"
      });
    });
  });
};

/**
 * POST /introjsStep
 * Update log data for a introjs step\
 * TODO: This function should probably be moved to the user controller.
*/
exports.postIntrojsStepAction = (req, res, next) => {

  User.findById(req.user.id, (err, user) => {

    // somehow user does not exist here
    if (err) {
      return next(err);
    }

    // Define the push location in userAction
    let userAction = user.introjsStepAction;

    // create new object to push to the DB
    let cat = new Object();
    cat = req.body.action;

    // add new post into correct location
    userAction.push(cat);

    // save to DB
    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', {
            msg: 'Something in introjsStepAction went crazy. You should never see this.'
          });
          return res.redirect('/');
        }
        return next(err);
      }
      res.send({
        result:"success"
      });
    });
  });
};

/*
 * POST /reflection
 * Update a response in the reflection section
 * Each reflection question gets its own action
 * TODO: This function should probably be moved to the user controller.
*/
exports.postReflectionAction = (req, res, next) => {

  User.findById(req.user.id, (err, user) => {

    // somehow user does not exist here
    if (err) {
      return next(err);
    }

    // Define the push location
    let userAction = user.reflectionAction;

    //Post does not exist yet in User DB, so we have to add it now
    let cat = new Object();
    cat = req.body.action;
    // add new post into correct location
    userAction.push(cat);

    // save to DB
    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', {
            msg: 'Something in reflectionAction went crazy. You should never see this.'
          });
          return res.redirect('/');
        }
        return next(err);
      }
      res.send({
        result:"success"
      });
    });
  });
};

/**
 * POST /blueDot
 * Update a blue dot action
 * TODO: This function should probably be moved to the user controller.
*/
exports.postBlueDotAction = (req, res, next) => {

  User.findById(req.user.id, (err, user) => {

    // somehow user does not exist here
    if (err) {
      return next(err);
    }

    // Define the push location
    let userAction = user.blueDotAction;

    //Post does not exist yet in User DB, so we have to add it now
    let cat = new Object();

    cat.subdirectory1 = req.body.action.subdirectory1;
    cat.subdirectory2 = req.body.action.subdirectory2;
    cat.dotNumber = req.body.action.dotNumber;
    cat.absoluteTimeOpened = req.body.action.absoluteTimeOpened;
    cat.viewDuration = req.body.action.viewDuration;
    cat.clickedGotIt = req.body.action.clickedGotIt;

    // add new post into correct location
    userAction.push(cat);

    // save to DB
    user.save((err) => {
      if (err) {
        if (err.code === 11000) {
          req.flash('errors', {
            msg: 'Something in blueDotAction went crazy. You should never see this.'
          });
          return res.redirect('/');
        }
        return next(err);
      }
      res.send({
        result:"success"
      });
    });
  });
};

/*
 * This does not seem to be used in TestDrive - likely safe to delete.
 * Clean up the corresponding route in app.js as well when this is removed.
 */

// /*
// ##############
// Get WAIT page
// ##############
// */
// exports.getWait = (req, res) => {
//     res.render('wait', { sec: req.params.sec, mod: req.params.modId});
// };
