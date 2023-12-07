// const Script = require('../models/Script.js');
// const User = require('../models/User');
// const Notification = require('../models/Notification.js');
// const helpers = require('./helpers');
// const _ = require('lodash');

// /**
//  * GET /notifications, /getBell
//  * List of notifications to display
//  */
// exports.getNotifications = async(req, res) => {
//     try {
//         if (req.user) {
//             const user = await User.findById(req.user.id)
//                 .populate('posts.comments.actor')
//                 .populate({
//                     path: 'feedAction.post',
//                     populate: {
//                         path: 'actor'
//                     }
//                 }).exec();
//             const currDate = Date.now();
//             const lastNotifyVisit = user.lastNotifyVisit; //Absolute Date
//             const notification_feed = await Notification.find({ $or: [{ userPostID: { $lte: user.numPosts } }, { userReply: { $lte: user.numComments } }] })
//                 .populate('actor')
//                 .sort('-time')
//                 .exec();

//             let final_notify = [];
//             for (const notification of notification_feed) {
//                 //Notification is about a userPost (read, like, comment)
//                 if (notification.userPostID >= 0) {
//                     const userPostID = notification.userPostID;
//                     const userPost = user.posts.find(x => x.postID == userPostID);

//                     if (userPost == undefined) {
//                         console.log("Should never be here.");
//                         continue;
//                     }

//                     const time_diff = currDate - userPost.absTime; //Time difference between now and the time post was created.

//                     //check if we show this notification yet
//                     if (notification.time <= time_diff) {
//                         if (notification.notificationType == "reply") {
//                             const replyKey = "actorReply_" + userPostID;
//                             const reply_tmp = {
//                                 key: replyKey,
//                                 action: 'reply',
//                                 postID: userPostID,
//                                 body: userPost.body,
//                                 picture: userPost.picture,
//                                 replyBody: notification.replyBody,
//                                 time: userPost.absTime.getTime() + notification.time,
//                                 actor: notification.actor,
//                                 unreadNotification: userPost.absTime.getTime() + notification.time > lastNotifyVisit,
//                             };
//                             final_notify.push(reply_tmp);
//                         } //end of REPLY 
//                         else {
//                             const key = notification.notificationType + "_" + userPostID; //like_X, read_X
//                             //Check if a notification for this post exists already
//                             let notifyIndex = _.findIndex(final_notify, function(o) { return o.key == key });
//                             if (notifyIndex == -1) {
//                                 let tmp = {
//                                     key: key,
//                                     action: notification.notificationType,
//                                     postID: userPostID,
//                                     body: userPost.body,
//                                     picture: userPost.picture,
//                                     time: userPost.absTime.getTime() + notification.time,
//                                     actors: [notification.actor],
//                                     unreadNotification: userPost.absTime.getTime() + notification.time > lastNotifyVisit
//                                 }
//                                 if (notification.notificationType == 'like') {
//                                     tmp.numLikes = 1
//                                 }
//                                 notifyIndex = final_notify.push(tmp) - 1;
//                             } else {
//                                 //Update notification like count.
//                                 if (notification.notificationType == 'like') {
//                                     final_notify[notifyIndex].numLikes += 1;
//                                 }
//                                 //Update notification actor profile
//                                 //if generic-joe, append. else, shift to the front of the line.
//                                 if (notification.notificationType == "read" && notification.actor.username == "generic-joe") {
//                                     final_notify[notifyIndex].actors.push(notification.actor);
//                                 } else {
//                                     final_notify[notifyIndex].actors.unshift(notification.actor);
//                                 }
//                                 //Update notification time and read/unread classification
//                                 if ((userPost.absTime.getTime() + notification.time) > final_notify[notifyIndex].time) {
//                                     final_notify[notifyIndex].time = userPost.absTime.getTime() + notification.time;
//                                 }
//                                 if ((userPost.absTime.getTime() + notification.time) > lastNotifyVisit) {
//                                     final_notify[notifyIndex].unreadNotification = true;
//                                 }
//                             }
//                             //Update the number of likes on user post
//                             if (notification.notificationType == 'like') {
//                                 const postIndex = _.findIndex(user.posts, function(o) { return o.postID == userPostID; });
//                                 user.posts[postIndex].likes = final_notify[notifyIndex].numLikes;
//                             }
//                         } //end of LIKE or READ
//                     } //end of userPost (read, like, comment)
//                 } //Notification is about a userReply (read, like)
//                 else if (notification.userReply >= 0) {
//                     const userReplyID = notification.userReply;
//                     const userReply_userPost = user.posts.find(post => post.comments.find(comment => comment.commentID == userReplyID && comment.new_comment == true) !== undefined);
//                     const userReply_actorPost_feedAction = user.feedAction.find(feedAction => feedAction.comments.find(comment => comment.new_comment_id == userReplyID && comment.new_comment == true) !== undefined);
//                     let userReply_actorPost;
//                     if (userReply_actorPost_feedAction) {
//                         userReply_actorPost = userReply_actorPost_feedAction.post;
//                     }
//                     const userReply_originalPost = userReply_userPost || userReply_actorPost;

//                     const postType = userReply_originalPost.relativeTime ? "user" : "actor";
//                     const userPostID = (postType == "user") ? userReply_originalPost.postID : userReply_originalPost._id;
//                     const userReply_comment = (postType == "user") ?
//                         userReply_originalPost.comments.find(comment => comment.commentID == userReplyID && comment.new_comment == true) :
//                         userReply_actorPost_feedAction.comments.find(comment => comment.new_comment_id == userReplyID && comment.new_comment == true);

//                     const time = userReply_comment.absTime.getTime();
//                     const time_diff = currDate - time; //Time difference between now and the time comment was created.
//                     //check if we show this notification yet
//                     if (notification.time <= time_diff) {
//                         const key = "reply_" + notification.notificationType + "_" + userReplyID; //reply_like_X, reply_read_X
//                         //Check if a notification for this comment exists already
//                         let notifyIndex = _.findIndex(final_notify, function(o) { return o.key == key });
//                         if (notifyIndex == -1) {
//                             let tmp = {
//                                 key: key,
//                                 action: "reply_" + notification.notificationType,
//                                 postID: userPostID,
//                                 replyID: userReplyID,
//                                 body: userReply_comment.body,
//                                 picture: userReply_originalPost.picture,
//                                 time: time + notification.time,
//                                 actors: [notification.actor],
//                                 originalActor: postType == "user" ? { profile: user.profile } : userReply_originalPost.actor,
//                                 unreadNotification: time + notification.time > lastNotifyVisit
//                             }
//                             if (notification.notificationType == 'like') {
//                                 tmp.numLikes = 1;
//                             }
//                             notifyIndex = final_notify.push(tmp) - 1;
//                         } else {
//                             //Update notification like count.
//                             if (notification.notificationType == 'like') {
//                                 final_notify[notifyIndex].numLikes += 1;
//                             }
//                             //Update notification actor profile
//                             //if generic-joe, append. else, shift to the front of the line.
//                             if (notification.notificationType == "read" && notification.actor.username == "generic-joe") {
//                                 final_notify[notifyIndex].actors.push(notification.actor);
//                             } else {
//                                 final_notify[notifyIndex].actors.unshift(notification.actor);
//                             }
//                             //Update notification time and read/unread classification
//                             if (time + notification.time > final_notify[notifyIndex].time) {
//                                 final_notify[notifyIndex].time = time + notification.time;
//                             }
//                             if (time + notification.time > lastNotifyVisit) {
//                                 final_notify[notifyIndex].unreadNotification = true;
//                             }
//                         }
//                         if (notification.notificationType == 'like') {
//                             if (postType == "user") {
//                                 const postIndex = _.findIndex(user.posts, function(o) { return o.postID == userPostID; });
//                                 const commentIndex = _.findIndex(user.posts[postIndex].comments, function(o) { return o.commentID == userReplyID && o.new_comment == true });
//                                 user.posts[postIndex].comments[commentIndex].likes = final_notify[notifyIndex].numLikes;
//                             } else {
//                                 const postIndex = _.findIndex(user.feedAction, function(o) { return o.post.equals(userPostID); });
//                                 const commentIndex = _.findIndex(user.feedAction[postIndex].comments, function(o) { return o.new_comment_id == userReplyID && o.new_comment == true });
//                                 user.feedAction[postIndex].comments[commentIndex].likes = final_notify[notifyIndex].numLikes;
//                             }
//                         }
//                     }
//                 }
//             } //end of for FOR LOOP

//             final_notify.sort(function(a, b) {
//                 return b.time - a.time;
//             });

//             const userPosts = user.getPosts().slice(0) || [];

//             const repliesOnActorPosts = user.feedAction
//                 .filter(post => (post.comments.filter(comment => comment.new_comment == true).length) > 0)
//                 .map(post => post.post); // IDs of actor posts user has commented on.       
//             const posts = await Script.find({
//                     _id: { "$in": repliesOnActorPosts }
//                 })
//                 .populate('actor')
//                 .populate('comments.actor')
//                 .exec();
//             const finalfeed = helpers.getFeed(userPosts, posts, user, 'NOTIFICATION');
//             //Log our visit to Notifications
//             if (!req.query.bell) {
//                 user.lastNotifyVisit = currDate;
//             }
//             await user.save();

//             const newNotificationCount = final_notify.filter(notification => notification.unreadNotification == true).length;
//             if (req.query.bell) {
//                 return res.send({ count: newNotificationCount });
//             } else {
//                 return res.render('notification', {
//                     notification_feed: final_notify,
//                     script: finalfeed,
//                     count: newNotificationCount
//                 })
//             }
//         };
//     } catch (err) {
//         next(err);
//     }
// }