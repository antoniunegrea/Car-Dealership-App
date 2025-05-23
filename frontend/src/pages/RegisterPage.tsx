import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/register.css'
import authService from '../service/authService';
import AuthService from '../service/authService';

interface RegisterPageProps {
  authService: AuthService;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ authService }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await authService.register(username, password, role);
      setSuccess('Registration successful! You can now log in.');
      setTimeout(() => navigate('/'), 1500);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2>Register</h2>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        <label>Username</label>
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <label>Role</label>
        <select value={role} onChange={e => setRole(e.target.value)}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Register</button>
        <div style={{ marginTop: 10 }}>
          Already have an account? <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => navigate('/')}>Login</span>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage; 