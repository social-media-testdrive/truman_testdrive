const Lesson = require('../models/lesson.model.js');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Set up multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const postLesson = async (req, res) => {
    try {
        let lessonData = req.body;
        
        if (req.file) {
            const base64Image = req.file.buffer.toString('base64');
            lessonData.image = base64Image;
        }

        const lesson = await Lesson.create(lessonData);
        res.status(201).json(lesson);
    } catch (error) {
        res.status(500).json({
            message: "Error creating lesson",
            error: error.message
        });
    }
};

const getLessons = async (req, res) => {
    try {
        const lessons = await Lesson.find({});
        res.status(200).json(lessons);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching lessons",
            error: error.message
        });
    }
};

const getLessonByID = async (req, res) => {
    try {
        const { id } = req.params;
        const lesson = await Lesson.findById(id);
        if (!lesson) {
            return res.status(404).json({
                message: "Lesson not found"
            });
        }
        res.status(200).json(lesson);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching lesson",
            error: error.message
        });
    }
};

const putLesson = async (req, res) => {
    try {
        const { id } = req.params;
        let lessonData = req.body;
        
        if (req.file) {
            const base64Image = req.file.buffer.toString('base64');
            lessonData.image = base64Image;
        }

        const lesson = await Lesson.findByIdAndUpdate(id, lessonData, { new: true, runValidators: true });
        if (!lesson) {
            return res.status(404).json({
                message: "Lesson not found"
            });
        }
        res.status(200).json(lesson);
    } catch (error) {
        res.status(500).json({
            message: "Error updating lesson",
            error: error.message
        });
    }
};

const deleteLesson = async (req, res) => {
    try {
        const { id } = req.params;
        const lesson = await Lesson.findByIdAndDelete(id);
        if (!lesson) {
            return res.status(404).json({
                message: "Lesson not found"
            });
        }
        res.status(200).json({
            message: "Lesson deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting lesson",
            error: error.message
        });
    }
};

module.exports = { postLesson: [upload.single('image'), postLesson], getLessons, getLessonByID, putLesson: [upload.single('image'), putLesson], deleteLesson };
