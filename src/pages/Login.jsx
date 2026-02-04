import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('/api/auth/login', formData);
            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                // Navigate to dashboard or home on success
                alert('Login Successful!');
                navigate('/');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#f5f5f5'
        }}>
            <div style={{
                padding: '2rem',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                width: '100%',
                maxWidth: '400px'
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#333' }}>Login</h2>

                {error && (
                    <div style={{
                        backgroundColor: '#fee2e2',
                        color: '#dc2626',
                        padding: '0.75rem',
                        borderRadius: '4px',
                        marginBottom: '1rem',
                        textAlign: 'center'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4b5563' }}>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '4px',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4b5563' }}>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '4px',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            marginTop: '1rem',
                            width: '100%',
                            padding: '0.75rem',
                            backgroundColor: '#2563eb',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#2563eb'}
                    >
                        Sign In
                    </button>
                </form>

                <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                    <p style={{ color: '#4b5563' }}>
                        Don't have an account?{' '}
                        <Link to="/register" style={{ color: '#2563eb', textDecoration: 'none' }}>
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
