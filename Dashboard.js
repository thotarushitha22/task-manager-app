import { useEffect, useState } from 'react';
import API from '../api';

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    API.get('/dashboard').then(res => {
      setStats(res.data.stats);
      setRecent(res.data.recentTasks);
    });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-4 shadow rounded">Total: {stats.total || 0}</div>
        <div className="bg-yellow-100 p-4 shadow rounded">To Do: {stats.todo || 0}</div>
        <div className="bg-blue-100 p-4 shadow rounded">In Progress: {stats.inProgress || 0}</div>
        <div className="bg-green-100 p-4 shadow rounded">Done: {stats.done || 0}</div>
        <div className="bg-red-100 p-4 shadow rounded">Overdue: {stats.overdue || 0}</div>
      </div>
      <h2 className="text-xl mb-4">Recent Tasks</h2>
      <ul className="space-y-2">
        {recent.map(task => (
          <li key={task._id} className="border p-3 rounded flex justify-between">
            <span>{task.title}</span>
            <span className={task.status === 'done' ? 'text-green-600' : 'text-orange-600'}>{task.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}