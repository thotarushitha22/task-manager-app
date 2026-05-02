const express = require('express');
const { protect } = require('../middleware/auth');
const { adminOnly } = require('../middleware/roleCheck');
const Task = require('../models/Task');

const router = express.Router();

// Get tasks (admin sees all, member sees assigned)
router.get('/', protect, async (req, res) => {
  try {
    let tasks;
    if (req.user.role === 'admin') {
      tasks = await Task.find().populate('project', 'name').populate('assignedTo', 'name');
    } else {
      tasks = await Task.find({ assignedTo: req.user._id }).populate('project', 'name').populate('assignedTo', 'name');
    }
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create task (admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  const { title, description, dueDate, projectId, assignedToId } = req.body;
  try {
    const task = await Task.create({
      title,
      description,
      dueDate,
      project: projectId,
      assignedTo: assignedToId,
      createdBy: req.user._id
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update task status (member can update only tasks assigned to them)
router.put('/:id/status', protect, async (req, res) => {
  const { status } = req.body;
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (req.user.role !== 'admin' && task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only update your own tasks' });
    }
    task.status = status;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Full update (admin only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete task (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;