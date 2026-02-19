import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';

const MainLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
            {/* Sidebar */}
            <aside style={{
                width: '260px',
                backgroundColor: 'var(--bg-sidebar)',
                color: 'var(--text-light)',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '4px 0 10px rgba(0,0,0,0.1)',
                zIndex: 10
            }}>
                <div style={{
                    padding: '1.5rem',
                    fontSize: '1.5rem',
                    fontWeight: '800',
                    letterSpacing: '-0.025em',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                }}>
                    <span style={{ fontSize: '1.8rem' }}>🏨</span>
                    Hotel App
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 0' }}>
                    <Sidebar />
                </div>

                <div style={{
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    padding: '1.5rem',
                    backgroundColor: 'rgba(0,0,0,0.2)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: '1.2rem'
                        }}>
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                            <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{user?.name || 'User'}</div>
                            <div style={{ fontSize: '0.8rem', opacity: 0.7, textTransform: 'capitalize' }}>{user?.role || 'Role'}</div>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        style={{
                            width: '100%',
                            padding: '0.75rem',
                            backgroundColor: 'rgba(239, 68, 68, 0.1)', // var(--danger) with opacity
                            color: 'var(--danger)',
                            border: '1px solid var(--danger)',
                            borderRadius: 'var(--radius-md)',
                            cursor: 'pointer',
                            fontWeight: '600',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.backgroundColor = 'var(--danger)';
                            e.target.style.color = 'white';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                            e.target.style.color = 'var(--danger)';
                        }}
                    >
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
                <header style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 5,
                    backgroundColor: 'rgba(243, 244, 246, 0.8)', // var(--bg-main) with opacity
                    backdropFilter: 'blur(12px)',
                    padding: '1rem 2rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid rgba(0,0,0,0.05)'
                }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-main)' }}>
                        {/* Breadcrumb or Page Title Could Go Here */}
                        Dashboard
                    </h2>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {/* Placeholder for Topbar Actions */}
                    </div>
                </header>

                <div style={{ padding: '2rem', maxWidth: '1600px', margin: '0 auto' }}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
