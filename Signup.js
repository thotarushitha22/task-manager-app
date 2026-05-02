import { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import toast from 'react-hot-toast';

export default function Signup({ setUser }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('member');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/auth/signup', { name, email, password, role });
      setUser(data);
      toast.success('Account created');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded">
      <h2 className="text-2xl mb-4">Sign Up</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Full Name" className="w-full p-2 border rounded" value={name} onChange={e => setName(e.target.value)} required />
        <input type="email" placeholder="Email" className="w-full p-2 border rounded" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" className="w-full p-2 border rounded" value={password} onChange={e => setPassword(e.target.value)} required />
        <select className="w-full p-2 border rounded" value={role} onChange={e => setRole(e.target.value)}>
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">Sign Up</button>
      </form>
      <p className="mt-4">Already have an account? <Link to="/login" className="text-blue-500">Login</Link></p>
    </div>
  );
}