const mongoose = require('mongoose');

const LessonSchema = mongoose.Schema(
    {
        title:{
            type:String,
            required: [true, "Please enter title" ]
        },
        subtitle:{
            type:String,
            required: false,
        },

        duration:{
            type:Number,
            required: false,
            default: 0
        },

        image:{
            type:String,
            required: false
        },
        link:{
            type:String,
            required: false
        },
        imagelink: {
            type:String,
            required: false
        }


    },
    {
        timestamps:true
    }
);

const Lesson = mongoose.model("Lesson", LessonSchema)

module.exports = Lesson;