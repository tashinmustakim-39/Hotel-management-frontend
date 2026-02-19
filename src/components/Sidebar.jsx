import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user } = useAuth();
    const role = user?.role;

    const linkStyle = ({ isActive }) => ({
        display: 'block',
        padding: '0.75rem 1rem',
        color: isActive ? 'white' : '#9ca3af',
        backgroundColor: isActive ? '#374151' : 'transparent',
        textDecoration: 'none',
        borderRadius: '4px',
        marginBottom: '0.25rem',
        transition: 'all 0.2s',
        fontWeight: isActive ? 'bold' : 'normal'
    });

    const SectionHeader = ({ title }) => (
        <div style={{
            textTransform: 'uppercase',
            fontSize: '0.75rem',
            color: '#6b7280',
            fontWeight: 'bold',
            marginTop: '1.5rem',
            marginBottom: '0.5rem',
            paddingLeft: '0.5rem'
        }}>
            {title}
        </div>
    );

    return (
        <nav style={{ flex: 1, overflowY: 'auto' }}>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                <li>
                    <NavLink to="/dashboard" style={linkStyle}>
                        Dashboard
                    </NavLink>
                </li>

                {/* Admin Links */}
                {role === 'admin' && (
                    <>
                        <SectionHeader title="Management" />
                        <li><NavLink to="/hotels" style={linkStyle}>Hotels</NavLink></li>
                        <li><NavLink to="/rooms" style={linkStyle}>Rooms</NavLink></li>
                        <li><NavLink to="/expenses" style={linkStyle}>Expenses</NavLink></li>
                        <li><NavLink to="/users" style={linkStyle}>Users</NavLink></li>
                    </>
                )}

                {/* Manager Links */}
                {role === 'manager' && (
                    <>
                        <SectionHeader title="Operations" />
                        <li><NavLink to="/rooms" style={linkStyle}>Rooms</NavLink></li>
                        <li><NavLink to="/employees" style={linkStyle}>Employees</NavLink></li>
                        <li><NavLink to="/inventory" style={linkStyle}>Inventory</NavLink></li>
                        <SectionHeader title="Finance" />
                        <li><NavLink to="/manager-expenses" style={linkStyle}>Expenses</NavLink></li>
                    </>
                )}

                {/* Receptionist Links */}
                {role === 'receptionist' && (
                    <>
                        <SectionHeader title="Front Desk" />
                        <li><NavLink to="/bookings" style={linkStyle}>Bookings</NavLink></li>
                        <li><NavLink to="/guests" style={linkStyle}>Guests</NavLink></li>
                    </>
                )}

                {/* User (Guest) Links */}
                {(role === 'user' || !role) && (
                    /* Assuming 'user' or null/undefined if we want to default to user view, 
                       but strictly speaking 'user' role should be explicit from backend.*/
                    <>
                        <SectionHeader title="My Account" />
                        <li><NavLink to="/my-bookings" style={linkStyle}>My Bookings</NavLink></li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Sidebar;
