/*
This script is run from the command line.
<node makeClassControlGroup.js [classCode]>

Make all students in class control group, given the requested classCode.

This script uses the connection information from your local .env file (in line 22), 
so set your local .env variables to match the database you want to connect to.
For the test/production databases, you can find the connection info in LastPass, 
or in the environment properties of the corresponding elastic beanstalk environment.
*/

const async = require('async');
const User = require('./models/User.js');
const Class = require('./models/Class.js')
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs');
const CSVToJSON = require("csvtojson");
const csvWriter = require('csv-write-stream');
dotenv.config({ path: '.env' });

// establish initial Mongoose connection
mongoose.connect(process.env.PRO_MONGODB_URI, { useNewUrlParser: true });
// listen for errors after establishing initial connection
const db = mongoose.connection;
db.on('error', (err) => {
    console.error(err);
    console.log('%s MongoDB connection error.');
    process.exit(1);
});

const color_start = '\x1b[33m%s\x1b[0m'; // yellow
const color_success = '\x1b[32m%s\x1b[0m'; // green
const color_error = '\x1b[31m%s\x1b[0m'; // red

async function updateStudentAccounts() {
    // command inputs
    const myArgs = process.argv.slice(2);
    const classCode = myArgs[0]
    console.log(color_start, `Finding all students in class...`);

    Class.findOne({
            accessCode: classCode,
            deleted: false
        }).populate('students teacher')
        .exec(async function(err, found_class) {
            if (err) {
                console.log(color_error, err);
                return next(err);
            }
            if (found_class == null) {
                console.log(color_error, `ERROR: No class with provided code is found.`);
                mongoose.connection.close();
                return;
            }
            const promiseArray = [];
            // iterate through each student and update control=true
            for (const studentId of found_class.students) {
                let student = await User.findById(studentId)
                    .catch(err => {
                        console.log("Did not find student");
                        return next(err);
                    });
                student.control = true;
                promiseArray.push(student.save());
            }

            // update control=true for the teacher of the class
            // Slightly hacky, since a teacher will be control=true, if just 1 class is control 
            let teacher = await User.findById(found_class.teacher).catch(err => {
                console.log("Did not find teacher");
                return next(err);
            });
            teacher.control = true;
            promiseArray.push(teacher.save());

            // update control=true for class
            let class1 = await Class.findById(found_class).catch(err => {
                console.log("Did not find class");
                return next(err);
            });
            class1.control = true;
            promiseArray.push(class1.save());

            await Promise.all(promiseArray);
            console.log(color_success, `Successfully updated every student in class. Closing db connection.`);
            mongoose.connection.close();
        });
}

updateStudentAccounts();