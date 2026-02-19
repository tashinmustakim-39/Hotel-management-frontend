import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#111827' }}>
                Dashboard
            </h1>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Welcome, {user?.name}!</h2>
                <p style={{ color: '#4b5563' }}>You are logged in as <strong>{user?.role}</strong>.</p>
                <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#eff6ff', borderRadius: '4px' }}>
                    <p>Select an option from the sidebar to get started.</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
