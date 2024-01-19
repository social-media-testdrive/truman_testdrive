const bcrypt = require('@node-rs/bcrypt');
const crypto = require('crypto');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true }, // Username, must be unique. In Public TestDrive, this is randomly generated.
    name: { type: String, default: '' }, // Used in Research TestDrive; real name associated with account.
    // email: {type: String, default: ""},
    deleted: { type: Boolean, default: false }, // Used in Research TestDrive, indicates if user has been "deleted" from a class.
    password: String, // hashed and salted. Passwords are only set for Research TestDrive, teacher accounts. Else, random.
    active: { type: Boolean, default: true }, // Used in Research TestDrive, indicates if the user is active. 
    isAdmin: { type: Boolean, default: false }, // Indicates if user is an Administrator. This value is only changed directly in the database.
    isInstructor: { type: Boolean, default: false }, // Used in Research TestDrive, indicates if user is an Instructor
    isStudent: { type: Boolean, default: false }, // Used in Research TestDrive, indicates if user is a Student
    isGuest: { type: Boolean, default: false }, // Indicates if user is a Guest. All Public TestDrive users are guests.
    // className: {type: String, default: ''}, // Used in Research TestDrive; which class this user belongs to, if a student
    accessCode: { type: String, default: '' }, // Used in Research TestDrive; AccessCode identifying which class this user belongs to, if a student
    reflectionCsv: { type: String, default: '' },
    timeReportCsv: { type: String, default: '' },
    moduleProgress: { // Used in Research TestDrive, marks the progress of each module: "none", "started", "completed".
        accounts: { type: String, default: 'none' },
        advancedlit: { type: String, default: 'none' },
        cyberbullying: { type: String, default: 'none' },
        digfoot: { type: String, default: 'none' },
        digitalliteracy: { type: String, default: 'none' },
        esteem: { type: String, default: 'none' },
        habits: { type: String, default: 'none' },
        phishing: { type: String, default: 'none' },
        presentation: { type: String, default: 'none' },
        privacy: { type: String, default: 'none' },
        safeposting: { type: String, default: 'none' },
        targeted: { type: String, default: 'none' },
    },
    earnedBadges: [new Schema({ // List of badges earned by the user, see testdriveBadges.json file.
        badgeId: String,
        badgeTitle: String,
        badgeImage: String,
        dateEarned: Date
    })],
    numPosts: { type: Number, default: -1 }, // Indicates the number of posts the user has created.
    numComments: { type: Number, default: -1 }, // Indicates the number of comments the user has created.

    lastNotifyVisit: Date, // The absolute date (time) that the user last visited the site. 

    // blocked: [String], // List of usernames of actors that the user has blocked, Not used in TestDrive
    // reported: [String], // List of usernames of actors that the user has reported, Not used in TestDrive

    targetedAdTopic: [String], // List of interests that the user selected in targeted module: "Food", "Gaming", or "Sports". Order: Least recently selected to most recently selected.
    esteemTopic: [String], // List of interests that the user selected in the esteem module: "Food", "Gaming", or "Sports". Order: Least recently selected to most recently selected.
    habitsTimer: [Number], // List of time durations (in milliseconds), indicating how long the user has been on the free-play page in the habits module. Use sum of this array to get a total time.
    firstHabitViewTime: { type: Number, default: -1 }, // The absolute date (time) that the user first opened the free-play section of the habits module.
    voiceoverTimer: [Number], // List of time durations (in milliseconds), indicating how long the voiceover is on. Use the sum of this array to get a total time.
    viewQuizExplanations: [new Schema({ // Indicates if the user has clicked to view quiz answer explanations.
        module: String, // Indicates which module the action is completed in.
        click: Boolean, // Indicates if the user clicked to view explanations.
        absoluteTime: Date, // The absolute date (time) that the user clicked to view explanations.
    })],

    // User-made posts
    posts: [new Schema({
        type: String, // In TestDrive, this value is always "user_post".
        module: String, // Indicates which module the post is made in.

        postID: Number, // ID for this post (0, 1,2,3...)
        body: { type: String, default: '', trim: true }, // Body of post caption
        picture: String, // Picture selected

        absTime: Date, // The absolute date (time) that the user made the post.
        relativeTime: { type: Number } // The relative time (relative to when the user's account was created) that the user made the post, in milliseconds.
    })],

    // List of absolute dates, indicating when a user has logged in.
    log: [new Schema({
        time: Date,
    })],

    // List of pages that the user has visisted.
    pageLog: [new Schema({
        time: Date, // The absolute date (time) that the user visited the page.
        subdirectory1: String,
        subdirectory2: String
    })],

    // Start Page Actions
    startPageAction: [new Schema({
        subdirectory1: String, // Indicates which page the user is on. This value is always "start".
        subdirectory2: String, // Indicates which module the action is completed in.
        actionType: { type: String }, // Indicates the type of action; values: "next_showLearnSection", "next_showKeyIdeas", "KeyIdea".
        vocabTerm: { type: String }, // Indicates which vocab term was clicked. Value is null if actionType is "next_".
        absoluteTimestamp: Date // The absolute date (time) that the user clicked button.
    }, { _id: true, versionKey: false })],

    // IntroJsStep Actions: (the walkthrough-style text bubbles)
    introjsStepAction: [new Schema({
        subdirectory1: String, // Indicates which page the user is on.
        subdirectory2: String, // Indicates which module the action is completed in.
        stepNumber: Number, // Indicates which step the user clicked (steps start from 0).
        viewDuration: Number, // Time duration indicating how long the user was on this step, in milliseconds.
        absoluteStartTime: Date // The absolute date (time) that the step first opened/ appeared.
    }, { _id: true, versionKey: false })],

    // Blue Dot Actions
    blueDotAction: [new Schema({
        subdirectory1: String, // Indicates which page the user is on.
        subdirectory2: String, // Indicates which module the action is completed in.
        dotNumber: Number, // Indicates which dot was opened.
        viewDuration: Number, // Time duration indicating how long the user viewed the dot, in milliseconds.
        absoluteTimeOpened: Date, // The absolute date (time) that the dot was opened.
        clickedGotIt: Boolean // Indicates if the blue dot was closed via clicking "Got it". If false, blue dot was closed by clicking outside of the prompt.
    }, { _id: true, versionKey: false })],

    // Only used in the 'accounts' module (in the sim , sim2 section), to record user's input in form fields.
    accountsAction: [new Schema({
        subdirectory1: String, // Indicates which page the user is on.
        subdirectory2: String, // Indicates which module the action is completed in. This value is always "accounts". 
        inputField: String, // Indicates which field the action corresponds to. 
        inputText: String, // Value of field input (for /sim/accounts page, it is the actual value, for /sim2/accounts page, it is "true" or "false", indicating if they provided an input)
        passwordStrength: String, // Indicates password strength. Value is null if inputField is not "password".
        absoluteTimestamp: Date // The absolute date (time) that the user clicked "Let's Continue", which logs the answers.
    }, { _id: true, versionKey: false })],

    // Only used in 'habits' module (in the sim3, sim4, modual sections), to record user's clicks and settings.
    habitsAction: [new Schema({
        subdirectory1: String, // Indicates which page the user is on.
        subdirectory2: String, // Indicates which module the action is completed in. This value is always "habits". 
        actionType: String, // clickNotificationsTab, clickSettingsTab, clickMyActivityTab, setPauseNotifications,  setDailyReminder, togglePauseNotifications, clickNotificationPopup, clickNotificationItem
        setValue: String, // value that was set (only used when actionType is setPauseNotifications, setDailyReminder, togglePauseNotifications)
        absoluteTimestamp: Date // time the user did action
            // viewDuration: Number // how long the user viewed pop up post (milliseconds)
    }, { _id: true, versionKey: false })],

    // only used in 'privacy' module (in the tutorial, sim section), to record user's input in form fields
    privacyAction: [new Schema({
        subdirectory1: String, // which page the user is on 
        subdirectory2: String, // which module the user is on, should always be 'privacy', 
        inputField: String, //which field is this for?
        inputText: String, //user input into the field
        absoluteTimestamp: Date // time the user changed value of form field
    }, { _id: true, versionKey: false })],

    // all actions a user can make in a chatbox
    chatAction: [new Schema({
        chatId: String, // which chat did the user interact with?
        subdirectory1: String, // which page the user is on
        subdirectory2: String, // which module the user is on
        messages: [new Schema({
            message: String, // message
            absTime: Date, // absolute time the message was sent
        }, { _id: true, versionKey: false })],
        minimized: { type: Boolean, default: false }, // is miminized? 
        closed: { type: Boolean, default: false }, // is closed?
        minimizedTime: [Date], // array for when chat was minimized
        closedTime: Date, // when chat was closed
    }, { _id: true, versionKey: false })],

    // all actions a user can make in the tutorial (not including introjs steps)
    tutorialAction: [new Schema({
        post: String, //which post did the user interact with?
        modual: String, //which lesson mod did this take place in?
        startTime: Number, //always the newest startTime (full date in ms) (not used in TestDrive)
        liked: { type: Boolean, default: false }, //did the user like this post in the feed?
        flagged: { type: Boolean, default: false }, //did the user flag this post in the feed?
        shared: { type: Boolean, default: false }, //did the user share this post in the feed?
        flagTime: [Date], //same but for flagging
        likeTime: [Date], //same but for liking
        shareTime: [Date], //same but for sharing
        replyTime: [Date], //same but for commenting
        comments: [new Schema({
            comment: String,
            liked: { type: Boolean, default: false }, //is liked?
            flagged: { type: Boolean, default: false }, //is Flagged?
            flagTime: [Date], //array of flag times
            likeTime: [Date], //array of like times

            new_comment: { type: Boolean, default: false }, //is new comment
            new_comment_id: String, //ID for comment
            comment_body: String, // Text the user wrote (if the comment was user-made)
            absTime: Date, // Real-life timestamp of when the comment was made (user-made only)
        }, { _id: true, versionKey: false })]
    }, { _id: true, versionKey: false })],

    // all actions a user can make in the guided activity (not blue dots)
    guidedActivityAction: [new Schema({
        post: String, //which post did the user interact with?
        modual: String, //which lesson mod did this take place in?
        startTime: Number, //always the newest startTime (full date in ms) (not used in TestDrive)
        liked: { type: Boolean, default: false }, //did the user like this post in the feed?
        flagged: { type: Boolean, default: false }, //did the user flag this post in the feed?
        shared: { type: Boolean, default: false }, //did the user share this post in the feed?
        flagTime: [Date], //same but for flagging
        likeTime: [Date], //same but for liking
        shareTime: [Date], //same but for sharing
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
            comment_body: String, // Text the user wrote (if the comment was user-made)
            absTime: Date, // Real-life timestamp of when the comment was made (user-made only)
        }, { _id: true, versionKey: false })]
    }, { _id: true, versionKey: false })],

    // all actions a user can make in a feed
    feedAction: [new Schema({
        post: { type: Schema.ObjectId, ref: 'Script' }, // which post did the user interact with?
        modual: String, // which lesson mod did this take place in?
        rereadTimes: Number, // number of times post has been viewed by user (not used in TestDrive)
        startTime: Number, // always the newest startTime (full date in ms) (not used in TestDrive)
        liked: { type: Boolean, default: false }, // did the user like this post in the feed?
        flagged: { type: Boolean, default: false }, // did the user flag this post in the feed?
        shared: { type: Boolean, default: false }, //did the user share this post in the feed?
        readTime: [Number], // array of how long a user read a post. Each read is a new element in this array
        flagTime: [Date], // same but for flagging
        likeTime: [Date], // same but for liking
        shareTime: [Date], //same but for sharing
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

        // comments
        comments: [new Schema({
            comment: { type: Schema.ObjectId }, // ID Reference for Script post comment
            liked: { type: Boolean, default: false }, // is liked?
            flagged: { type: Boolean, default: false }, // is Flagged?
            flagTime: [Date], // array of flag times
            likeTime: [Date], // array of like times

            new_comment: { type: Boolean, default: false }, // is new comment
            new_comment_id: Number, // ID for comment
            comment_body: String, // Text the user wrote (if the comment was user-made)
            comment_index: Number, // Index of comment on post
            absTime: Date, // Real-life timestamp of when the comment was made (user-made only)
        }, { _id: true, versionKey: false })]
    }, { _id: true, versionKey: false })],

    // action in the reflection section
    reflectionAction: [new Schema({
        absoluteTimeContinued: Date, // time that the user left the page by clicking continue
        modual: String, // which lesson mod did this take place in?
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
        }, { _id: false, versionKey: false })],
    }, { _id: true, versionKey: false })],

    // action in the quiz section
    quizAction: [new Schema({
        absoluteTimeContinued: Date, // time that the user submitted their answers by clicking "Check My Answers"
        modual: String, // the modual corresponding to the quiz answers
        attemptNumber: Number, // this tracks the user's attempt (i.e. 0, 1, 2)
        attemptDuration: Number, // how long the user took for the quiz attempt (milliseconds)
        answers: [new Schema({
            questionNumber: String, // corresponds with quizSectionData.json, i.e. 'Q1', 'Q2', 'Q3'...
            prompt: String, // question prompt text
            // type: String, // Which type of response this will be: It is always "radio"
            radioSelectionIndex: Number, // radio selection index
            radioSelection: String, // radio selection text
        }, { _id: false, versionKey: false })],
        numCorrect: Number // the number of questions they answered correctly
    }, { _id: true, versionKey: false })],

    //users profile
    profile: {
        name: { type: String, default: '', trim: true },
        location: { type: String, default: '', trim: true },
        bio: { type: String, default: '', trim: true },
        picture: { type: String, default: '', trim: true }
    },

    // List (history) of all changes to the user profile
    profileHistory: [new Schema({
        absoluteTimeChanged: Date, // The absolute date (time) the profile was changed
        name: String, // Value of the new profile name
        location: String, // Value of the new location
        bio: String, // Value of the new bio
        picture: String // Value of the new picture
    }, { _id: true, versionKey: false })],
}, { timestamps: true });

/**
 * Password hash middleware.
 */
userSchema.pre('save', async function save(next) {
    const user = this;
    if (!user.isModified('password')) { return next(); }
    try {
        user.password = await bcrypt.hash(user.password, 10);
        next();
    } catch (err) {
        next(err);
    }
});

/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = async function comparePassword(candidatePassword, cb) {
    try {
        cb(null, await bcrypt.verify(candidatePassword, this.password));
    } catch (err) {
        cb(err);
    }
};

/**
 * Helper method to log when a user has logged in.
 */
userSchema.methods.logUser = async function logUser(time) {
    try {
        this.log.push({
            time: time
        });
        await this.save();
    } catch (err) {
        console.log(err);
    }
};

/**
 * Helper method to log the pages the user has visited. 
 */
userSchema.methods.logPage = async function logPage(time, subdirectory1, subdirectory2) {
    try {
        this.pageLog.push({
            time: time,
            subdirectory1: subdirectory1 ? subdirectory1 : "home",
            subdirectory2: subdirectory2 ? subdirectory2 : ""
        });
        await this.save();
    } catch (err) {
        console.log(err);
    }
};

/**
 * Helper method for getting all User Posts.
 */
userSchema.methods.getPosts = function getPosts(module) {
    let ret = this.posts.filter(post => post.module == module);
    ret.sort(function(a, b) {
        return b.relativeTime - a.relativeTime;
    });
    return ret;
};

/**
 * Helper method for getting user's gravatar.
 */
userSchema.methods.gravatar = function gravatar(size) {
    if (!size) {
        size = 200;
    }
    if (!this.email) {
        return `https://gravatar.com/avatar/?s=${size}&d=retro`;
    }
    const md5 = crypto.createHash('md5').update(this.email).digest('hex');
    return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`;
};

const User = mongoose.model('User', userSchema);
module.exports = User;