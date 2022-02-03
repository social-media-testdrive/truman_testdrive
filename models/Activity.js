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

    chosenTopic: [String], // Food, Gaming, or Sports, either from User.targetedAdTopic or User.esteemTopic
    habitsTimer: [Number], // How long the user has been on the free-play page each time they visit in habits free-play sections, use sum of this array to get a total time.

    // User created posts 
    posts: [new Schema({
        postID: Number, // Number for this post (1, 2, 3)
        body: { type: String, default: '', trim: true }, // body of post or reply
        picture: String, // picture for post
        absTime: Date, // absolute date (time in real world), this post took place in
        relativeTime: { type: Number } // time the user made the post, relative to when the account was created (in milliseconds)
    }, { _id: false, versionKey: false })],

    // pages user has visited
    pageLog: [new Schema({
        time: Date,
        subdirectory1: String,
    }, { _id: false, versionKey: false })],

    // start page log data
    startPageAction: [new Schema({
        subdirectory1: String, // which page the user is on
        actionType: { type: String }, // Next or Term
        vocabTerm: { type: String }, // none if actionType is "next"
        absoluteTimestamp: Date // time the action occurred in the real world
    }, { _id: false, versionKey: false })],

    // step log data (for any walkthroughs "Back", "Next" etc.)
    introjsStepAction: [new Schema({
        subdirectory1: String, // which page the user is on
        stepNumber: Number, // which step this action is on (steps start from 0)
        viewDuration: Number, // how long the user was on this step (milliseconds), 
        absoluteStartTime: Date // time the step opened in the real world
    }, { _id: false, versionKey: false })],

    // blue dot action in a guided activity
    blueDotAction: [new Schema({
        subdirectory1: String, // which page the user is on
        dotNumber: Number, // which dot was opened
        absoluteTimeOpened: Date, // date of when the dot was opened
        viewDuration: Number, // how long the user viewed the dot (milliseconds)
        clickedGotIt: Boolean
    }, { _id: false, versionKey: false })],

    // only used in 'accounts' module (in the sim section), to record user's input in form fields
    accountsAction: [new Schema({
        subdirectory1: String, // which page the user is on 
        inputField: String, // which field is this for?
        inputText: String, // user input into the field (for /sim/accounts page, it is the actual value, for /sim2/accounts page, it is "true" or "false", indicating if they provided an input)
        passwordStrength: String, // unique only to password inputField
        absoluteTimestamp: Date // time the user clicked "Let's Continue", which logs the answers
    }, { _id: false, versionKey: false })],

    // only used in 'habits' module (in the sim3, sim4, modual sections), to record user's clicks and settings
    habitsAction: [new Schema({
        subdirectory1: String, // which page the user is on 
        actionType: String, // clickNotificationsTab, clickSettingsTab, clickMyActivityTab, setPauseNotifications,  setDailyReminder, togglePauseNotifications, clickNotificationPopup, clickNotificationItem
        setValue: String, // value that was set (only used when actionType is setPauseNotifications, setDailyReminder, togglePauseNotifications)
        absoluteTimestamp: Date // time the user did action
    }, { _id: false, versionKey: false })],

    // only used in 'privacy' module (in the tutorial, sim section), to record user's input in form fields
    privacyAction: [new Schema({
        subdirectory1: String, // which page the user is on 
        inputField: String, // which field is this for?
        inputText: String, // user input into the field
        absoluteTimestamp: Date // time the user changed value of form field
    }, { _id: false, versionKey: false })],

    chatAction: [new Schema({
        chatId: String, // which chat did the user interact with?
        subdirectory1: String, // which page the user is on
        messages: [new Schema({
            message: String, // message
            absTime: Date, // absolute time the message was sent
        }, { _id: false, versionKey: false })],
        minimized: { type: Boolean, default: false }, // is miminized? 
        closed: { type: Boolean, default: false }, // is closed?
        minimizedTime: [Date], // array for when chat was minimized
        closedTime: Date // when chat was closed
    }, { _id: false, versionKey: false })],

    tutorialAction: [new Schema({
        post: String, // which post did the user interact with?
        liked: { type: Boolean, default: false }, // did the user like this post in the feed?
        flagged: { type: Boolean, default: false }, // did the user flag this post in the feed?
        flagTime: [Date], //same but for flagging
        likeTime: [Date], //same but for liking
        replyTime: [Date], //same but for commenting
        comments: [new Schema({
            comment: String,
            liked: { type: Boolean, default: false }, // is liked?
            flagged: { type: Boolean, default: false }, // is Flagged?
            flagTime: [Date], //array of flag times
            likeTime: [Date], //array of like times

            new_comment: { type: Boolean, default: false }, // is new comment
            new_comment_id: String, // ID for comment
            comment_body: String, // Text the User Wrote
            absTime: Date // Real-life timestamp of when the comment was made (user-made only)
        }, { _id: false, versionKey: false })]
    }, { _id: false, versionKey: false })],

    guidedActivityAction: [new Schema({
        post: String, // which post did the user interact with?
        liked: { type: Boolean, default: false }, // did the user like this post in the feed?
        flagged: { type: Boolean, default: false }, // did the user flag this post in the feed?
        flagTime: [Date], //same but for flagging
        likeTime: [Date], //same but for liking
        replyTime: [Date], //same but for commenting

        // popup modal info
        modal: [new Schema({
            modalName: String, // Name of modal opened
            modalOpened: { type: Boolean, default: false }, // Whether them modal was opened
            modalOpenedTime: Date, // Real-life time when modal was opened
            modalViewTime: Number, // Duration of time that the modal was open (in milliseconds)
            modalCheckboxesCount: Number, // How many checkboxes are present in the modal
            modalCheckboxesInput: Number, // Number which, when converted to binary format, corresponds to which checkboxes were checked
            modalDropdownCount: Number, // How many accordion triangles are present in the modal
            modalDropdownClick: Number // Which accordion triangles were clicked, when converted to binary format
        }, { _id: false, versionKey: false })],

        // user created comment on an actor's post (fake post)
        comments: [new Schema({
            comment: String,
            liked: { type: Boolean, default: false }, // is liked?
            flagged: { type: Boolean, default: false }, // is Flagged?
            flagTime: [Date], // array of flag times
            likeTime: [Date], // array of like times

            new_comment: { type: Boolean, default: false }, // is new comment
            new_comment_id: String, // ID for comment
            comment_body: String, // Original Body of User Post
            absTime: Date, // Real-life timestamp of when the comment was made (user-made only)
        }, { _id: false, versionKey: false })]
    }, { _id: false, versionKey: false })],

    feedAction: [new Schema({
        postID: { type: Schema.ObjectId, ref: 'Script' }, // ID of the post the user interacted with
        postBody: { type: String, default: '', trim: true }, // body of the post the user interacted with
        liked: { type: Boolean, default: false }, // did the user like this post in the feed?
        flagged: { type: Boolean, default: false }, // did the user flag this post in the feed?
        flagTime: [Date], // same but for flagging
        likeTime: [Date], // same but for liking
        replyTime: [Date], // same but for commenting

        // popup modal info
        modal: [new Schema({
            modalName: String, // Name of modal opened
            modalOpened: { type: Boolean, default: false }, // Whether them modal was opened
            modalOpenedTime: Date, // Real-life time when modal was opened
            modalViewTime: Number, // Duration of time that the modal was open (in milliseconds)
            modalCheckboxesCount: Number, // How many checkboxes are present in the modal
            modalCheckboxesInput: Number, // Number which, when converted to binary format, corresponds to which checkboxes were checked
            modalDropdownCount: Number, // How many accordion triangles are present in the modal
            modalDropdownClick: Number // Which accordion triangles were clicked, when converted to binary format
        }, { _id: false, versionKey: false })],

        // user created comment on an actor's post (fake post)
        comments: [new Schema({
            comment: { type: Schema.ObjectId }, // ID Reference for Script post comment
            liked: { type: Boolean, default: false }, // is liked?
            flagged: { type: Boolean, default: false }, // is Flagged?
            flagTime: [Date], // array of flag times
            likeTime: [Date], // array of like times

            new_comment: { type: Boolean, default: false }, // is new comment
            new_comment_id: Number, // ID for comment
            comment_body: String, // Text the user wrote (if the comment was user-made), or text of the comment the user interacted with (if the comment was actor made)
            absTime: Date, // Real-life timestamp of when the comment was made (user-made only)
        }, { _id: false, versionKey: false })]
    }, { _id: false, versionKey: false })],

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