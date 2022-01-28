const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activitySchema = new mongoose.Schema({
    userID: { type: Schema.ObjectId, ref: 'User' }, // ID for the user for this activity data
    module: String, // which module this activity data is for
    newPosts: [String], // list containing the body of each user-created post
    freeplayComments: [new Schema({
        postID: { type: Schema.ObjectId, ref: 'Script' }, // ID of the post the user interacted with
        postBody: { type: String, default: '', trim: true }, // body of the post the user interacted with
        userComments: [{ type: String, trim: true }], // list containing the body of each user comment
    })],
    reflectionAnswers: [new Schema({
        attemptDuration: Number, // how long the user took for the reflection attempt (milliseconds)
        answers: [new Schema({
            questionNumber: String, // corresponds with reflectionSectionData.json, i.e. 'Q1', 'Q2', 'Q3'...
            prompt: String,
            type: String, // Which type of response this will be: written, checkbox, radio, habitsUnique
            writtenResponse: String,
            radioSelection: String, // this is for the presentation module
            numberOfCheckboxes: Number,
            checkboxResponse: Number,
            checkedActualTime: Boolean, // this is unique to the habits module
        })]
    })],
    quizAnswers: [new Schema({
        attemptNumber: Number, // this tracks the user's attempt (i.e. 0, 1, 2)
        attemptDuration: Number, // how long the user took for the quiz attempt (milliseconds),
        answers: [new Schema({
            questionNumber: String, // corresponds with quizSectionData.json, i.e. 'Q1', 'Q2', 'Q3'...
            prompt: String, // question prompt text
            // type: String, // Which type of response this will be: It is always "radio"
            radioSelectionIndex: Number, // radio selection index
            radioSelection: String, // radio selection text
        })],
        numCorrect: Number // the number of questions they answered correctly
    })],
    viewQuizExplanations: { type: Boolean, default: false }
});

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;