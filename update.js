const color_start = '\x1b[33m%s\x1b[0m'; // yellow
const color_success = '\x1b[32m%s\x1b[0m'; // green
const color_error = '\x1b[31m%s\x1b[0m'; // red

console.log(color_start, 'Started update.js script...');

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

        postDictionary = getPostDictionary(posts_list);
        [postToCommentDictionary, commentDictionary] = getPostToCommentDictionary(comment_list);

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
 * Returns array, where the first element of the array contains the usernames of all actors in the database currently, 
 * and the second element of the array contains the post_ids of all the scripts in the database currently. 
 */
function getUniqueIdentifiersOfObjects(actors, scripts) {
    const ret = [actors.map(actor => actor.username), scripts.map(script => parseInt(script.post_id) || parseInt(script.id))];
    return ret;
}

/**
 * Returns a dictionary where the key is the postID of a post, and the value is the object of post information, from .csv file.
 */
function getPostDictionary(posts_list) {
    let dictionary = {};
    for (const post of posts_list) {
        const postID = post.id;
        dictionary[postID] = post;
    }
    return dictionary;
}

/**
 * Returns:
 * 0: A dictionary where the key is the postID of a post, and the value is an array of commentIDs of the comments belonging to that post.
 * 1: A dictionary where the key is the commentID of a comment, and the value is the object of comment information, from .csv file.
 */
function getPostToCommentDictionary(comment_list) {
    let postToCommentDictionary = {};
    let dictionary = {};
    for (const reply of comment_list) {
        const replyID = reply.id;
        const postID = reply.reply;
        if (postToCommentDictionary.hasOwnProperty(postID)) {
            postToCommentDictionary[postID].push(parseInt(replyID));
        } else {
            postToCommentDictionary[postID] = [parseInt(replyID)];
        }
        dictionary[replyID] = reply;
    }
    return [postToCommentDictionary, dictionary];
}


//Capitalize a string
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
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
createPostInstances:
Creates each post and uploads it, along with comments, to the DB.
*************************/
function createPostInstances(toAdd_PostIDs) {
    return new Promise((resolve, reject) => {
        async.each(toAdd_PostIDs, async function(postID, callback) {
                const post = postDictionary[postID];
                const act = await Actor.findOne({ username: post.actor }).exec();
                if (act) {
                    let postdetail = {
                        body: post.body,
                        post_id: post.id,
                        module: post.module,
                        type: post.type,
                        picture: post.picture,
                        likes: post.likes || getLikes(),
                        info_text: post.info_text,
                        actor: act,

                        time: timeStringToNum(post.time)
                    }

                    const newCommentIDs = postToCommentDictionary[post.id] || [];
                    let comments = [];

                    for (const commentID of newCommentIDs) {
                        const comment = commentDictionary[commentID];
                        const act2 = await Actor.findOne({ username: comment.actor }).exec();
                        const comment_detail = {
                            module: comment.module,
                            actor: act2,
                            body: comment.body,
                            commentID: comment.id,
                            time: timeStringToNum(comment.time),
                            likes: getLikesComment(),
                        };

                        comments.push(comment_detail);
                        comments.sort(function(a, b) { return a.time - b.time; });
                    }
                    postdetail.comments = comments;

                    const script = new Script(postdetail);
                    try {
                        await script.save();
                        await console.log("Added new postID: " + postID);
                    } catch (err) {
                        console.log(color_error, "ERROR: Something went wrong with saving post in database");
                        next(err);
                    }
                } else { //Else no actor found
                    console.log(color_error, "ERROR: Actor not found in database");
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
updatePostInstances:
Updates each post and saves it to the DB.
*************************/
function updatePostInstances(toUpdate_PostIDs) {
    return new Promise((resolve, reject) => {
        async.each(toUpdate_PostIDs, async function(postID, callback) {
                const scripts = await Script.find({ post_id: postID }).exec();
                for (let i = 1; i < scripts.length; i++) {
                    const script_objID = scripts[i]._id;
                    await Script.deleteOne({ _id: script_objID }).exec();
                    console.log(postID);
                }
                const script = scripts[0];
                const post = postDictionary[postID];
                const act = await Actor.findOne({ username: post.actor }).exec();
                if (script && act) {
                    script.body = post.body;
                    script.post_id = post.id;
                    script.module = post.module;
                    script.type = post.type;
                    script.picture = post.picture;
                    script.likes = post.likes || getLikes();
                    script.info_text = post.info_text;
                    script.actor = act;
                    script.lowread = undefined;
                    script.highread = undefined;

                    script.time = timeStringToNum(post.time);

                    const existingCommentIDs = script.comments.map(comment => comment.commentID) || [];
                    const newCommentIDs = postToCommentDictionary[post.id] || [];

                    const toUpdate_CommentIDs = existingCommentIDs.filter(x => newCommentIDs.includes(x));
                    const toDelete_CommentIDs = existingCommentIDs.filter(x => !newCommentIDs.includes(x));
                    const toAdd_CommentIDs = newCommentIDs.filter(x => !existingCommentIDs.includes(x));

                    for (const commentID of toUpdate_CommentIDs) {
                        let commentIndex = _.findIndex(script.comments, function(o) {
                            return o.commentID == commentID;
                        });
                        const comment = commentDictionary[commentID];
                        const act2 = await Actor.findOne({ username: comment.actor }).exec();

                        script.comments[commentIndex].module = comment.module;
                        script.comments[commentIndex].actor = act2;
                        script.comments[commentIndex].body = comment.body;
                        script.comments[commentIndex].commentID = comment.id;
                        script.comments[commentIndex].time = timeStringToNum(comment.time);
                        script.comments[commentIndex].likes = getLikesComment();
                    }

                    for (const commentID of toDelete_CommentIDs) {
                        let commentIndex = _.findIndex(script.comments, function(o) {
                            return o.commentID == commentID;
                        });
                        script.comments.splice(commentIndex);
                        await console.log("Deleted commentID: " + commentID);
                    }

                    for (const commentID of toAdd_CommentIDs) {
                        const comment = commentDictionary[commentID];
                        const act2 = await Actor.findOne({ username: comment.actor }).exec();
                        const comment_detail = {
                            module: comment.module,
                            actor: act2,
                            body: comment.body,
                            commentID: comment.id,
                            time: timeStringToNum(comment.time),
                            likes: getLikesComment(),
                        };

                        script.comments.push(comment_detail);
                        script.comments.sort(function(a, b) { return a.time - b.time; });
                        await console.log("Added commentID: " + commentID);
                    }

                    try {
                        await script.save();
                        await console.log("Updated existing postID: " + postID);
                    } catch (err) {
                        console.log(color_error, "ERROR: Something went wrong with updating post in database");
                        next(err);
                    }
                } else { //Else no actor found
                    console.log(color_error, "ERROR: Actor or Post not found in database");
                    callback();
                }
            },
            function(err) {
                if (err) {
                    console.log(err);
                    console.log(color_error, "ERROR: Something went wrong with updating post in database");
                    callback(err);
                }
                // Return response
                console.log(color_success, "All posts updated in database!")
                resolve('Promise is resolved successfully.');
                return 'Loaded Posts';
            }
        );
    });
}

/*************************
deletePostInstances:
Deletes each post and saves it to the DB.
*************************/
function deletePostInstances(toDelete_PostIDs) {
    return new Promise((resolve, reject) => {
        async.each(toDelete_PostIDs, async function(postID, callback) {
                await Script.deleteOne({ post_id: postID }).exec();
                await console.log("Deleted existing postID: " + postID);
            },
            function(err) {
                if (err) {
                    console.log(err);
                    console.log(color_error, "ERROR: Something went wrong with updating post in database");
                    callback(err);
                }
                // Return response
                console.log(color_success, "All posts updated in database!")
                resolve('Promise is resolved successfully.');
                return 'Loaded Posts';
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
        const existingActors = await Actor.find().exec();
        const existingScripts = await Script.find().exec();
        const [existingActorsUsernames, existingScriptsPostIDs] = getUniqueIdentifiersOfObjects(existingActors, existingScripts);
        const [newActorsUsernames, newScriptsPostIDs] = getUniqueIdentifiersOfObjects(actors_list, posts_list);
        // console.log(existingScriptsPostIDs.length); // 362
        // console.log(newScriptsPostIDs.length); // 264

        // To do: We've never had to update, delete, or add actors yet. So code is not written for it. 
        const toUpdate_ActorUsernames = existingActorsUsernames.filter(x => newActorsUsernames.includes(x));
        const toDelete_ActorUsernames = existingActorsUsernames.filter(x => !newActorsUsernames.includes(x));
        const toAdd_ActorUsernames = newActorsUsernames.filter(x => !existingActorsUsernames.includes(x));

        const toUpdate_PostIDs = existingScriptsPostIDs.filter(x => newScriptsPostIDs.includes(x));
        const toDelete_PostIDs = existingScriptsPostIDs.filter(x => !newScriptsPostIDs.includes(x));
        const toAdd_PostIDs = newScriptsPostIDs.filter(x => !existingScriptsPostIDs.includes(x));

        await console.log(color_start, "Starting to update posts collection...");
        await updatePostInstances(toUpdate_PostIDs);
        await console.log(color_start, "Starting to delete posts collection...");
        await deletePostInstances(toDelete_PostIDs);
        await console.log(color_start, "Starting to add posts collection...");
        await createPostInstances(toAdd_PostIDs);
        mongoose.connection.close();
    } catch (err) {
        console.log('Error occurred in Loading', err);
    }
}

loadDatabase();