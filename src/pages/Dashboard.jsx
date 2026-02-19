import { useAuth } from '../context/AuthContext';
import AdminDashboard from '../components/admin/AdminDashboard';

const Dashboard = () => {
    const { user } = useAuth();

    if (user?.role === 'admin') {
        return <AdminDashboard />;
    }

    return (
        <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#111827', fontWeight: 'bold' }}>
                Dashboard
            </h1>
            <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#111827' }}>Welcome back, {user?.name}!</h2>
                <div style={{ display: 'inline-block', padding: '0.25rem 0.75rem', backgroundColor: '#e0e7ff', color: '#4338ca', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: '500', marginBottom: '1.5rem' }}>
                    {user?.role?.toUpperCase()}
                </div>
                <p style={{ color: '#4b5563', lineHeight: '1.5' }}>
                    Select an option from the sidebar to manage your tasks.
                </p>
            </div>
        </div>
    );
};

export default Dashboard;
