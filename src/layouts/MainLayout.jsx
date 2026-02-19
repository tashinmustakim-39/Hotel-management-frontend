import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MainLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
            {/* Sidebar */}
            <aside style={{
                width: '250px',
                backgroundColor: '#1f2937',
                color: 'white',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{ marginBottom: '2rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
                    Hotel App
                </div>

                <nav style={{ flex: 1 }}>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        <li style={{ marginBottom: '0.5rem' }}>
                            <a href="/dashboard" style={{ color: 'white', textDecoration: 'none', display: 'block', padding: '0.5rem' }}>Dashboard</a>
                        </li>
                        {/* Placeholder for role-based links */}
                    </ul>
                </nav>

                <div style={{ borderTop: '1px solid #374151', paddingTop: '1rem' }}>
                    <div style={{ marginBottom: '0.5rem' }}>{user?.name || 'User'}</div>
                    <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '1rem' }}>{user?.role || 'Role'}</div>
                    <button
                        onClick={handleLogout}
                        style={{
                            width: '100%',
                            padding: '0.5rem',
                            backgroundColor: '#dc2626',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
