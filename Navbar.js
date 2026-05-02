import { Link, useNavigate } from 'react-router-dom';
import API from '../api';
import toast from 'react-hot-toast';

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();
  const logout = async () => {
    await API.post('/auth/logout');
    setUser(null);
    toast.success('Logged out');
    navigate('/login');
  };
  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <div className="space-x-4">
        <Link to="/">Dashboard</Link>
        <Link to="/projects">Projects</Link>
        <Link to="/tasks">Tasks</Link>
      </div>
      <div className="flex gap-4 items-center">
        <span>{user.name} ({user.role})</span>
        <button onClick={logout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
      </div>
    </nav>
  );
}