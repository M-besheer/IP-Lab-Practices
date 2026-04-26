const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// CREATE — POST /api/courses
router.post('/', async (req, res) => {
    const newCourse = await Course.create(req.body);
    res.status(201).json(newCourse);
});

// READ ALL — GET /api/courses
router.get('/', async (req, res) => {
    const courses = await Course.find();
    res.json(courses);
});

// READ ONE — GET /api/courses/:id
router.get('/:id', async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
});

// UPDATE — PUT /api/courses/:id
router.put('/:id', async (req, res) => {
    const result = await Course.updateOne({ _id: req.params.id }, { $set: req.body });
    if (result.matchedCount === 0)
        return res.status(404).json({ message: 'Course not found' });
    res.json({ message: 'Course updated successfully' });
});

// DELETE — DELETE /api/courses/:id
router.delete('/:id', async (req, res) => {
    const result = await Course.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0)
        return res.status(404).json({ message: 'Course not found' });
    res.json({ message: 'Course deleted successfully' });
});

module.exports = router;