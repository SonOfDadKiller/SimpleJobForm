import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            if (isRegistering) {
                await register(email, password);
            } else {
                await login(email, password);
            }
            navigate('/dashboard');
        } catch (err: any) {
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

                        <button type="submit" className='lower-margin full-width filled'>
                            {isRegistering ? 'Register' : 'Log In'}
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