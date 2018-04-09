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

    Class.findOne({ accessCode: req.params.classId, teacher: req.user.id})
        .populate('students')
        .exec(function (err, found_class) 
        {

          if (err) { console.log(err); return next(err); }
          ////this is not solving the problem 
          if (found_class == null) 
          {
            console.log("NULLLLLLLLLLL");  
            var myerr = new Error('Class not found!'); 
            return next(myerr); 
          }

          res.render('class', { found_class: found_class});

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

