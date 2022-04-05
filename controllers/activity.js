const Activity = require('../models/Activity.js');
const Script = require('../models/Script.js');
const User = require('../models/User');
const _ = require('lodash');

// Search for items in the array that belong to the module,
// Filter to include only the specified keys in the objects of the array. 
// Return the array.
function getfilterObjects(array, properties, module, moduleDBkey) {
    // using reduce, rather than filter + map, is faster.
    return array.reduce(function(newArray, item) {
        if (item[moduleDBkey] === module) {
            newArray.push(_.pick(item, properties))
        }
        return newArray;
    }, []);
}

/**
 * POST /postActivityData
 * Post the activity data in the specified module for a user who has consented
 * to share it
 */
exports.postActivityData = (req, res, next) => {
    const currentTime = Date.now();
    const activityData = new Activity({
        userID: req.user.id,
        module: req.body.module,
        newPosts: [],
        freeplayComments: [],

        chosenTopic: [],
        habitsTimer: [],
        voiceoverTimer: [],
        posts: [],
        pageLog: [],

        startPageAction: [],
        introjsStepAction: [],
        blueDotAction: [],

        accountsAction: [],
        habitsAction: [],
        privacyAction: [],
        chatAction: [],
        tutorialAction: [],
        guidedActivityAction: [],
        feedAction: [],

        reflectionAnswers: [],
        quizAnswers: [],
        viewQuizExplanations: false
    });

    // Need to populate feedAction.post to use its values later.
    User.findById(req.user.id).populate({
            path: 'feedAction.post',
            model: 'Script'
        })
        .exec(function(err, user) {
            const module = req.body.module;

            // Search for posts created by the user in the current module,
            // add body of each post to newPostsArray.
            // Variable will become the value for activityData.newPosts
            const newPostsArray = user.posts
                .filter((post) => post.module === module)
                .map((post) => post.body);

            // Search for comments created by the user in the current module,
            // add body of comments for each post and the postID to freeplayComments.
            // Iterate through feedAction. Each item represents the actions on an existing post.
            const freeplayCommentsArray = [];
            for (const actionsOnPost of user.feedAction) {
                // when post field is undefined, it means user conducted an action a post they made themself
                if (!actionsOnPost.post) {
                    continue;
                }
                // check if post is in the current module
                if (actionsOnPost.post.module !== module) {
                    continue;
                }
                // check if there are any comment-type actions on this post
                if (actionsOnPost.comments.length === 0) {
                    continue;
                }
                const userCreatedComments = [];
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

            // Assign the chosenTopic array according to the current module the user is in.
            const chosenTopicArray =
                (module === "targeted") ? user.targetedAdTopic :
                (module === "esteem") ? user.esteemTopic : [];

            // Assign habitsTimerArray if the module is habits
            const habitsTimerArray =
                (module === "habits") ? user.habitsTimer : [];

            // Variable will become the value for activityData.posts
            const postsArray = getfilterObjects(user.posts, ['postID', 'body', 'picture', 'absTime', 'relativeTime', "_id"], module, 'module');

            // Variable will become the value for activityData.pageLog
            const pageLogArray = getfilterObjects(user.pageLog, ['time', 'subdirectory1'], module, 'subdirectory2');
            pageLogArray.push({
                "time": currentTime,
                "subdirectory1": "end"
            });

            // Variable will become the value for activityData.pageLog
            const startPageActionArray = getfilterObjects(user.startPageAction, ['subdirectory1', 'actionType', 'vocabTerm', 'absoluteTimestamp'], module, 'subdirectory2');

            // Variable will become the value for activityData.introjsStepAction
            const introjsStepActionArray = getfilterObjects(user.introjsStepAction, ['subdirectory1', 'stepNumber', 'viewDuration', 'absoluteStartTime'], module, 'subdirectory2');

            // Variable will become the value for activityData.blueDotAction
            const blueDotActionArray = getfilterObjects(user.blueDotAction, ['subdirectory1', 'dotNumber', 'absoluteTimeOpened', 'viewDuration', 'clickedGotIt'], module, 'subdirectory2');

            // Get actions made in accounts module only if current module is accounts
            // Variable will become the value for activityData.accountsAction
            const accountsActionArray = (module === 'accounts') ?
                getfilterObjects(user.accountsAction, ['subdirectory1', 'inputField', 'inputText', 'passwordStrength', 'absoluteTimestamp'], module, 'subdirectory2') : [];

            // Get actions made in habits module only if current module is habits
            // Variable will become the value for activityData.habitsAction
            const habitsActionArray = (module === 'habits') ? getfilterObjects(user.habitsAction, ['subdirectory1', 'actionType', 'setValue', 'absoluteTimestamp'], module, 'subdirectory2') : [];

            // Get actions made in privacy module only if current module is privacy
            // Variable will become the value for activityData.privacyAction
            const privacyActionArray = (module === 'privacy') ? getfilterObjects(user.privacyAction, ['subdirectory1', 'inputField', 'inputText', 'absoluteTimestamp'], module, 'subdirectory2') : []; // will become the value for activityData.privacyAction

            // Variable will become the value for activityData.chatAction
            const chatActionArray = getfilterObjects(user.chatAction, ['chatId', 'subdirectory1', 'messages', 'minimized', 'closed', 'minimizedTime', 'closedTime'], module, 'subdirectory2');

            // Variable will become the value for activityData.tutorialAction
            const tutorialActionArray =
                getfilterObjects(user.tutorialAction, ['post', 'liked', 'flagged', 'flagTime', 'likeTime', 'replyTime', 'comments'], module, 'modual');

            // Variable will become the value for activityData.guidedActivityAction
            const guidedActivityActionArray =
                getfilterObjects(user.guidedActivityAction, ['post', 'liked', 'flagged', 'flagTime', 'likeTime', 'replyTime', 'modal', 'comments'], module, 'modual');

            // Variable will become the value for activityData.feedAction
            const feedActionArray = getfilterObjects(user.feedAction, ['post', 'liked', 'flagged', 'flagTime', 'likeTime', 'replyTime', 'modal', 'comments'], module, 'modual');
            feedActionArray.map(function(feedAction) {
                if (!feedAction.post) {
                    feedAction.postBody = "user_post"
                    return feedAction;
                }
                feedAction.postID = feedAction.post._id;
                feedAction.postID_num = feedAction.post.post_id;
                feedAction.postBody = feedAction.post.body;

                // For interactions the user had with comments,
                // Find and add the comment text
                feedAction.comments.map(function(comment) {
                    if (!comment.new_comment && feedAction.post.comments.length !== 0) {
                        let comment_obj = feedAction.post.comments.find(post_comment => post_comment._id.equals(comment.comment));
                        let index = feedAction.post.comments.findIndex(post_comment => post_comment._id.equals(comment.comment));
                        comment.comment_index = index;
                        comment.comment_body = comment_obj.body;
                    }
                })
                return feedAction;
            });

            // Variable will become the value for activityData.reflectionAnswers
            const reflectionAnswersArray = getfilterObjects(user.reflectionAction, ['attemptDuration', 'answers'], module, 'modual');

            // Variable will become the value for activityData.quizAnswers
            const quizAnswersArray = getfilterObjects(user.quizAction, ['attemptNumber', 'attemptDuration', 'answers', 'numCorrect'], module, 'modual');

            // Check to see if user viewed quiz explanations in the current module 
            viewQuizExplanationsBoolean = (user.viewQuizExplanations.find(record => record.module === module && record.click === true) !== undefined);

            // update activityData values
            activityData.newPosts = newPostsArray;
            activityData.freeplayComments = freeplayCommentsArray;

            activityData.chosenTopic = chosenTopicArray;
            activityData.habitsTimer = habitsTimerArray;
            activityData.voiceoverTimer = user.voiceoverTimer;

            activityData.posts = postsArray;
            activityData.pageLog = pageLogArray;

            activityData.startPageAction = startPageActionArray;
            activityData.introjsStepAction = introjsStepActionArray;
            activityData.blueDotAction = blueDotActionArray;
            activityData.accountsAction = accountsActionArray;
            activityData.habitsAction = habitsActionArray;
            activityData.privacyAction = privacyActionArray;
            activityData.chatAction = chatActionArray;

            activityData.tutorialAction = tutorialActionArray;
            activityData.guidedActivityAction = guidedActivityActionArray;
            activityData.feedAction = feedActionArray;

            activityData.reflectionAction = reflectionAnswersArray;
            activityData.quizAction = quizAnswersArray;
            activityData.viewQuizExplanations = viewQuizExplanationsBoolean;

            activityData.save((err) => {
                if (err) {
                    return next(err);
                }
                res.send({
                    result: "success"
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