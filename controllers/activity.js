const Activity = require('../models/Activity.js');
const Script = require('../models/Script.js');
const User = require('../models/User');
const _ = require('lodash');

// Returns an array of objects that belongs to the module specified
// and that only keep the properties specified
function getfilterObjects(array, properties, module, moduleDBkey) {
    if (array === undefined) {
        return [];
    }
    const filteredArray = array.filter(item => item[moduleDBkey] == module);
    const result = filteredArray.map(item => _.pick(item, properties));
    return result;
}

/**
 * POST /postActivityData
 * Post the activity data in the specified module for a user who has consented
 * to share it
 */
exports.postActivityData = (req, res, next) => {
    const activityData = new Activity({
        userID: req.user.id,
        module: req.body.module,
        newPosts: [],
        freeplayComments: [],

        chosenTopic: [],
        habitsTimer: [],
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

            const newPostsArray = []; // will become the value for activityData.newPosts
            const freeplayCommentsArray = []; // will become the value for activityData.freeplayComments

            const chatActionArray = []; // wil become the value for activityData.chatAction
            const tutorialActionArray = []; // wil become the value for activityData.tutorialAction
            const guidedActivityActionArray = []; // wil become the value for activityData.guidedActivityAction
            const feedActionArray = []; // wil become the value for activityData.feedAction

            // const reflectionAnswersArray = []; // will become the value for activityData.reflectionAnswers
            // const quizAnswersArray = []; // will become the value for activityData.quizAnswers
            // let viewQuizExplanationsBoolean = false; // will become the value for activityData.checkQuizAnswers

            // Search for posts created by the user in the current module,
            // add body of each post to newPostsArray.
            for (const newPosts of user.posts) {
                if (newPosts.module === module) {
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

            const chosenTopicArray = (module === "targeted") ? user.targetedAdTopic : (module === "esteem") ? user.esteemTopic : []; // will become the value for activityData.chosenTopic

            const habitsTimerArray = (module === "habits") ? user.habitsTimer : []; // will become the value for activityData.habitsTimer

            const postsArray = getfilterObjects(user.posts, ['body', 'picture'], module, 'module'); // will become the value for activityData.posts

            const pageLogArray = getfilterObjects(user.pageLog, ['time', 'subdirectory1'], module, 'subdirectory2'); // will become the value for activityData.pageLog

            const startPageActionArray = getfilterObjects(user.pageLog, ['subdirectory1', 'actionType', 'vocabTerm', 'absoluteTimestamp']); // will become the value for activityData.startPageAction

            const introjsStepActionArray = getfilterObjects(user.introjsStepAction, ['subdirectory1', 'stepNumber', 'viewDuration'], module, 'subdirectory2'); // will become the value for activityData.introjsStepAction

            const blueDotActionArray = getfilterObjects(user.blueDotAction, ['subdirectory1', 'dotNumber', 'viewDuration', 'clickedGotIt'], module, 'subdirectory2'); // will become the value for activityData.blueDotAction

            const accountsActionArray = (module === 'accounts') ? getfilterObjects(user.accountsAction, ['subdirectory1', 'inputField', 'inputText', 'passwordStrength'], module, 'subdirectory2') : []; // will become the value for activityData.accountsAction

            const habitsActionArray = (module === 'habits') ? getfilterObjects(user.habitsAction, ['subdirectory1', 'actionType', 'setValue'], module, 'subdirectory2') : []; // will become the value for activityData.habitsAction

            const privacyActionArray = (module === 'privacy') ? getfilterObjects(user.privacyAction, ['subdirectory1', 'inputField', 'inputText'], module, 'subdirectory2') : []; // will become the value for activityData.privacyAction

            for (const chatAction of user.chatAction) {
                // check if post is in the current module
                if (chatAction.subdirectory2 !== module) {
                    continue;
                }
                let cat = _.pick(chatAction, ['chatId', 'subdirectory1', 'minimized', 'closed', 'minimizedTime', 'closedTime']);
                const userMessages = chatAction.messages.map(item => item.message);
                cat.messages = userMessages;
                chatActionArray.push(cat);
            }

            for (const tutorialAction of user.tutorialAction) {
                // check if post is in the current module
                if (tutorialAction.modual !== module) {
                    continue;
                }
                let cat = _.pick(tutorialAction, ['post', 'liked', 'flagged']);
                const userComments = _.pick(tutorialAction.comments, ['comment', 'liked', 'flagged', 'new_comment', 'new_comment_id', 'comment_body']);
                cat.comments = userComments;
                tutorialActionArray.push(cat);
            }

            for (const guidedActivityAction of user.guidedActivityAction) {
                // check if post is in the current module
                if (guidedActivityAction.modual !== module) {
                    continue;
                }
                let cat = _.pick(guidedActivityAction, ['post', 'liked', 'flagged']);
                const userModals = _.pick(guidedActivityAction.modal, ['modalName', 'modalOpened', 'modalViewTime', 'modalCheckboxesCount', 'modalCheckboxesInput', 'modalDropdownCount', 'modalDropdownClick']);
                const userComments = _.pick(guidedActivityAction.comments, ['comment', 'liked', 'flagged', 'new_comment', 'new_comment_id', 'comment_body']);
                cat.modal = userModals;
                cat.comments = userComments;
                guidedActivityActionArray.push(cat);
            }

            for (const feedAction of user.feedAction) {
                // check if post is in the current module
                if (feedAction.modual !== module) {
                    continue;
                }
                let cat = _.pick(feedAction, ['liked', 'flagged']);
                const userModals = _.pick(feedAction.modal, ['modalName', 'modalOpened', 'modalViewTime', 'modalCheckboxesCount', 'modalCheckboxesInput', 'modalDropdownCount', 'modalDropdownClick']);
                const userComments = _.pick(feedAction.comments, ['comment', 'liked', 'flagged', 'new_comment', 'new_comment_id', 'comment_body']);
                cat.modal = userModals;
                cat.comments = userComments;
                cat.postID = feedAction.post._id;
                cat.postBody = feedAction.post.body;
                feedActionArray.push(cat);
            }

            const reflectionActionArray = getfilterObjects(user.reflectionAction, ['attemptDuration', 'answers'], module, 'modual') // will become the value for activityData.reflectionAction

            const quizActionArray = getfilterObjects(user.quizAction, ['attemptNumber', 'attemptDuration', 'answers', 'numCorrect'], module, 'modual') // will become the value for activityData.quizAction

            // Check to see if user viewed quiz explanations in the current module 
            viewQuizExplanationsBoolean = (user.viewQuizExplanations.find(record => record.module === module && record.click === true) !== undefined)

            // update activityData values
            activityData.newPosts = newPostsArray;
            activityData.freeplayComments = freeplayCommentsArray;

            activityData.chosenTopic = chosenTopicArray;
            activityData.habitsTimer = habitsTimerArray;

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
            activityData.guidedActivityAction = guidedActivityAction;
            activityData.feedAction = feedActionArray;

            activityData.reflectionAnswers = reflectionAnswersArray;
            activityData.quizAnswers = quizAnswersArray;
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