import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        console.log('submit');
        e.preventDefault();

        try {
            setLoading(true);
            if (isRegistering) {
                await register(email, password);
            } else {
                await login(email, password);
            }
            console.log('Login Succeeded');
            setLoading(false);
            navigate('/dashboard');
        } catch (err: any) {
            console.log('Login Failed');
            setLoading(false);
            setError(err.response?.data || 'Something went wrong');
        }
    };

    return (
        <div className="page-center">
            <div className="rounded-block login-block">
                    <h1>{isRegistering ? 'Create Account' : 'Log In'}</h1>

                    <form onSubmit={handleSubmit}>
                        <div className='lower-margin'>
                            <input
                                type="email"
                                placeholder='Email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className='lower-margin'>
                            <input
                                type="password"
                                placeholder='Password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {error && <p className="error">{error}</p>}

                        <button type="submit" disabled={loading} className='lower-margin full-width filled loader-parent'>
                            <div className='loader-text'>
                                {isRegistering ? 'Register' : 'Log In'}
                            </div>
                            <div className={`loader ${loading ? 'loader-reveal' : ''}`}></div>
                        </button>

                    </form>

                    <button className='full-width' onClick={() => setIsRegistering(!isRegistering)}>
                        {isRegistering
                            ? 'Already have an account? Log in'
                            : "Sign Up"}
                    </button>
                </div>
        </div>
    );
}