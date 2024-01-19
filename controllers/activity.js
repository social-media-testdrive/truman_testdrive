const Activity = require('../models/Activity.js');
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
exports.postActivityData = async(req, res, next) => {
    try {
        const module = req.body.module;
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
        const user = await User.findById(req.user.id).populate('feedAction.post').exec();

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

        user.feedAction.reduce(function(newArray, actionsOnPost) {
            if (actionsOnPost.post && actionsOnPost.post.module === module && actionsOnPost.comments.length > 0) {
                const userComments = actionsOnPost.comments.reduce((array, comment) => {
                    if (comment.new_comment) {
                        array.push(comment.comment_body);
                    }
                    return array;
                }, []);
                const postComments = {
                    postID: actionsOnPost.post._id,
                    postBody: actionsOnPost.post.body,
                    userComments: userComments
                }
                newArray.push(postComments);
            }
            return newArray;
        }, freeplayCommentsArray);

        // Assign the chosenTopic array according to the current module the user is in.
        if (module === "targeted") {
            activityData.chosenTopic = user.targetedAdTopic;
        } else if (module === "esteem") {
            activityData.chosenTopic = user.esteemTopic;
        }

        // Assign habitsTimerArray if the module is habits
        if (module === "habits") {
            activityData.habitsTimer = user.habitsTimer;
        }

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
        if (module === "accounts") {
            activityData.accountsAction = getfilterObjects(user.accountsAction, ['subdirectory1', 'inputField', 'inputText', 'passwordStrength', 'absoluteTimestamp'], module, 'subdirectory2');
        }

        // Get actions made in habits module only if current module is habits
        // Variable will become the value for activityData.habitsAction
        if (module === "habits") {
            activityData.habitsAction = getfilterObjects(user.habitsAction, ['subdirectory1', 'actionType', 'setValue', 'absoluteTimestamp'], module, 'subdirectory2');
        }

        // Get actions made in privacy module only if current module is privacy
        // Variable will become the value for activityData.privacyAction
        if (module === "privacy") {
            activityData.privacyAction = getfilterObjects(user.privacyAction, ['subdirectory1', 'inputField', 'inputText', 'absoluteTimestamp'], module, 'subdirectory2');
        }

        // Variable will become the value for activityData.chatAction
        activityData.chatAction = getfilterObjects(user.chatAction, ['chatId', 'subdirectory1', 'messages', 'minimized', 'closed', 'minimizedTime', 'closedTime'], module, 'subdirectory2');

        // Variable will become the value for activityData.tutorialAction
        const tutorialActionArray =
            getfilterObjects(user.tutorialAction, ['post', 'liked', 'flagged', 'shared', 'flagTime', 'likeTime', 'shareTime', 'replyTime', 'comments'], module, 'modual');

        // Variable will become the value for activityData.guidedActivityAction
        const guidedActivityActionArray =
            getfilterObjects(user.guidedActivityAction, ['post', 'liked', 'flagged', 'shared', 'flagTime', 'likeTime', 'shareTime', 'replyTime', 'modal', 'comments'], module, 'modual');

        // Variable will become the value for activityData.feedAction
        const feedActionArray = getfilterObjects(user.feedAction, ['post', 'liked', 'flagged', 'shared', 'flagTime', 'likeTime', 'shareTime', 'replyTime', 'modal', 'comments'], module, 'modual');
        for (let feedAction of feedActionArray) {
            if (!feedAction.post) {
                feedAction.postBody = "user_post"
                continue;
            }
            feedAction.postID = feedAction.post._id;
            feedAction.postID_num = feedAction.post.post_id;
            feedAction.postBody = feedAction.post.body;

            // For interactions the user had with comments,
            // Find and add the comment text
            for (let comment of feedAction.comments) {
                if (!comment.new_comment && feedAction.post.comments.length !== 0) {
                    let comment_obj = feedAction.post.comments.find(post_comment => post_comment._id.equals(comment.comment));
                    let index = feedAction.post.comments.findIndex(post_comment => post_comment._id.equals(comment.comment));
                    comment.comment_index = index;
                    comment.comment_body = comment_obj.body;
                }
            }
        }

        // Variable will become the value for activityData.reflectionAnswers
        const reflectionAnswersArray = getfilterObjects(user.reflectionAction, ['attemptDuration', 'answers'], module, 'modual');
        console.log(reflectionAnswersArray);
        // Variable will become the value for activityData.quizAnswers
        const quizAnswersArray = getfilterObjects(user.quizAction, ['attemptNumber', 'attemptDuration', 'answers', 'numCorrect'], module, 'modual');

        // Check to see if user viewed quiz explanations in the current module 
        viewQuizExplanationsBoolean = (user.viewQuizExplanations.find(record => record.module === module && record.click === true) !== undefined);

        // update activityData values
        activityData.newPosts = newPostsArray;
        activityData.freeplayComments = freeplayCommentsArray;

        activityData.voiceoverTimer = user.voiceoverTimer;

        activityData.posts = postsArray;
        activityData.pageLog = pageLogArray;

        activityData.startPageAction = startPageActionArray;
        activityData.introjsStepAction = introjsStepActionArray;
        activityData.blueDotAction = blueDotActionArray;

        activityData.tutorialAction = tutorialActionArray;
        activityData.guidedActivityAction = guidedActivityActionArray;
        activityData.feedAction = feedActionArray;

        activityData.reflectionAction = reflectionAnswersArray;
        activityData.quizAction = quizAnswersArray;
        activityData.viewQuizExplanations = viewQuizExplanationsBoolean;
        await activityData.save();
        res.send({
            result: "success"
        });
    } catch (err) {
        next(err);
    }
};

/**
 * POST /postDeleteActivityData
 * Search for and remove any activity data in the current module for a user who
 * has chosen not to share it
 */
exports.postDeleteActivityData = async(req, res, next) => {
    try {
        await Activity.deleteOne({
            userID: req.user.id,
            module: req.body.module
        });
        res.send({
            result: "Successfully removed data."
        });
    } catch (err) {
        next(err);
    }
};