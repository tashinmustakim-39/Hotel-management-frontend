import { useState, useEffect } from 'react';
import axios from 'axios';

const StatCard = ({ title, value, color }) => (
    <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '1.5rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        borderLeft: `4px solid ${color}`,
        flex: '1 1 200px'
    }}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{title}</h3>
        <p style={{ fontSize: '1.875rem', fontWeight: '600', color: '#111827' }}>{value}</p>
    </div>
);

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('/api/admin/dashboard/stats');
                if (response.data.success) {
                    setStats(response.data.stats);
                }
            } catch (err) {
                console.error("Error fetching admin stats:", err);
                setError(err.response?.data?.message || err.message || "Failed to load dashboard statistics.");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div style={{ padding: '2rem', color: '#6b7280' }}>Loading dashboard...</div>;
    if (error) return <div style={{ padding: '2rem', color: '#ef4444' }}>Error: {error}</div>;

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827' }}>Admin Overview</h1>
                <p style={{ color: '#6b7280' }}>Here's what's happening across your hotels.</p>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                <StatCard title="Active Hotels" value={stats.hotels} color="#3b82f6" />
                <StatCard title="Total Rooms" value={stats.rooms} color="#10b981" />
                <StatCard title="Registered Users" value={stats.users} color="#8b5cf6" />
                <StatCard title="Bookings" value={stats.bookings} color="#f59e0b" />
                <StatCard
                    title="Revenue"
                    value={`$${stats.revenue.toLocaleString()}`}
                    color="#ef4444"
                />
            </div>

            {/* Placeholder for future charts */}
            <div style={{ marginTop: '3rem', padding: '2rem', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Recent Activity</h2>
                <p style={{ color: '#9ca3af', fontStyle: 'italic' }}>Detailed analytics coming soon...</p>
            </div>
        </div>
    );
};

export default AdminDashboard;
