const express = require('express');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/roleCheck');
const Project = require('../models/Project');
const User = require('../models/User');

const router = express.Router();

// Get all projects
router.get('/', protect, async (req, res) => {
  try {
    let projects;
    if (req.user.role === 'admin') {
      projects = await Project.find().populate('createdBy', 'name').populate('members', 'name');
    } else {
      projects = await Project.find({ members: req.user._id }).populate('createdBy', 'name').populate('members', 'name');
    }
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create project (admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  const { name, description, memberEmails } = req.body;
  try {
    let members = [];
    if (memberEmails && memberEmails.length) {
      members = await User.find({ email: { $in: memberEmails } });
    }
    const project = await Project.create({
      name,
      description,
      createdBy: req.user._id,
      members: members.map(m => m._id)
    });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update project (admin only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete project (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;