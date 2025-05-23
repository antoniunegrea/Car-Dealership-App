import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';
import { User } from '../model/User';
import { AuthService } from '../service/AuthService';

interface LoginPageProps {
  onLogin: (token: string, user: User) => void;
  authService: AuthService;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, authService }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const data = await authService.login(username, password);
      onLogin(data.token, data.user);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dealerships');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        <label>Username</label>
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
        <div style={{ marginTop: 10 }}>
          Don't have an account? <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => navigate('/register')}>Register</span>
        </div>
      </form>
    </div>
  );
};

export default LoginPage; 