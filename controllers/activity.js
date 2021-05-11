const Activity = require('../models/Activity.js');
const Script = require('../models/Script.js');
const User = require('../models/User');

/**
 * POST /postActivityData
 * Post the activity data in the specified module for a user who has consented
 * to share it
 */
exports.postActivityData = (req, res, next) => {
  let activityData = new Activity ({
    userID: req.user.id,
    module: req.body.module,
    newPosts: [],
    freeplayComments: []
  });

  // Need to populate feedAction.post to use its values later.
  User.findById(req.user.id).populate({
    path: 'feedAction.post',
    model: 'Script'
  })
  .exec(function (err, user){
    let newPostsArray = []; // will become the value for activityData.newPosts
    let freeplayCommentsArray = []; // will become the value for activityData.freeplayComments
    // Search for posts created by the user in the current module,
    // add body of each post to newPostsArray.
    for (const newPosts of user.posts){
      if(newPosts.module === req.body.module){
        newPostsArray.push(newPosts.body);
      }
    }
    // Search for comments created by the user in the current module,
    // add body of comments for each post and the postID to freeplayComments.
    // Iterate through feedAction. Each item represents the actions on an existing post.
    for (const actionsOnPost of user.feedAction) {
      // check if post field exists before using it, it is supposed to exist but
      // there is a bug where it is sometimes missing
      if (!actionsOnPost.post) {
        continue;
      }
      // check if post is in the current module
      if (actionsOnPost.post.module !== req.body.module) {
        continue;
      }
      // check if there are any comment-type actions on this post
      if (actionsOnPost.comments.length === 0) {
        continue;
      }
      let userCreatedComments = [];
      // iterate through the comment-type actions to find any user-created comments
      for (const comment of actionsOnPost.comments) {
        if (comment.new_comment) {
          // this is a user-created comment
          userCreatedComments.push(comment.comment_body)
        }
      }
      // check if any user-created comments were found
      if (userCreatedComments.length > 0) {
        // create a new object to push to freeplayCommentsArray
        const postComments = {
          postID: actionsOnPost.post._id,
          postBody: actionsOnPost.post.body,
          userComments: userCreatedComments
        }
        freeplayCommentsArray.push(postComments);
      }
    }
    // update activityData values
    activityData.newPosts = newPostsArray;
    activityData.freeplayComments = freeplayCommentsArray;

    activityData.save((err) => {
      if (err) {
        return next(err);
      }
      res.send({
        result:"success"
      });
    });
  });
};

/**
 * POST /postDeleteActivityData
 * Search for and remove any activity data in the current module for a user who
 * has chosen not to share it
 */
exports.postDeleteActivityData = (req, res, next) => {
  Activity.remove({
    userID: req.user.id,
    module: req.body.module
  }, (err) => {
    if (err) {
      return next(err);
    }
    res.send({
      result: "successfully removed data"
    });
  });
};
