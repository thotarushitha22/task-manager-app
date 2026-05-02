import { useEffect, useState } from 'react';
import API from '../api';
import toast from 'react-hot-toast';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [memberEmails, setMemberEmails] = useState('');

  useEffect(() => {
    API.get('/projects').then(res => setProjects(res.data));
  }, []);

  const createProject = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/projects', {
        name,
        description,
        memberEmails: memberEmails.split(',').map(e => e.trim())
      });
      setProjects([...projects, data]);
      setShowForm(false);
      setName('');
      setDescription('');
      setMemberEmails('');
      toast.success('Project created');
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  const deleteProject = async (id) => {
    if (window.confirm('Delete project?')) {
      await API.delete(`/projects/${id}`);
      setProjects(projects.filter(p => p._id !== id));
      toast.success('Deleted');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Projects</h1>
        <button onClick={() => setShowForm(true)} className="bg-blue-500 text-white px-4 py-2 rounded">+ New Project</button>
      </div>

      {showForm && (
        <form onSubmit={createProject} className="mb-6 p-4 border rounded bg-gray-50">
          <input type="text" placeholder="Project Name" className="block w-full mb-2 p-2 border" value={name} onChange={e => setName(e.target.value)} required />
          <textarea placeholder="Description" className="block w-full mb-2 p-2 border" value={description} onChange={e => setDescription(e.target.value)} />
          <input type="text" placeholder="Member Emails (comma separated)" className="block w-full mb-2 p-2 border" value={memberEmails} onChange={e => setMemberEmails(e.target.value)} />
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Create</button>
          <button type="button" onClick={() => setShowForm(false)} className="ml-2 bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
        </form>
      )}

      <div className="grid gap-4">
        {projects.map(proj => (
          <div key={proj._id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{proj.name}</h2>
            <p>{proj.description}</p>
            <p className="text-sm text-gray-500">Members: {proj.members?.map(m => m.name).join(', ')}</p>
            <button onClick={() => deleteProject(proj._id)} className="mt-2 bg-red-500 text-white px-3 py-1 rounded text-sm">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}