const _ = require('lodash');

/**
 * Helper function, called in .getNotifications (notifications controller), .getScript (script controller), .getActor (actor controller)
 * Takes in user and actor post objects, outputs a final feed with objects reflecting recorded user action and behavior
 * Arguments: 
 *  - user_posts: list of user posts, from user.posts
 *  - script_feed: list of script (actor) posts, from Script.find(...)
 *  - user: User document
 * Returns: 
 *  - finalfeed: the final feed
 * Notes: 
 *  - Feed is NOT shuffled. 
 *  - Flagged posts ARE removed from the final feed returned.
 */

exports.getFeed = function(user_posts, script_feed, user) {
    //Final array of all posts to go in the feed
    let finalfeed = [];

    //While there are regular posts or user-made posts to add to the final feed
    while (script_feed.length || user_posts.length) {
        // If there are no more script_feed posts
        // Or if user_post[0] post is more recent than script_feed[0] post. 
        // Note: In TestDrive, all free-play posts are simulated to be (-). Therefore, all user_posts are more recent than script_feed posts.
        if (script_feed[0] === undefined ||
            ((user_posts[0] !== undefined) && (script_feed[0].time < user_posts[0].relativeTime))) {
            // Check if there is a user feedAction (in TestDrive, liking post is the only action available on a user-made post) on user post by matching this post's ID and get its index.
            const feedIndex = _.findIndex(user.feedAction, function(o) {
                return o.post == user_posts[0].id;
            });

            if (feedIndex != -1) {
                // There was a feedAction found for this post.
                // Check if there is a like recorded for this post.
                if (user.feedAction[feedIndex].liked) {
                    // Update this post in script_feed.
                    user_posts[0].liked = true;
                }
            }
            finalfeed.push(user_posts[0]);
            // remove the element from user_posts
            user_posts.splice(0, 1);
        } else {
            //Looking at the post in script_feed[0] now.
            //For this post, check if there is a user feedAction matching this post's ID and get its index.
            const feedIndex = _.findIndex(user.feedAction, function(o) { return o.post.equals(script_feed[0].id) });
            if (feedIndex != -1) {
                //User performed an action with this post
                //Check to see if there are comment-type actions.
                if (Array.isArray(user.feedAction[feedIndex].comments) && user.feedAction[feedIndex].comments) {
                    //There are comment-type actions on this post.
                    //For each comment on this post, add likes, flags, etc.
                    for (const commentObject of user.feedAction[feedIndex].comments) {
                        if (commentObject.new_comment) {
                            // This is a new, user-made comment. Add it to the comments
                            // list for this post.
                            const cat = {
                                commentID: commentObject.new_comment_id,
                                body: commentObject.comment_body,
                                time: commentObject.absTime,

                                new_comment: commentObject.new_comment
                            };
                            script_feed[0].comments.push(cat);
                        } else {
                            // This is not a new, user-created comment.
                            // Get the comment index that corresponds to the correct comment
                            const commentIndex = _.findIndex(script_feed[0].comments, function(o) { return o.id == commentObject.comment; });
                            // If this comment's ID is found in script_feed, add likes, flags, etc.
                            if (commentIndex != -1) {
                                // Check if there is a like recorded for this comment.
                                if (commentObject.liked) {
                                    // Update the comment in script_feed.
                                    script_feed[0].comments[commentIndex].liked = true;
                                    script_feed[0].comments[commentIndex].likes++;
                                }
                                // Check if there is a flag recorded for this comment.
                                if (commentObject.flagged) {
                                    // Remove the comment from the post if it has been flagged.
                                    script_feed[0].comments.splice(commentIndex, 1);
                                }
                            }
                        }
                    }
                }
                // script_feed[0].comments.sort(function(a, b) {
                //     return a.time - b.time;
                // });
                // No longer looking at comments on this post.
                // Now we are looking at the main post.
                // Check if there is a like recorded for this post.
                if (user.feedAction[feedIndex].liked) {
                    script_feed[0].like = true;
                    script_feed[0].likes++;
                }
                // Check if post has been flagged: remove it from feed array (script_feed)
                if (user.feedAction[feedIndex].flagTime[0]) {
                    script_feed.splice(0, 1);
                } else {
                    // There is no reason to remove post and we have updated this post with any user feedActions. 
                    // Push post to finalfeed and remove it from script_feed.
                    finalfeed.push(script_feed[0]);
                    script_feed.splice(0, 1);
                }
            } //user did not interact with this post
            else {
                finalfeed.push(script_feed[0]);
                script_feed.splice(0, 1);
            }
        }
    }

    return finalfeed;
};