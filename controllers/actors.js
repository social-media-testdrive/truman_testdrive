const Actor = require('../models/Actor.js');
const Script = require('../models/Script.js');
const User = require('../models/User');
var ObjectId = require('mongoose').Types.ObjectId;
const _ = require('lodash');


exports.getActors = (req, res) => {
  Actor.find((err, docs) => {
    res.render('actors', { actors: docs });
  });
};

/*
 * GET /user/:userId
 * Render the profile page for the given actor account.
 */
exports.getActor = (req, res, next) => {
  const time_diff = Date.now() - req.user.createdAt;

  User.findById(req.user.id).exec(function (err, user) {
  	Actor.findOne({ username: req.params.userId}, (err, act) => {
      if (err) {
        return next(err);
      }
      if (act == null) {
        const myerr = new Error('Record not found!');
        return next(myerr);
      }
      // Determine if this actor has been blocked by the user.
      let isBlocked = false;
      if (user.blocked.includes(req.params.userId)) {
        isBlocked = true;
      }
      Script.find({ actor: act.id})
      .where('time').lte(time_diff)
      .sort('-time')
      .populate('actor')
      .populate({
       path: 'reply',
       populate: {
         path: 'actor',
         model: 'Actor'
         }
      })
      .exec(function (err, script_feed) {
        if (err) {
          return next(err);
        }
        for (var i = script_feed.length - 1; i >= 0; i--) {
          const feedIndex = _.findIndex(user.feedAction, function(o) {
            return o.post == script_feed[i].id;
          });
          if(feedIndex === -1) {
            continue;
          }
          // Check if there is a like recorded for this post.
          if (user.feedAction[feedIndex].liked) {
            // Update the post in script_feed.
            script_feed[i].like = true;
            script_feed[i].likes++;
          }
          // Check if there is a flag action recorded for this post.
          if (user.feedAction[feedIndex].flagTime[0]) {
            // Remove this post from script_feed.
            script_feed.splice(i,1);
          }
        }
        res.render('actor', {
          script: script_feed,
          actor: act,
          blocked: isBlocked
        });
      });
    });
  });
};

/*
 * These functions do not seem to be used in TestDrive - likely safe to delete.
 * Clean up the corresponding routes in app.js as well when they are removed.
 */

 // /**
 //  * GET /
 //  * List of Actors.
 //  */
 // exports.index = (req, res) => {
 //   res.render('home', {
 //     title: 'Home'
 //   });
 // };

// /**
//  * POST /feed/
//  * Update user's feed posts Actions.
//  */
// exports.postBlockOrReport = (req, res, next) => {
//
//   User.findById(req.user.id, (err, user) => {
//     //somehow user does not exist here
//     if (err) { return next(err); }
//
//     //if we have a blocked user and they are not already in the list, add them now
//     if (req.body.blocked && !(user.blocked.includes(req.body.blocked)))
//     {
//       user.blocked.push(req.body.blocked);
//
//       var log = {};
//       log.time = Date.now();
//       log.action = "block";
//       log.actorName = req.body.blocked
//       user.blockAndReportLog.push(log);
//     }
//
//     //if we have a reported user and they are not already in the list, add them now
//     else if (req.body.reported && !(user.reported.includes(req.body.reported)))
//     {
//       //console.log("@@@Reporting a user now")
//       user.reported.push(req.body.reported);
//       var log = {};
//       log.time = Date.now();
//       log.action = "report";
//       log.actorName = req.body.reported;
//       log.report_issue = req.body.report_issue;
//       user.blockAndReportLog.push(log);
//     }
//
//     else if (req.body.unblocked && user.blocked.includes(req.body.unblocked))
//     {
//       var index = user.blocked.indexOf(req.body.unblocked);
//       user.blocked.splice(index, 1);
//
//       var log = {};
//       log.time = Date.now();
//       log.action = "unblock";
//       log.actorName = req.body.unblocked
//       user.blockAndReportLog.push(log);
//     }
//
//
//     user.save((err) => {
//       if (err) {
//         return next(err);
//       }
//       res.send({result:"success"});
//     });
//   });
// };
