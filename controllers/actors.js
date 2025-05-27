const Actor = require('../models/Actor.js');
const Script = require('../models/Script.js');
const User = require('../models/User');
const helpers = require('./helpers');
const _ = require('lodash');

/*
 * GET /user/:actorId
 * Render the profile page for the given actor account.
 */
exports.getActor = async(req, res, next) => {
    try {
        const user = await User.findById(req.user.id).exec();
        const actor = await Actor.findOne({ username: req.params.actorId }).exec();
        if (!actor) {
            const myerr = new Error('Actor not found!');
            return next(myerr);
        }

        //Get the newsfeed
        let script_feed = await Script.find()
            .where('actor').equals(actor._id)
            .sort('-time')
            .populate('actor')
            .populate('comments.actor')
            .exec();

        const finalfeed = helpers.getFeed([], script_feed, user);

        res.render('actor', {
            script: finalfeed,
            actor: actor,
            title: actor.username
        });
    } catch (err) {
        next(err);
    }
};