const Actor = require('../models/Actor.js');
const Script = require('../models/Script.js');
const Class = require('../models/Class.js');
const User = require('../models/User');
var ObjectId = require('mongoose').Types.ObjectId;
const _ = require('lodash');

/**
 * GET /
 * List of Actors.
 
exports.index = (req, res) => {
  res.render('home', {
    title: 'Home'
  });
};
*/

//Get All Classes for login tecaher Teacher
exports.getClasses = (req, res) => {

  if (req.user.isInstructor)
  {
    Class.find({ teacher: req.user.id}, (err, classes) => {

      //classes is array with all classes for this teacher
      res.render('classes', { classes: classes });
    });
  }

  else
  {
    res.redirect('/');
  }

};

//Get One Class headed by login in Teacher
exports.getClass = (req, res, next) => {


  console.log("START HERE Our Paramater is:::::");
  console.log(req.params.classId);

  
  if (req.user.isInstructor)
  {

    console.log("SECOND Our Paramater is:::::");
    console.log(req.params.classId);
    Class.findOne({ accessCode: req.params.classId, teacher: req.user.id})
        .populate('students')
        .exec(function (err, found_class) 
        {

          console.log("INSIDE CLASS!!!!");
          if (err) { console.log("ERROR");console.log(err); return next(err); }
          ////this is not solving the problem 
          if (found_class == null) 
          {
            console.log("NULLLLLLLLLLL");  
            var myerr = new Error('Class not found!'); 
            return next(myerr); 
          }

          console.log("BEFORE FORRRRR!!!!");
          for (var i = 0; i < found_class.students.length; i++) {
            found_class.students[i].pre_presentation = found_class.students[i].quiz.find(function(e) {return (e.type == "pre"&&e.modual=="presentation")});
            found_class.students[i].post_presentation = found_class.students[i].quiz.find(function(e) {return (e.type == "post"&&e.modual=="presentation")});
            found_class.students[i].pre_cyberbullying = found_class.students[i].quiz.find(function(e) {return (e.type == "pre"&&e.modual=="cyberbullying")});
            found_class.students[i].post_cyberbullying = found_class.students[i].quiz.find(function(e) {return (e.type == "post"&&e.modual=="cyberbullying")});
            found_class.students[i].pre_digital_literacy = found_class.students[i].quiz.find(function(e) {return (e.type == "pre"&&e.modual=="digital-literacy")});
            found_class.students[i].post_digital_literacy = found_class.students[i].quiz.find(function(e) {return (e.type == "post"&&e.modual=="digital-literacy")});
            found_class.students[i].pre_like = found_class.students[i].quiz.find(function(e) {return (e.type == "pre"&&e.modual=="likes")});
            found_class.students[i].post_like = found_class.students[i].quiz.find(function(e) {return (e.type == "post"&&e.modual=="likes")});
            found_class.students[i].pre_image = found_class.students[i].quiz.find(function(e) {return (e.type == "pre"&&e.modual=="image")});
            found_class.students[i].post_image = found_class.students[i].quiz.find(function(e) {return (e.type == "post"&&e.modual=="image")});
            //Do something
          }
          console.log("BEFORE RENDER!!!!");
          res.render('class', { found_class: found_class});
          console.log("AFTER RENDER!!!!");

        });
  }

  else
  {
    res.redirect('/');
  }

};

/**
 * POST /class/create
 * Update/Create Teacher's class
 */
exports.postCreateClass = (req, res, next) => {

  //Should never needs these checks (will check on Client Side)
  req.assert('classname', 'Class Name cannot be blank').notEmpty();
  req.assert('accesscode', 'Access Code cannot be blank').notEmpty();
  req.assert('accesscode', 'Access Code must be at least 4 characters long').len(4);
  
  const errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/classes');
  }

  User.findById(req.user.id, (err, user) => {
    //somehow user does not exist here
    if (err) { return next(err); }

    //random assignment of experimental group
    const new_class = new Class({
      className: req.body.classname,
      teacher: user,
      accessCode: req.body.accesscode
    });

    Class.findOne({ accessCode: req.body.accesscode }, (err, existingClass) => {
      if (err) { return next(err); }
      if (existingClass) {
        req.flash('errors', { msg: 'Class with that Access Code already exists. Try another Access Code.' });
        return res.redirect('/classes');
      }
      new_class.save((err) => {
        if (err) { return next(err); }
          res.redirect('/classes');
        });
      });//end of CLASS FIND ONE

  });//User.findByID
};//end of FUNCTION

