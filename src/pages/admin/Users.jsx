import { useState, useEffect } from 'react';
import axios from 'axios';
import UserModal from '../../components/admin/UserModal';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/users');
            setUsers(response.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching users:", err);
            setError("Failed to load users.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAddClick = () => {
        setSelectedUser(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleDeleteClick = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        try {
            await axios.delete(`/api/users/delete-user/${userId}`);
            setUsers(users.filter(u => u.id !== userId));
            alert("User deleted successfully");
        } catch (err) {
            console.error("Error deleting user:", err);
            alert("Failed to delete user");
        }
    };

    const handleModalSubmit = async (formData) => {
        try {
            if (selectedUser) {
                // Update
                await axios.put(`/api/users/update-user/${selectedUser.id}`, formData);
                alert("User updated successfully");
            } else {
                // Add
                await axios.post('/api/users/add-user', formData);
                alert("User added successfully");
            }
            setIsModalOpen(false);
            fetchUsers();
        } catch (err) {
            console.error("Error saving user:", err);
            alert(err.response?.data?.message || "Failed to save user");
        }
    };

    if (loading) return <div style={{ padding: '2rem' }}>Loading users...</div>;

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827' }}>User Management</h1>
                <button
                    onClick={handleAddClick}
                    style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: '#2563eb',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '500'
                    }}
                >
                    + Add New User
                </button>
            </div>

            {error && <div style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</div>}

            <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                        <tr>
                            <th style={{ padding: '1rem', fontWeight: '600', color: '#374151' }}>Name</th>
                            <th style={{ padding: '1rem', fontWeight: '600', color: '#374151' }}>Email</th>
                            <th style={{ padding: '1rem', fontWeight: '600', color: '#374151' }}>Role</th>
                            <th style={{ padding: '1rem', fontWeight: '600', color: '#374151' }}>Created At</th>
                            <th style={{ padding: '1rem', fontWeight: '600', color: '#374151' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '1rem', color: '#111827', fontWeight: '500' }}>{user.name}</td>
                                <td style={{ padding: '1rem', color: '#4b5563' }}>{user.email}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        backgroundColor: user.role === 'admin' ? '#fee2e2' : user.role === 'manager' ? '#dbeafe' : '#d1fae5',
                                        color: user.role === 'admin' ? '#991b1b' : user.role === 'manager' ? '#1e40af' : '#065f46',
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '9999px',
                                        fontSize: '0.75rem',
                                        fontWeight: 'bold',
                                        textTransform: 'uppercase'
                                    }}>
                                        {user.role}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
                                    {new Date(user.created_at).toLocaleDateString()}
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => handleEditClick(user)}
                                            style={{
                                                padding: '0.25rem 0.5rem',
                                                border: '1px solid #d1d5db',
                                                borderRadius: '4px',
                                                backgroundColor: 'white',
                                                cursor: 'pointer',
                                                color: '#374151',
                                                fontSize: '0.875rem'
                                            }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(user.id)}
                                            style={{
                                                padding: '0.25rem 0.5rem',
                                                border: '1px solid #fca5a5',
                                                borderRadius: '4px',
                                                backgroundColor: '#fee2e2',
                                                cursor: 'pointer',
                                                color: '#b91c1c',
                                                fontSize: '0.875rem'
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <UserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                initialData={selectedUser}
                title={selectedUser ? "Edit User" : "Add New User"}
            />
        </div>
    );
};

export default Users;
