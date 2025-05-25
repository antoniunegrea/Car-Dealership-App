import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthService } from '../service/AuthService';
import { SessionService } from '../service/SessionService';
import '../styles/login.css';

interface LoginPageProps {
    onLogin: (token: string, user: any) => void;
    authService: AuthService;
    sessionService: SessionService;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, authService, sessionService }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const response = await authService.login(username, password);
            onLogin(response.token, response.user);
            navigate('/cars');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred during login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2 className="login-title">Welcome Back</h2>
                
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                    />
                </div>

                <button 
                    type="submit" 
                    className="login-button"
                    disabled={isLoading}
                >
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>

                <div className="register-link">
                    Don't have an account?{' '}
                    <a href="/register" onClick={(e) => {
                        e.preventDefault();
                        navigate('/register');
                    }}>
                        Register here
                    </a>
                </div>
            </form>
        </div>
    );
};

export default LoginPage; 