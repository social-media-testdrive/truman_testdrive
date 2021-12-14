const Actor = require('../models/Actor.js');
const Script = require('../models/Script.js');
const User = require('../models/User');
const _ = require('lodash');

/*
 * GET /user/:userId
 * Render the profile page for the given actor account.
 */
exports.getActor = (req, res, next) => {
    // const time_diff = Date.now() - req.user.createdAt;

    User.findById(req.user.id)
        .exec(function(err, user) {
            Actor.findOne({ username: req.params.userId }, (err, act) => {
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
                Script.find({ actor: act.id })
                    // .where('-time').lte(-time_diff) uncommented because modual sections display all posts by an actor, regardless of when the user was created in relation to the time of an actor's post
                    .sort('-time')
                    .populate('actor')
                    .populate({
                        path: 'comments.actor',
                        populate: {
                            path: 'actor',
                            model: 'Actor'
                        }
                    })
                    .exec(function(err, script_feed) {
                        if (err) {
                            return next(err);
                        }

                        // Final array of all posts to go in the actor's profile page feed
                        const finalfeed = [];

                        const name = script_feed[0].actor.profile.name;

                        // While there are actor posts to add to the final feed
                        while (script_feed.length) {
                            // For this actor post, check if there is a user feedAction (user action) matching this post's ID and get its index
                            const feedIndex = _.findIndex(user.feedAction, function(o) {
                                return o.post == script_feed[0].id;
                            });

                            // There wasn't a feedAction found for this post
                            if (feedIndex === -1) {
                                // We do not check to see if the actor has been blocked before adding the post to the final feed, because we want all the actor's posts to still be available to be rendered on page. If the user decides to unblock the actor, it can still be displayed.-- Also, irrelevant, because we don't use the blocking feature in TD.
                                finalfeed.push(script_feed[0]);
                                script_feed.splice(0, 1);
                                continue;
                            }
                            // There was a feedAction found for this post. 
                            // Perform various checks to determine what actions were taken. 
                            // Check to see if there are comment-type actions. 
                            if (Array.isArray(user.feedAction[feedIndex].comments) && user.feedAction[feedIndex].comments) {
                                // There are comment-type actions on this post. 
                                // For each comment on this post, add likes, flags, etc. 
                                for (var i = 0; i < user.feedAction[feedIndex].comments.length; i++) {
                                    if (user.feedAction[feedIndex].comments[i].new_comment) {
                                        // This is a new, user-made comment. Add it to the comments list for this post.
                                        const userComment = user.feedAction[feedIndex].comments[i];
                                        const newComment = {};
                                        newComment.body = userComment.comment_body;
                                        newComment.new_comment = userComment.new_comment;
                                        newComment.time = userComment.absTime;
                                        newComment.commentID = userComment.new_comment_id;
                                        newComment.likes = 0;
                                        script_feed[0].comments.push(newComment);
                                    } else {
                                        // This is not a new, user-created comment. 
                                        // Get the comment index that corresponds to the correct comment 
                                        const commentIndex = _.findIndex(script_feed[0].comments, function(o) {
                                            return o.id == user.feedAction[feedIndex].comments[i].comment;
                                        });
                                        // If this comment's ID is found in script_feed, add likes, flags, etc.
                                        if (commentIndex != -1) {
                                            // Check if there is a like recorded for this comment.
                                            if (user.feedAction[feedIndex].comments[i].liked) {
                                                // Update the comment in script_feed.
                                                script_feed[0].comments[commentIndex].liked = true;
                                                script_feed[0].comments[commentIndex].likes++;
                                            }
                                            // Check if there is a flag recorded for this comment.
                                            if (user.feedAction[feedIndex].comments[i].flagged) {
                                                // Remove the comment from the post if it has been flagged.
                                                script_feed[0].comments.splice(commentIndex, 1);
                                            }
                                        }
                                    }
                                }
                            }

                            // No longer looking at comments on this post. 
                            // Now we are looking at the main post. 
                            // Check if there is a like recorded for this post.
                            if (user.feedAction[feedIndex].liked) {
                                // Update the post in script_feed.
                                script_feed[0].like = true;
                                script_feed[0].likes++;
                            }
                            // Check for cases where the post should be removed from script_feed
                            // Check if there is a flag action recorded for this post.
                            if (user.feedAction[feedIndex].flagTime[0]) {
                                // Remove this post from script_feed.
                                script_feed.splice(0, 1);
                            }
                            // There is no need to check if the user is blocked, because if the user is blocked entirely, all posts will be hidden 
                            else {
                                // There is no reason to remove this post from the feed and we have updated this post with user actions, so push this post to finalfeed and remove it from script_feed.
                                finalfeed.push(script_feed[0]);
                                script_feed.splice(0, 1);
                            }
                        }
                        res.render('actor', {
                            script: finalfeed,
                            actor: act,
                            blocked: isBlocked,
                            title: name
                        });
                    });
            });
        });
};