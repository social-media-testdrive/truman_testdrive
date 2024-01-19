const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scriptSchema = new mongoose.Schema({
    body: { type: String, default: '', trim: true }, // Body (caption text) of the post.
    post_id: Number, // Post ID used in the CSV input file.
    module: String, // Name of the lesson module for this post (i.e. cyberbullying, etc).
    type: String, // Type of post (neutral, or a label to designate post type).
    picture: String, // File name of the image for this post.
    likes: Number, // Number of likes this post has.
    info_text: { type: String, default: '', trim: true }, // Information text, used to display other content of a post.
    actor: { type: Schema.ObjectId, ref: 'Actor' }, // Actor who created post.

    time: Number, // Relative time of the post, in milliseconds.

    //comments for this post (is an array)
    comments: [new Schema({
            module: String, // Name of the lesson module for this comment.
            actor: { type: Schema.ObjectId, ref: 'Actor' }, // Actor who created comment.
            body: { type: String, default: '', trim: true }, // Body (text) of the comment
            commentID: Number, // Comment ID used in the CSV input file.
            time: Number, // Relative time of the comment, in milliesconds.
            likes: Number, // Number of likes this comment has.

            new_comment: { type: Boolean, default: false },
        }, { versionKey: false })] //versioning messes up our updates to the DB sometimes, so we kill it here
}, { versionKey: false });

const Script = mongoose.model('Script', scriptSchema);
module.exports = Script;