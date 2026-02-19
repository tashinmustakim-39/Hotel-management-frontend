import { useAuth } from '../context/AuthContext';
import AdminDashboard from '../components/admin/AdminDashboard';

const Dashboard = () => {
    const { user } = useAuth();

    if (user?.role === 'admin') {
        return <AdminDashboard />;
    }

    return (
        <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem', fontWeight: 'bold' }}>
                Dashboard
            </h1>
            <div className="card">
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>Welcome back, {user?.name}!</h2>
                <div style={{
                    display: 'inline-block',
                    padding: '0.25rem 0.75rem',
                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                    color: 'var(--primary)',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    marginBottom: '1.5rem'
                }}>
                    {user?.role?.toUpperCase()}
                </div>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
                    Select an option from the sidebar to manage your tasks.
                </p>
            </div>
        </div>
    );
};

export default Dashboard;
