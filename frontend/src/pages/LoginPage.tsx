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

        // Validate inputs
        if (!username.trim()) {
            setError('Please enter your username');
            setIsLoading(false);
            return;
        }

        if (!password.trim()) {
            setError('Please enter your password');
            setIsLoading(false);
            return;
        }

        try {
            const response = await authService.login(username, password);
            onLogin(response.token, response.user);
            navigate('/cars');
        } catch (err) {
            // Handle specific error cases
            if (err instanceof Error) {
                if (err.message.includes('401') || err.message.toLowerCase().includes('unauthorized')) {
                    setError('Invalid username or password. Please try again.');
                } else if (err.message.includes('404') || err.message.toLowerCase().includes('not found')) {
                    setError('User not found. Please check your username.');
                } else if (err.message.includes('network') || err.message.toLowerCase().includes('failed to fetch')) {
                    setError('Network error. Please check your internet connection.');
                } else {
                    setError('An error occurred during login. Please try again.');
                }
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2 className="login-title">Welcome Back</h2>
                
                {error && (
                    <div className="error-message" role="alert">
                        <span className="error-icon">⚠️</span>
                        {error}
                    </div>
                )}

                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value);
                            setError(null); // Clear error when user starts typing
                        }}
                        placeholder="Enter your username"
                        required
                        aria-invalid={error ? 'true' : 'false'}
                        aria-describedby={error ? 'error-message' : undefined}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setError(null); // Clear error when user starts typing
                        }}
                        placeholder="Enter your password"
                        required
                        aria-invalid={error ? 'true' : 'false'}
                        aria-describedby={error ? 'error-message' : undefined}
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