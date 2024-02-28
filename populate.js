const color_start = '\x1b[33m%s\x1b[0m'; // yellow
const color_success = '\x1b[32m%s\x1b[0m'; // green
const color_error = '\x1b[31m%s\x1b[0m'; // red

console.log(color_start, 'Started populate.js script...');

const async = require('async');
const Actor = require('./models/Actor.js');
const Script = require('./models/Script.js');
const _ = require('lodash');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const CSVToJSON = require("csvtojson");
/** 
 * Input Files:
 * Use CSV files instead of json files. Use a CSV file reader and use that as input.
 */
async function readData() {
    try {
        //synchronously read all csv files and convert them to JSON
        await console.log("Start reading data from .csv files")
        actors_list = await CSVToJSON().fromFile('./input/bots.csv');
        posts_list = await CSVToJSON().fromFile('./input/allposts.csv');
        comment_list = await CSVToJSON().fromFile('./input/allreplies.csv');

        //synchronously write all converted JSON output to .json files incase for future use
        // fs.writeFileSync("./input/bots.json", JSON.stringify(actors_list));
        // fs.writeFileSync("./input/allposts.json", JSON.stringify(posts_list));
        // fs.writeFileSync("./input/allreplies.json", JSON.stringify(comment_list));
        await console.log("Converted data to json.");
    } catch (err) {
        console.log('Error occurred in reading data from csv files.', err);
    }
}

dotenv.config({ path: '.env' });

mongoose.connect(process.env.PRO_MONGODB_URI, { useNewUrlParser: true });
const db = mongoose.connection;
mongoose.connection.on('error', (err) => {
    console.error(err);
    console.log('%s MongoDB connection error. Please make sure MongoDB is running.');
    process.exit(1);
});

/**
 * Drop existing collections before loading to make sure we don't overwrite the data in case we run the script twice or more.
 */
function dropCollections() {
    return new Promise((resolve, reject) => { //Drop the actors collection
        console.log(color_start, "Dropping actors...");
        db.collections['actors'].drop(function(err) {
            console.log(color_success, 'Actors collection dropped');
            resolve("done");
        });
    }).then(function(result) { //Drop the scripts collection
        return new Promise((resolve, reject) => {
            console.log(color_start, "Dropping scripts...");
            db.collections['scripts'].drop(function(err) {
                console.log(color_success, 'Scripts collection dropped');
                resolve("done");
            });
        });
    })
}

//Capitalize a string
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

//Useful when adding comments to ensure they are always in the correct order
//(based on the time of the comments)
function insert_order(element, array) {
    array.push(element);
    array.sort(function(a, b) {
        return a.time - b.time;
    });
    return array;
}

//Transforms a time like -12:32 (minus 12 minutes and 32 seconds)
//into a time in milliseconds
function timeStringToNum(v) {
    var timeParts = v.split(":");
    if (timeParts[0] == "-0")
        return -1 * parseInt(((timeParts[0] * (60000 * 60)) + (timeParts[1] * 60000)), 10);
    else if (timeParts[0].startsWith('-'))
        return parseInt(((timeParts[0] * (60000 * 60)) + (-1 * (timeParts[1] * 60000))), 10);
    else if (timeParts.length == 3)
        return parseInt(((timeParts[0] * (60000 * 60)) + (timeParts[1] * 60000) + (timeParts[2] * 1000)), 10);
    else
        return parseInt(((timeParts[0] * (60000 * 60)) + (timeParts[1] * 60000)), 10);
};

//Return a radom number (for likes) with a weighted distrubution
//this is for posts
function getLikes() {
    var notRandomNumbers = [1, 1, 1, 2, 2, 2, 3, 3, 4, 4, 5, 6];
    var idx = Math.floor(Math.random() * notRandomNumbers.length);
    return notRandomNumbers[idx];
}

//Return a radom number (for likes) with a weighted distrubution
//this is for comments
function getLikesComment() {
    var notRandomNumbers = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 3, 4];
    var idx = Math.floor(Math.random() * notRandomNumbers.length);
    return notRandomNumbers[idx];
}

/*************************
createActorInstances:
Creates all the Actors in the simulation.
Must be done first!
*************************/
function createActorInstances() {
    return new Promise((resolve, reject) => {
        async.each(actors_list, async function(actor_raw, callback) {
                actordetail = {
                    profile: {
                        name: actor_raw.name,
                        age: actor_raw.age,
                        location: actor_raw.location,
                        bio: actor_raw.bio,
                        picture: actor_raw.picture,
                    },
                    username: actor_raw.username
                };

                const actor = new Actor(actordetail);
                try {
                    await actor.save();
                } catch (err) {
                    console.log(color_error, "ERROR: Something went wrong with saving actor in database");
                    next(err);
                }
            },
            function(err) {
                if (err) {
                    console.log(color_error, "ERROR: Something went wrong with saving actors in database");
                    callback(err);
                }
                // Return response
                console.log(color_success, "All actors added to database!")
                resolve('Promise is resolved successfully.');
                return 'Loaded Actors';
            }
        );
    });
}

/*************************
createPostInstances:
Creates each post and uploads it to the DB.
Actors must be in DB first to add them correctly to the post.
*************************/
function createPostInstances() {
    return new Promise((resolve, reject) => {
        async.each(posts_list, async function(new_post, callback) {
                const act = await Actor.findOne({ username: new_post.actor }).exec();
                if (act) {
                    const postdetail = {
                        body: new_post.body,
                        post_id: new_post.id,
                        module: new_post.module,
                        type: new_post.type,
                        picture: new_post.picture,
                        likes: new_post.likes || getLikes(),
                        info_text: new_post.info_text,
                        actor: act,

                        time: timeStringToNum(new_post.time)
                    }

                    const script = new Script(postdetail);
                    try {
                        await script.save();
                    } catch (err) {
                        console.log(color_error, "ERROR: Something went wrong with saving post in database");
                        next(err);
                    }
                } else { //Else no actor found
                    console.log(color_error, "ERROR: Actor not found in database");
                    console.log(new_post);
                    console.log(new_post.actor);
                    console.log(new_post.id);
                    callback();
                }
            },
            function(err) {
                if (err) {
                    console.log(color_error, "ERROR: Something went wrong with saving posts in database");
                    callback(err);
                }
                // Return response
                console.log(color_success, "All posts added to database!")
                resolve('Promise is resolved successfully.');
                return 'Loaded Posts';
            }
        );
    });
}

/*************************
createPostRepliesInstances:
Creates inline comments for each post.
Looks up actors and posts to insert the correct comment.
Does this in series to ensure comments are put in, in correct order.
Takes a while because of this.
*************************/
function createPostRepliesInstances() {
    return new Promise((resolve, reject) => {
        async.eachSeries(comment_list, async function(new_reply, callback) {
                const act = await Actor.findOne({ username: new_reply.actor }).exec();
                if (act) {
                    const pr = await Script.findOne({ post_id: new_reply.reply }).exec();
                    if (pr) {
                        const comment_detail = {
                            module: new_reply.module,
                            actor: act,
                            body: new_reply.body,
                            commentID: new_reply.id,
                            time: timeStringToNum(new_reply.time),
                            likes: getLikesComment(),
                        };

                        pr.comments.push(comment_detail);
                        pr.comments.sort(function(a, b) { return a.time - b.time; });

                        try {
                            await pr.save();
                        } catch (err) {
                            console.log(color_error, "ERROR: Something went wrong with saving reply in database");
                            next(err);
                        }
                    } else { //Else no post found
                        console.log(color_error, "ERROR: Post not found in database");
                        console.log(new_reply);
                        console.log(new_reply.reply);
                        callback();
                    }

                } else { //Else no actor found
                    console.log(color_error, "ERROR: Actor not found in database");
                    callback();
                }
            },
            function(err) {
                if (err) {
                    console.log(color_error, "ERROR: Something went wrong with saving replies in database");
                    callback(err);
                }
                // Return response
                console.log(color_success, "All replies added to database!");
                mongoose.connection.close();
                resolve('Promise is resolved successfully.');
                return 'Loaded Replies';
            }
        );
    });
}

/**
 * Async function that runs all functions in serial in order. 
 * Once all done, mongoose connection is closed.
 */
async function loadDatabase() {
    try {
        await readData(); //read data from csv files and convert it to json for loading
        await dropCollections(); //drop existing collecions before loading data
        await console.log(color_start, "Starting to populate actors collection...");
        await createActorInstances();
        await console.log(color_start, "Starting to populate posts collection...");
        await createPostInstances();
        await console.log(color_start, "Starting to populate post replies...");
        await createPostRepliesInstances();
    } catch (err) {
        console.log('Error occurred in Loading', err);
    }
}

loadDatabase();