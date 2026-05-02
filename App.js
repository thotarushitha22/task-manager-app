import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import API from './api';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import Navbar from './components/Navbar';
import { Toaster } from 'react-hot-toast';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/auth/me')
      .then(res => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      {user && <Navbar user={user} setUser={setUser} />}
      <Routes>
        <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/" />} />
        <Route path="/signup" element={!user ? <Signup setUser={setUser} /> : <Navigate to="/" />} />
        <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/projects" element={user ? <Projects /> : <Navigate to="/login" />} />
        <Route path="/tasks" element={user ? <Tasks /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;