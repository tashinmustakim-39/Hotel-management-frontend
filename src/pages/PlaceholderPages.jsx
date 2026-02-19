const PageHeader = ({ title }) => (
    <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', color: '#111827' }}>{title}</h1>
        <p style={{ color: '#6b7280' }}>Feature implementation coming soon.</p>
    </div>
);

export const Hotels = () => <PageHeader title="Hotel Management" />;
export const Expenses = () => <PageHeader title="Expense Management" />;
export const Users = () => <PageHeader title="User Management" />;
export const Rooms = () => <PageHeader title="Room Management" />;
export const Employees = () => <PageHeader title="Employee Management" />;
export const Inventory = () => <PageHeader title="Inventory Management" />;
export const Bookings = () => <PageHeader title="Booking Management" />;
export const Guests = () => <PageHeader title="Guest Directory" />;
export const MyBookings = () => <PageHeader title="My Bookings" />;
