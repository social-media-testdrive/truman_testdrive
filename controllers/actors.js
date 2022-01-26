const Actor = require('../models/Actor.js');
const Script = require('../models/Script.js');
const User = require('../models/User');
const _ = require('lodash');

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
