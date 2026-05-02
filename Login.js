import { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import toast from 'react-hot-toast';

export default function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/auth/login', { email, password });
      setUser(data);
      toast.success('Logged in');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded">
      <h2 className="text-2xl mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" placeholder="Email" className="w-full p-2 border rounded" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" className="w-full p-2 border rounded" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Login</button>
      </form>
      <p className="mt-4">No account? <Link to="/signup" className="text-blue-500">Sign up</Link></p>
    </div>
  );
}