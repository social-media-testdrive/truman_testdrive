const Script = require('../models/Script.js');
const User = require('../models/User');
const helpers = require('./helpers');
const _ = require('lodash');

/**
 * GET /habitsNotificationTimes
 * Get the notification timestamps for the habits module
 */
exports.getNotificationTimes = async (req, res, next) => {
    try {
        const notifications = await Script.find({
            module: 'habits-esp',
            type: 'notification'
        })
        .sort('time')
        .lean()
        .exec();

        const response = {
            notificationTimestamps: notifications.map(n => n.time),
            notificationText: notifications.map(n => n.body),
            notificationPhoto: notifications.map(n => n.picture),
            notifCorrespondingPost: notifications.map(n => parseInt(n.info_text))
        };

        res.set('Content-Type', 'application/json; charset=UTF-8');
        res.json(response);
    } catch (err) {
        next(err);
    }
};

/**
 * GET /getSinglePost/:postId
 * Get a single post (json object).
 */
exports.getSinglePost = async (req, res, next) => {
    try {
        const post = await Script.findById(req.params.postId)
            .lean()
            .exec();

        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }

        res.set('Content-Type', 'application/json; charset=UTF-8');
        res.json({ post });
    } catch (err) {
        next(err);
    }
};

/**
 * GET /modual/:modId
 * Return list of the posts to show in the freeplay newsfeed and render the freeplay page.
 */
exports.getScript = async (req, res, next) => {
    try {
        const [user, script_feed] = await Promise.all([
            User.findById(req.user.id)
                .populate({
                    path: 'posts.reply',
                    model: 'Script',
                    populate: { path: 'actor', model: 'Actor' }
                })
                .populate({ path: 'posts.actorAuthor', model: 'Actor' })
                .populate({ path: 'posts.comments.actor', model: 'Actor' })
                .populate('feedAction.post')
                .exec(),
            Script.find({ module: req.params.modId })
                .sort('-time')
                .populate('actor')
                .populate({ path: 'comments.actor', model: 'Actor' })
                .exec()
        ]);

        const user_posts = user.getModPosts(req.params.modId)
            .sort((a, b) => b.relativeTime - a.relativeTime);

        const finalfeed = helpers.getFeed(user_posts, script_feed, user);

        // Prepare render data
        const renderData = {
            script: finalfeed,
            mod: req.params.modId,
            title: 'Free Play'
        };

        // Add habits-specific data if needed
        if (req.params.modId.match(/^habits(-esp)?$/)) {
            renderData.habitsStart = user.firstHabitViewTime;
        }

        // Set CSP for safe-posting
        if (req.params.modId === 'safe-posting') {
            res.set({
                'Content-Security-Policy': `script-src 'self' 'unsafe-inline' 'unsafe-eval' https://dhpd030vnpk29.cloudfront.net https://cdnjs.cloudflare.com/ http://cdnjs.cloudflare.com/ https://www.googletagmanager.com https://www.google-analytics.com;
                default-src 'self' https://www.google-analytics.com;
                style-src 'self' 'unsafe-inline' https://dhpd030vnpk29.cloudfront.net https://cdnjs.cloudflare.com/ https://fonts.googleapis.com;
                img-src 'self' https://dhpd030vnpk29.cloudfront.net https://www.googletagmanager.com https://www.google-analytics.com;
                media-src https://dhpd030vnpk29.cloudfront.net;
                font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com/ data:`
            });
        }

        // Determine view to render
        const moduleViews = {
            'advancedlit': 'advancedlit/advancedlit_script',
            'esteem': 'esteem/esteem_script',
            'esteem-esp': 'esteem-esp/esteem-esp_script',
            'habits': 'habits/habits_script',
            'habits-esp': 'habits-esp/habits-esp_script',
            'phishing': 'phishing/phishing_script',
            'phishing-esp': 'phishing-esp/phishing-esp_script',
            'targeted': 'targeted/targeted_script',
            'targeted-esp': 'targeted-esp/targeted-esp_script'
        };

        const view = moduleViews[req.params.modId] || 'script';
        res.render(view, renderData);

    } catch (err) {
        console.error('Error in getScript:', err);
        next(err);
    }
};

/**
 * POST /post/new
 * Add new user post.
 */
exports.newPost = async (req, res, next) => {
    try {
        const { picinput, body, module } = req.body;
        
        if (!picinput || !body) {
            req.flash('errors', { 
                msg: 'ERROR: Your post did not get sent. Please include a photo and a caption.' 
            });
            return res.redirect(`/modual/${module}`);
        }

        const user = await User.findById(req.user.id);
        const currDate = Date.now();

        const post = {
            type: "user_post",
            module,
            postID: ++user.numPosts,
            body,
            picture: picinput,
            absTime: currDate,
            relativeTime: currDate - user.createdAt,
        };

        user.posts.push(post);
        await user.save();
        res.redirect(`/modual/${module}`);

    } catch (err) {
        console.error('Error in newPost:', err);
        next(err);
    }
};

// Shared action handler
async function _postAction(req, res, next, actionFunction) {
    try {
        const user = await User.findById(req.user.id).exec();
        actionFunction(req, user);
        await user.save();
        res.json({ result: "success" });
    } catch (err) {
        next(err);
    }
}

// Feed action handler
function _postUpdateFeedAction(req, user) {
    let userAction;
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

    // Handle user-made posts in free play
    if (typeof req.body.postID !== "undefined" && 
        !req.body.postID.toString().match(/^[0-9a-fA-F]{24}$/) && 
        req.body.actionType === 'free play') {
        const user_post = user.posts.find(post => post.postID.toString() === req.body.postID);
        if (user_post) {
            req.body.postID = user_post.id;
        }
    }

    // Find or create feed action
    let feedIndex = _.findIndex(userAction, o => o.post == req.body.postID);
    if (feedIndex === -1) {
        feedIndex = userAction.push({
            post: req.body.postID,
            modual: req.body.modual
        }) - 1;
    }

    // Handle different action types
    if (req.body.modalName) {
        userAction[feedIndex].modal.push({
            modalName: req.body.modalName,
            modalOpened: true,
            modalOpenedTime: req.body.modalOpenedTime,
            modalViewTime: req.body.modalViewTime,
            modalCheckboxesCount: req.body.modalCheckboxesCount,
            modalCheckboxesInput: req.body.modalCheckboxesInput,
            modalDropdownCount: req.body.modalDropdownCount,
            modalDropdownClick: req.body.modalDropdownClick
        });
    } 
    else if (req.body.new_comment) {
        const newComment = {
            new_comment: true,
            new_comment_id: ++user.numComments,
            comment_body: req.body.comment_text,
            absTime: req.body.new_comment,
        };
        userAction[feedIndex].comments.push(newComment);
        userAction[feedIndex].replyTime.push(newComment.absTime);
    } 
    else if (req.body.commentID) {
        let commentIndex = _.findIndex(userAction[feedIndex].comments, o => o.comment == req.body.commentID);
        if (commentIndex === -1) {
            commentIndex = userAction[feedIndex].comments.push({ comment: req.body.commentID }) - 1;
        }

        if (req.body.like) {
            userAction[feedIndex].comments[commentIndex].likeTime.push(req.body.like);
            userAction[feedIndex].comments[commentIndex].liked = true;
        } 
        else if (req.body.flag) {
            userAction[feedIndex].comments[commentIndex].flagTime.push(req.body.flag);
            userAction[feedIndex].comments[commentIndex].flagged = true;
        }
    } 
    else {
        if (req.body.flag) {
            userAction[feedIndex].flagTime = [req.body.flag];
            userAction[feedIndex].flagged = true;
        } 
        else if (req.body.like) {
            userAction[feedIndex].likeTime.push(req.body.like);
            userAction[feedIndex].liked = true;
        } 
        else if (req.body.share) {
            userAction[feedIndex].shareTime.push(req.body.share);
            userAction[feedIndex].shared = true;
        }
    }
}

/**
 * POST /feed
 * Add user's actions on posts throughout a module.
 */
exports.postUpdateFeedAction = (req, res, next) => {
    _postAction(req, res, next, _postUpdateFeedAction);
};

// Unique feed action handler
function _postUpdateUniqueFeedAction(req, user) {
    let userAction;
    switch (req.body.actionType) {
        case 'accounts':
            userAction = user.accountsAction;
            break;
        case 'habits':
        case 'habits-esp':
            userAction = user.habitsAction;
            break;
        case 'privacy':
            userAction = user.privacyAction;
            break;
        default:
            userAction = user.feedAction;
            break;
    }
    userAction.push(req.body.action);
}

/**
 * POST /habitsAction, /accountsAction, /privacyAction
 * Add user's actions unique to specific modules.
 */
exports.postUpdateUniqueFeedAction = (req, res, next) => {
    _postAction(req, res, next, _postUpdateUniqueFeedAction);
};

// Chat action handler
function _postUpdateChatAction(req, user) {
    let userAction = user.chatAction;
    let feedIndex = _.findIndex(userAction, o => 
        o.chatId == req.body.chatId && o.subdirectory1 === req.body.subdirectory1
    );

    if (feedIndex === -1) {
        feedIndex = userAction.push({
            subdirectory1: req.body.subdirectory1,
            subdirectory2: req.body.subdirectory2,
            chatId: req.body.chatId
        }) - 1;
    }

    if (req.body.message) {
        userAction[feedIndex].messages.push({
            message: req.body.message,
            absTime: req.body.absTime
        });
    } 
    else if (req.body.minimized) {
        userAction[feedIndex].minimized = true;
        userAction[feedIndex].minimizedTime.push(req.body.absTime);
    } 
    else if (req.body.closed) {
        userAction[feedIndex].closed = true;
        userAction[feedIndex].closedTime = req.body.absTime;
    }
}

/**
 * POST /chatAction
 * Add user's actions on chats throughout a module.
 */
exports.postUpdateChatAction = (req, res, next) => {
    _postAction(req, res, next, _postUpdateChatAction);
};

// Generic action handlers
const createActionHandler = (actionField) => 
    async (req, res, next) => {
        try {
            const user = await User.findById(req.user.id).exec();
            user[actionField].push(req.body.action);
            await user.save();
            res.json({ result: "success" });
        } catch (err) {
            next(err);
        }
    };

exports.postStartPageAction = createActionHandler('startPageAction');
exports.postIntrojsStepAction = createActionHandler('introjsStepAction');
exports.postBlueDotAction = createActionHandler('blueDotAction');
exports.postReflectionAction = createActionHandler('reflectionAction');
exports.postQuizAction = createActionHandler('quizAction');
exports.postViewQuizExplanations = createActionHandler('viewQuizExplanations');
