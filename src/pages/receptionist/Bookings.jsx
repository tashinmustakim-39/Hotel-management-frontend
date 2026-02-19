import { useState, useEffect } from 'react';
import axios from 'axios';

const Bookings = () => {
    // Search State
    const [searchParams, setSearchParams] = useState({
        checkInDate: '',
        checkOutDate: '',
        adults: 1,
        children: 0,
        hotelId: 1
    });
    const [availableRooms, setAvailableRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hotels, setHotels] = useState([]);

    // Booking Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [guestDetails, setGuestDetails] = useState({
        name: '',
        email: '',
        phone: ''
    });

    // Manage Bookings State
    const [activeTab, setActiveTab] = useState('new');
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        // Fetch hotels to populate selector
        const fetchHotels = async () => {
            try {
                const res = await axios.get('/api/hotels/get-hotels');
                setHotels(res.data);
                if (res.data.length > 0) {
                    setSearchParams(prev => ({ ...prev, hotelId: res.data[0].HotelID }));
                }
            } catch (err) {
                console.error("Error fetching hotels", err);
            }
        };
        fetchHotels();
    }, []);

    // Fetch all bookings when tab switches to 'manage'
    useEffect(() => {
        if (activeTab === 'manage') {
            fetchBookings();
        }
    }, [activeTab]);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/bookings/all');
            if (res.data.success) {
                setBookings(res.data.bookings);
            }
        } catch (err) {
            console.error("Error fetching bookings:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) return;

        try {
            await axios.post(`/api/bookings/${bookingId}/cancel`);
            alert("Booking Cancelled");
            fetchBookings();
        } catch (err) {
            console.error("Cancel error:", err);
            alert(err.response?.data?.message || "Failed to cancel booking");
        }
    };

    const handleChange = (e) => {
        setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setAvailableRooms([]);

        try {
            const res = await axios.post('/api/bookings/check-availability', searchParams);
            if (res.data.success) {
                setAvailableRooms(res.data.rooms);
            } else {
                setError("Failed to fetch availability.");
            }
        } catch (err) {
            console.error("Search error:", err);
            setError(err.response?.data?.message || "Error checking availability");
        } finally {
            setLoading(false);
        }
    };

    const openBookingModal = (room) => {
        setSelectedRoom(room);
        setIsModalOpen(true);
    };

    const handleGuestChange = (e) => {
        setGuestDetails({ ...guestDetails, [e.target.name]: e.target.value });
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                room_id: selectedRoom.id,
                checkInDate: searchParams.checkInDate,
                checkOutDate: searchParams.checkOutDate,
                adults: searchParams.adults,
                children: searchParams.children,
                guestDetails: guestDetails
            };

            await axios.post('/api/bookings', payload);
            alert("Booking Successful!");
            setIsModalOpen(false);
            setGuestDetails({ name: '', email: '', phone: '' });
            handleSearch({ preventDefault: () => { } });
        } catch (err) {
            console.error("Booking error:", err);
            alert(err.response?.data?.message || "Booking Failed");
        }
    };

    return (
        <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Bookings & Reservations</h1>

            <div style={{ marginBottom: '2rem', borderBottom: '1px solid #e5e7eb', display: 'flex', gap: '1rem' }}>
                <button
                    onClick={() => setActiveTab('new')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        border: 'none',
                        background: 'none',
                        borderBottom: activeTab === 'new' ? '2px solid var(--primary)' : '2px solid transparent',
                        color: activeTab === 'new' ? 'var(--primary)' : 'var(--text-muted)',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontSize: '1rem'
                    }}
                >
                    New Booking
                </button>
                <button
                    onClick={() => setActiveTab('manage')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        border: 'none',
                        background: 'none',
                        borderBottom: activeTab === 'manage' ? '2px solid var(--primary)' : '2px solid transparent',
                        color: activeTab === 'manage' ? 'var(--primary)' : 'var(--text-muted)',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontSize: '1rem'
                    }}
                >
                    Manage Bookings
                </button>
            </div>

            {activeTab === 'new' ? (
                <>
                    {/* Search Section */}
                    <div className="card" style={{ marginBottom: '2rem' }}>
                        <form onSubmit={handleSearch} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', alignItems: 'end' }}>

                            <div>
                                <label style={{ display: 'block', textTransform: 'uppercase', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '700', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>Hotel</label>
                                <select name="hotelId" value={searchParams.hotelId} onChange={handleChange} className="select">
                                    {hotels.map(h => <option key={h.HotelID} value={h.HotelID}>{h.Name}</option>)}
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', textTransform: 'uppercase', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '700', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>Check In</label>
                                <input type="date" name="checkInDate" value={searchParams.checkInDate} onChange={handleChange} required className="input" />
                            </div>

                            <div>
                                <label style={{ display: 'block', textTransform: 'uppercase', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '700', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>Check Out</label>
                                <input type="date" name="checkOutDate" value={searchParams.checkOutDate} onChange={handleChange} required className="input" />
                            </div>

                            <div>
                                <label style={{ display: 'block', textTransform: 'uppercase', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '700', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>Adults</label>
                                <input type="number" name="adults" min="1" value={searchParams.adults} onChange={handleChange} className="input" />
                            </div>

                            <button type="submit" className="btn btn-primary" style={{ height: '42px' }}>
                                {loading ? 'Searching...' : 'Check Availability'}
                            </button>
                        </form>
                    </div>

                    {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', fontWeight: '500' }}>{error}</div>}

                    {/* Results Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {availableRooms.map(room => (
                            <div key={room.id} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                <div style={{ height: '200px', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                    {room.image ? (
                                        <img src={`data:image/jpeg;base64,${room.image}`} alt="Room" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <span style={{ color: '#9ca3af' }}>No Image</span>
                                    )}
                                </div>
                                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-main)' }}>Room {room.room_number}</h3>
                                    <p style={{ color: 'var(--text-muted)', textTransform: 'capitalize' }}>{room.type} Suite (Cap: {room.capacity})</p>
                                    <div style={{ marginTop: 'auto', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>${room.price}</span>
                                        <button
                                            onClick={() => openBookingModal(room)}
                                            className="btn btn-secondary"
                                        >
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {availableRooms.length === 0 && !loading && !error && (
                        <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '4rem' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
                            <p>Enter dates above to search for available rooms.</p>
                        </div>
                    )}
                </>
            ) : (
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                            <tr>
                                <th style={{ padding: '1rem', fontWeight: '600', color: '#374151' }}>ID</th>
                                <th style={{ padding: '1rem', fontWeight: '600', color: '#374151' }}>Guest</th>
                                <th style={{ padding: '1rem', fontWeight: '600', color: '#374151' }}>Room</th>
                                <th style={{ padding: '1rem', fontWeight: '600', color: '#374151' }}>Status</th>
                                <th style={{ padding: '1rem', fontWeight: '600', color: '#374151' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map(booking => (
                                <tr key={booking.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                    <td style={{ padding: '1rem', color: '#6b7280' }}>#{booking.id}</td>
                                    <td style={{ padding: '1rem', fontWeight: '500' }}>{booking.user_name}</td>
                                    <td style={{ padding: '1rem' }}>{booking.room_number}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: '500',
                                            backgroundColor: booking.status === 'active' ? '#dcfce7' : '#fee2e2',
                                            color: booking.status === 'active' ? '#166534' : '#991b1b'
                                        }}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                                        {booking.status === 'active' && (
                                            <button
                                                onClick={() => handleCancelBooking(booking.id)}
                                                className="btn btn-danger"
                                                style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem' }}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Booking Modal */}
            {isModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
                    <div className="card" style={{ width: '100%', maxWidth: '500px', position: 'relative' }}>
                        <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}>&times;</button>

                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Complete Booking</h2>

                        <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
                            <p><strong>Room:</strong> {selectedRoom?.room_number}</p>
                            <p><strong>Dates:</strong> {searchParams.checkInDate} to {searchParams.checkOutDate}</p>
                            <p><strong>Price:</strong> ${selectedRoom?.price} / night</p>
                        </div>

                        <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 'bold', color: '#374151' }}>Guest Details</h3>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', fontWeight: '500' }}>Full Name</label>
                                <input type="text" name="name" value={guestDetails.name} onChange={handleGuestChange} required className="input" />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', fontWeight: '500' }}>Email</label>
                                <input type="email" name="email" value={guestDetails.email} onChange={handleGuestChange} required className="input" />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', fontWeight: '500' }}>Phone</label>
                                <input type="tel" name="phone" value={guestDetails.phone} onChange={handleGuestChange} required className="input" />
                            </div>

                            <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                                Confirm Booking
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Bookings;
