const Script = require('../models/Script.js');
const User = require('../models/User');
const helpers = require('./helpers');
const _ = require('lodash');

/**
 * GET /habitsNotificationTimes
 * Get the notification timestamps for the habits module
 */
exports.getNotificationTimes = async(req, res) => {
    try {
        const script_feed = await Script
            .find()
            .where('module').equals('habits')
            .where('type').equals('notification')
            .sort('time')
            .exec();

        let notifTimestampArray = [];
        let notifTextArray = [];
        let notifPhotoArray = [];
        let notifCorrespondingPostArray = [];

        for (const notification of script_feed) {
            if (notifTimestampArray) {
                notifTimestampArray.push(notification.time);
                notifTextArray.push(notification.body);
                notifPhotoArray.push(notification.picture);
                notifCorrespondingPostArray.push(parseInt(notification.info_text));
            } else {
                notifTimestampArray = [notification.time];
                notifTextArray = [notification.body];
                notifPhotoArray = [notification.picture];
                notifCorrespondingPostArray = parseInt([notification.info_text]);
            }
        }
        res.set({ 'Content-Type': 'application/json; charset=UTF-8' });
        res.json({
            notificationTimestamps: notifTimestampArray,
            notificationText: notifTextArray,
            notificationPhoto: notifPhotoArray,
            notifCorrespondingPost: notifCorrespondingPostArray
        });
    } catch (err) {
        next(err);
    }
};

/**
 * Get /getSinglePost/:postId
 * Get a single post (json object).
 */
exports.getSinglePost = async(req, res, next) => {
    try {
        const post = await Script.find()
            .where(post_id).equals(req.params.postId)
            .exec();
        if (post) {
            res.set({ 'Content-Type': 'application/json; charset=UTF-8' });
            res.json({ post: post });
        }
    } catch (err) {
        next(err);
    }
};

/**
 * GET /modual/:modId
 * Return list of the posts to show in the freeplay newsfeed and render the freeplay page.
 */
exports.getScript = async(req, res, next) => {
    try {
        const user = await User.findById(req.user.id).exec();

        //Get the newsfeed
        let script_feed = await Script.find()
            .where('module').equals(req.params.modId)
            .sort('-time')
            .populate('actor')
            .populate('comments.actor')
            .exec();

        //Array of any user-made posts for this module only.
        let user_posts = user.posts.filter(post => post.module == req.params.modId);

        const finalfeed = helpers.getFeed(user_posts, script_feed, user);

        // Only Advanced Lit has its own defined pug file. All other modules extend 'script'
        if (req.params.modId == "advancedlit") {
            res.render('advancedlit/advancedlit_script', {
                script: finalfeed,
                mod: req.params.modId,
                title: 'Free Play'
            });
        } else if (req.params.modId == "esteem") {
            res.render('esteem/esteem_script', {
                script: finalfeed,
                mod: req.params.modId,
                title: 'Free Play'
            });
        } else if (req.params.modId == "habits") {
            res.render('habits/habits_script', {
                script: finalfeed,
                mod: req.params.modId,
                habitsStart: user.firstHabitViewTime,
                title: 'Free Play'
            });
        } else if (req.params.modId == "targeted") {
            res.render('targeted/targeted_script', {
                script: finalfeed,
                mod: req.params.modId,
                title: 'Free Play'
            });
        } else {
            if (req.params.modId === 'safe-posting') {
                res.set({
                    'Content-Security-Policy': "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://dhpd030vnpk29.cloudfront.net https://cdnjs.cloudflare.com/ http://cdnjs.cloudflare.com/ https://www.googletagmanager.com https://www.google-analytics.com;" +
                        "default-src 'self' https://www.google-analytics.com;" +
                        "style-src 'self' 'unsafe-inline' https://dhpd030vnpk29.cloudfront.net https://cdnjs.cloudflare.com/ https://fonts.googleapis.com;" +
                        "img-src 'self' https://dhpd030vnpk29.cloudfront.net https://www.googletagmanager.com https://www.google-analytics.com;" +
                        "media-src https://dhpd030vnpk29.cloudfront.net;" +
                        "font-src 'self' https://fonts.gstatic.com  https://cdnjs.cloudflare.com/ data:"
                });
            }
            res.render('script', {
                script: finalfeed,
                mod: req.params.modId,
                title: 'Free Play'
            });
        };
    } catch (err) {
        next(err);
    }
}

/**
 * POST /post/new
 * Add new user post.
 */
exports.newPost = async(req, res) => {
    try {
        const user = await User.findById(req.user.id).exec();
        //This is a new post
        if (!req.body.picinput || !req.body.body) {
            req.flash('errors', { msg: 'ERROR: Your post did not get sent. Please include a photo and a caption.' });
            res.redirect('/modual/' + req.body.module);
        } else {
            user.numPosts = user.numPosts + 1; //begins at 0
            const currDate = Date.now();

            const post = {
                type: "user_post",
                module: req.body.module,
                postID: user.numPosts,
                body: req.body.body,
                picture: req.body.picinput,
                absTime: currDate,
                relativeTime: currDate - user.createdAt,
            };

            user.posts.unshift(post); //adds elements to the beginning of the array
            await user.save();
            res.redirect('/modual/' + req.body.module);
        }
    } catch (err) {
        next(err);
    }
};

async function _postAction(req, res, next, functionToRun) {
    try {
        const user = await User.findById(req.user.id).exec();
        functionToRun(req, user);
        await user.save();
        res.send({
            result: "success"
        });
    } catch (err) {
        next(err);
    }
}

function _postUpdateFeedAction(req, user) {
    let userAction;
    // Determine where this action occurred and set to record it in the appropriate field.
    switch (req.body.actionType) {
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

    // Check to see if req.body.postID is a valid ObjectId
    // In the tutorial and sim sections, they are not ObjectIds (ex: 'esteem_tutorial_post1'). 
    // In the free play sections, they are indexes (ex: '0')
    // currently checking using regex; might be better to use mongo's object.isValid() function
    // Check for the special case where the user tries to conduct a feedAction (liking post is the only action available) on a user-made post
    // req.body.postID is an index, such as '0', '1', but to save a feedAction, feedAction's post attribute needs to be an ObjectID
    if (!req.body.postID.toString().match(/^[0-9a-fA-F]{24}$/) && req.body.actionType === 'free play') {
        // Find ObjectID of user-made post
        const user_post = user.posts.find(post => post.postID.toString() === req.body.postID);
        // edit postID's attribute to corresponding ObjectID
        req.body.postID = user_post.id;
    }

    // Then find the object from the right post in feed.
    let feedIndex = _.findIndex(userAction, function(o) {
        return o.post == req.body.postID;
    });
    if (feedIndex == -1) {
        const cat = {
            post: req.body.postID,
            modual: req.body.modual,
        };
        // add new post into correct location
        feedIndex = userAction.push(cat) - 1;
    }

    // Interaction with post is a popup modal
    if (req.body.modalName) {
        const modalInfo = {
            modalName: req.body.modalName,
            modalOpened: true,
            modalOpenedTime: req.body.modalOpenedTime,
            modalViewTime: req.body.modalViewTime,
            modalCheckboxesCount: req.body.modalCheckboxesCount,
            modalCheckboxesInput: req.body.modalCheckboxesInput,
            modalDropdownCount: req.body.modalDropdownCount,
            modalDropdownClick: req.body.modalDropdownClick
        }
        userAction[feedIndex].modal.push(modalInfo);
    }
    //create a new Comment
    else if (req.body.new_comment) {
        user.numComments = user.numComments + 1;
        const cat = {
            new_comment: true,
            new_comment_id: user.numComments,
            comment_body: req.body.comment_text,
            absTime: req.body.new_comment,
        }
        userAction[feedIndex].comments.push(cat);

        //Add to replyTime array.
        userAction[feedIndex].replyTime.push(cat.absTime);
    }
    // Are we doing anything with an existing comment?
    else if (req.body.commentID) {
        let commentIndex = _.findIndex(userAction[feedIndex].comments, function(o) {
            return o.comment == req.body.commentID;
        });

        //no comment in this post-actions yet
        if (commentIndex == -1) {
            const cat = {
                comment: req.body.commentID
            };
            commentIndex = userAction[feedIndex].comments.push(cat) - 1;
        }

        //Like comment
        if (req.body.like) {
            const like = req.body.like;
            userAction[feedIndex].comments[commentIndex].likeTime.push(like);
            userAction[feedIndex].comments[commentIndex].liked = true;
        }

        //Unlike comment
        // if (req.body.unlike) {
        //     const unlike = req.body.unlike;
        //     userAction[feedIndex].comments[commentIndex].unlikeTime.push(unlike);
        //     userAction[feedIndex].comments[commentIndex].liked = false;
        // }

        //Flag comment
        else if (req.body.flag) {
            const flag = req.body.flag;
            userAction[feedIndex].comments[commentIndex].flagTime.push(flag);
            userAction[feedIndex].comments[commentIndex].flagged = true;
        }
    }
    //Not a comment-- Are we doing anything with the post?
    else {
        //Flag post
        if (req.body.flag) {
            const flag = req.body.flag;
            userAction[feedIndex].flagTime = [flag];
            userAction[feedIndex].flagged = true;
        }

        //Like post
        else if (req.body.like) {
            const like = req.body.like;
            userAction[feedIndex].likeTime.push(like);
            userAction[feedIndex].liked = true;
        }

        //Unlike event
        // else if (req.body.unlike) {
        //     const unlike = req.body.unlike;
        //     userAction[feedIndex].unlikeTime.push(unlike);
        //     userAction[feedIndex].liked = false;
        // }

        //Share post
        else if (req.body.share) {
            const share = req.body.share;
            userAction[feedIndex].shareTime.push(share);
            userAction[feedIndex].shared = true;
        } else {
            console.log('Something in feedAction went crazy. You should never see this.');
        }
    }
}

/**
 * POST /feed
 * Add user's actions on posts throughout a module.
 * All likes, flags, popup interactions, new comments (with actions on those
 * comments as well) get added here
 */
exports.postUpdateFeedAction = (req, res, next) => {
    _postAction(req, res, next, _postUpdateFeedAction);
};

function _postUpdateUniqueFeedAction(req, user) {
    let userAction;
    switch (req.body.actionType) {
        case 'accounts':
            userAction = user.accountsAction;
            break;
        case 'habits':
            userAction = user.habitsAction;
            break;
        case 'privacy':
            userAction = user.privacyAction;
            break;
        default:
            userAction = user.feedAction;
            break;
    }

    //Post does not exist yet in User DB, so we have to add it now
    const cat = req.body.action;
    // add new post into correct location
    userAction.push(cat);
}

/**
 * POST /habitsAction, /accountsAction, /privacyAction
 * Add user's actions (that are unique to the module) throughout a module.
 * ex: a user's clicks, input fields on forms, toggles, selections on dropdown menus.
 */
exports.postUpdateUniqueFeedAction = (req, res, next) => {
    _postAction(req, res, next, _postUpdateUniqueFeedAction);
};

function _postUpdateChatAction(req, user) {
    let userAction = user.chatAction;

    // Find the object from the right chat in chatAction.
    let feedIndex = _.findIndex(userAction, function(o) {
        return o.chatId == req.body.chatId && o.subdirectory1 === req.body.subdirectory1;
    });

    if (feedIndex == -1) {
        const cat = {
            subdirectory1: req.body.subdirectory1,
            subdirectory2: req.body.subdirectory2,
            chatId: req.body.chatId
        };
        feedIndex = userAction.push(cat) - 1;
    }
    // message was sent
    if (req.body.message) {
        const cat = {
            message: req.body.message,
            absTime: req.body.absTime
        };
        userAction[feedIndex].messages.push(cat);
    }
    // chat was minimized
    else if (req.body.minimized) {
        const minimizeTime = req.body.absTime;
        userAction[feedIndex].minimized = true;
        userAction[feedIndex].minimizedTime.push(minimizeTime);
    }
    // chat was closed 
    else if (req.body.closed) {
        const closeTime = req.body.absTime;
        userAction[feedIndex].closed = true;
        userAction[feedIndex].closedTime = closeTime;
    }
}

/**
 * POST /chatAction
 * Add user's actions on chats throughout a module.
 * All messages, minimize, and close chat behavior is added here.
 */
exports.postUpdateChatAction = (req, res, next) => {
    _postAction(req, res, next, _postUpdateChatAction);
}

/*
 * POST /startPageAction
 * Add an action on the start page.
 */
exports.postStartPageAction = async(req, res, next) => {
    try {
        const user = await User.findById(req.user.id).exec();
        user.startPageAction.push(req.body.action);
        await user.save();
        res.send({
            result: "success"
        });
    } catch (err) {
        next(err);
    }
};

/**
 * POST /introjsStep
 * Add an action for an introjs step.
 */
exports.postIntrojsStepAction = async(req, res, next) => {
    try {
        const user = await User.findById(req.user.id).exec();
        user.introjsStepAction.push(req.body.action);
        await user.save();
        res.send({
            result: "success"
        });
    } catch (err) {
        next(err);
    }
};

/**
 * POST /blueDot
 * Add a blue dot action.
 */
exports.postBlueDotAction = async(req, res, next) => {
    try {
        const user = await User.findById(req.user.id).exec();
        user.blueDotAction.push(req.body.action);
        await user.save();
        res.send({
            result: "success"
        });
    } catch (err) {
        next(err);
    }
};

/*
 * POST /reflection
 * Add a submission in the reflection section.
 */
exports.postReflectionAction = async(req, res, next) => {
    try {
        const user = await User.findById(req.user.id).exec();
        user.reflectionAction.push(req.body.action);
        await user.save();
        res.send({
            result: "success"
        });
    } catch (err) {
        next(err);
    }
};

/*
 * POST /quiz
 * Add a quiz submission in the quiz section.
 */
exports.postQuizAction = async(req, res, next) => {
    try {
        const user = await User.findById(req.user.id).exec();
        user.quizAction.push(req.body.action);
        await user.save();
        res.send({
            result: "success"
        });
    } catch (err) {
        next(err);
    }
}

/*
 * POST /postViewQuizExplanations
 * Log time user clicked to view quiz explanations.
 * Each click to view quiz explanations gets its own action.
 */
exports.postViewQuizExplanations = async(req, res, next) => {
    try {
        const user = await User.findById(req.user.id).exec();
        user.viewQuizExplanations.push(req.body.viewAction);
        await user.save();
        res.send({
            result: "success"
        });
    } catch (err) {
        next(err);
    }
};