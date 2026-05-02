const express = require('express');
const { protect } = require('../middleware/auth');
const Task = require('../models/Task');

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { assignedTo: req.user._id };
    const tasks = await Task.find(query).populate('project', 'name');
    const now = new Date();
    const stats = {
      total: tasks.length,
      todo: tasks.filter(t => t.status === 'todo').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      done: tasks.filter(t => t.status === 'done').length,
      overdue: tasks.filter(t => t.dueDate < now && t.status !== 'done').length
    };
    const recentTasks = tasks.sort((a,b) => b.createdAt - a.createdAt).slice(0,5);
    res.json({ stats, recentTasks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;