import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await axios.post('/api/auth/login', formData);
            if (response.data.success) {
                login(response.data.user, response.data.token);
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            width: '100%',
            backgroundColor: '#111827',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Effects */}
            <div style={{
                position: 'absolute',
                top: '-10%',
                left: '-10%',
                width: '50%',
                height: '50%',
                background: 'radial-gradient(circle, rgba(79, 70, 229, 0.2) 0%, rgba(0,0,0,0) 70%)',
                filter: 'blur(80px)',
                zIndex: 0
            }} />
            <div style={{
                position: 'absolute',
                bottom: '-10%',
                right: '-10%',
                width: '50%',
                height: '50%',
                background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(0,0,0,0) 70%)',
                filter: 'blur(80px)',
                zIndex: 0
            }} />

            {/* Left Side - Hero Content */}
            <div className="auth-hero" style={{
                flex: 1,
                position: 'relative',
                zIndex: 1,
                display: 'none', // Hidden on mobile, shown via CSS media query if we were using classes, but here we use inline style logic or keep it simple.
                // Note: The CSS media query in index.css controls .auth-hero display: block for lg screens
                padding: '4rem',
                flexDirection: 'column',
                justifyContent: 'center',
                color: 'white'
            }}>
                <div style={{
                    maxWidth: '600px',
                    marginLeft: 'auto',
                    marginRight: '4rem'
                }}>
                    <h1 style={{
                        fontSize: '4rem',
                        fontWeight: '800',
                        lineHeight: 1.1,
                        marginBottom: '1.5rem',
                        background: 'linear-gradient(to right, #ffffff, #a5b4fc)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Orchestrate<br />Excellence.
                    </h1>
                    <p style={{
                        fontSize: '1.25rem',
                        color: '#9ca3af',
                        lineHeight: 1.6,
                        maxWidth: '480px'
                    }}>
                        The premium solution for modern hotel management. Streamline operations, enhance guest experiences, and drive growth.
                    </p>

                    <div style={{ marginTop: '3rem', display: 'flex', gap: '2rem' }}>
                        <div>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>50+</div>
                            <div style={{ color: '#6b7280', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hotels Managed</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>12k</div>
                            <div style={{ color: '#6b7280', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Daily Guests</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '2rem',
                position: 'relative',
                zIndex: 1
            }}>
                <div style={{
                    width: '100%',
                    maxWidth: '420px',
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    padding: '3rem',
                    borderRadius: '24px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                }}>
                    <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
                        <div style={{
                            fontSize: '2rem',
                            marginBottom: '1rem'
                        }}>🏨</div>
                        <h2 style={{
                            fontSize: '1.75rem',
                            fontWeight: 'bold',
                            color: 'white',
                            marginBottom: '0.5rem'
                        }}>Welcome Back</h2>
                        <p style={{ color: '#9ca3af' }}>Sign in to your dashboard</p>
                    </div>

                    {error && (
                        <div style={{
                            backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            color: '#fca5a5',
                            padding: '0.75rem',
                            borderRadius: '8px',
                            marginBottom: '1.5rem',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            fontSize: '0.875rem',
                            textAlign: 'center'
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#d1d5db' }}>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '8px',
                                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    color: 'white',
                                    outline: 'none',
                                    transition: 'border-color 0.2s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#d1d5db' }}>Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '8px',
                                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    color: 'white',
                                    outline: 'none',
                                    transition: 'border-color 0.2s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                                onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            style={{
                                marginTop: '1rem',
                                padding: '0.875rem',
                                backgroundColor: '#4f46e5',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: '600',
                                fontSize: '1rem',
                                cursor: isLoading ? 'not-allowed' : 'pointer',
                                opacity: isLoading ? 0.7 : 1,
                                transition: 'background-color 0.2s'
                            }}
                            onMouseOver={(e) => !isLoading && (e.target.style.backgroundColor = '#4338ca')}
                            onMouseOut={(e) => !isLoading && (e.target.style.backgroundColor = '#4f46e5')}
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: '2rem', color: '#9ca3af', fontSize: '0.875rem' }}>
                        Don't have an account? <Link to="/register" style={{ color: '#818cf8', fontWeight: '500' }}>Register</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
