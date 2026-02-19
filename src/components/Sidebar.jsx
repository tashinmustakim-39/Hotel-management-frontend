import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user } = useAuth();
    const role = user?.role;

    const linkStyle = ({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        padding: '0.75rem 1.5rem',
        color: isActive ? 'white' : '#9ca3af',
        backgroundColor: isActive ? 'var(--primary)' : 'transparent',
        textDecoration: 'none',
        borderLeft: isActive ? '4px solid white' : '4px solid transparent',
        transition: 'all 0.2s',
        fontWeight: isActive ? '600' : '500',
        fontSize: '0.95rem'
    });

    const SectionHeader = ({ title }) => (
        <div style={{
            textTransform: 'uppercase',
            fontSize: '0.7rem',
            color: '#6b7280',
            fontWeight: 'bold',
            marginTop: '1.5rem',
            marginBottom: '0.5rem',
            paddingLeft: '1.5rem',
            letterSpacing: '0.05em'
        }}>
            {title}
        </div>
    );

    return (
        <nav>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
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
