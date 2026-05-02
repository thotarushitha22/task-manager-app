import { useEffect, useState } from 'react';
import API from '../api';
import toast from 'react-hot-toast';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', dueDate: '', projectId: '', assignedToEmail: '' });

  useEffect(() => {
    API.get('/tasks').then(res => setTasks(res.data));
    API.get('/projects').then(res => setProjects(res.data));
  }, []);

  const createTask = async (e) => {
    e.preventDefault();
    try {
      // First get user ID by email (temporary workaround – ideally backend should resolve email to ID)
      const usersRes = await API.get('/users?email=' + form.assignedToEmail).catch(() => ({ data: [] }));
      let assignedToId = null;
      if (usersRes.data && usersRes.data.length > 0) {
        assignedToId = usersRes.data[0]._id;
      } else {
        toast.error('User not found with that email');
        return;
      }
      const payload = {
        title: form.title,
        description: form.description,
        dueDate: form.dueDate,
        projectId: form.projectId,
        assignedToId: assignedToId
      };
      const { data } = await API.post('/tasks', payload);
      setTasks([...tasks, data]);
      setShowForm(false);
      setForm({ title: '', description: '', dueDate: '', projectId: '', assignedToEmail: '' });
      toast.success('Task created');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Creation failed');
    }
  };

  const updateStatus = async (id, status) => {
    await API.put(`/tasks/${id}/status`, { status });
    setTasks(tasks.map(t => t._id === id ? { ...t, status } : t));
    toast.success('Status updated');
  };

  const deleteTask = async (id) => {
    if (window.confirm('Delete task?')) {
      await API.delete(`/tasks/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
      toast.success('Deleted');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <button onClick={() => setShowForm(true)} className="bg-blue-500 text-white px-4 py-2 rounded">+ New Task</button>
      </div>

      {showForm && (
        <form onSubmit={createTask} className="mb-6 p-4 border rounded bg-gray-50">
          <input type="text" placeholder="Title" className="block w-full mb-2 p-2 border" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
          <textarea placeholder="Description" className="block w-full mb-2 p-2 border" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
          <input type="date" className="block w-full mb-2 p-2 border" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} required />
          <select className="block w-full mb-2 p-2 border" value={form.projectId} onChange={e => setForm({...form, projectId: e.target.value})} required>
            <option value="">Select Project</option>
            {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
          </select>
          <input type="email" placeholder="Assignee Email" className="block w-full mb-2 p-2 border" value={form.assignedToEmail} onChange={e => setForm({...form, assignedToEmail: e.target.value})} required />
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Create</button>
          <button type="button" onClick={() => setShowForm(false)} className="ml-2 bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
        </form>
      )}

      <div className="grid gap-4">
        {tasks.map(task => (
          <div key={task._id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{task.title}</h2>
            <p>{task.description}</p>
            <p><strong>Project:</strong> {task.project?.name}</p>
            <p><strong>Due:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
            <p><strong>Status:</strong> 
              <select value={task.status} onChange={e => updateStatus(task._id, e.target.value)} className="ml-2 border p-1 rounded">
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </p>
            <button onClick={() => deleteTask(task._id)} className="mt-2 bg-red-500 text-white px-3 py-1 rounded text-sm">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
