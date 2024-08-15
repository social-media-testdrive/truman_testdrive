const express = require('express');
const router = express.Router();
const LessonController = require('../controllers/lesson.controller.js');

router.post('/lesson', LessonController.postLesson);
router.get('/lesson', LessonController.getLessons);
router.get('/lesson/:id', LessonController.getLessonByID);
router.put('/lesson/:id', LessonController.putLesson);
router.delete('/lesson/:id', LessonController.deleteLesson);

module.exports = router;
