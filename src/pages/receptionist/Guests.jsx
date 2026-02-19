import { useState, useEffect } from 'react';
import axios from 'axios';

const Guests = () => {
    const [guests, setGuests] = useState([]);
    const [hotels, setHotels] = useState([]);
    const [selectedHotelId, setSelectedHotelId] = useState('');
    const [loading, setLoading] = useState(false);

    // Billing Modal
    const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
    const [billingDetails, setBillingDetails] = useState(null);
    const [selectedGuestId, setSelectedGuestId] = useState(null);

    useEffect(() => {
        fetchHotels();
    }, []);

    useEffect(() => {
        if (selectedHotelId) {
            fetchGuests();
        }
    }, [selectedHotelId]);

    const fetchHotels = async () => {
        try {
            const res = await axios.get('/api/hotels/get-hotels');
            setHotels(res.data);
            if (res.data.length > 0) {
                setSelectedHotelId(res.data[0].HotelID);
            }
        } catch (err) {
            console.error("Error fetching hotels", err);
        }
    };

    const fetchGuests = async () => {
        setLoading(true);
        try {
            // Using /api/guests/current-guests as per route config
            const res = await axios.post('/api/guests/current-guests', { hotelID: selectedHotelId });
            setGuests(res.data);
        } catch (err) {
            console.error("Error fetching guests:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckoutClick = async (guestId) => {
        setSelectedGuestId(guestId);
        try {
            const res = await axios.post('/api/guests/billing-details', { guestID: guestId });
            setBillingDetails(res.data);
            setIsBillingModalOpen(true);
        } catch (err) {
            console.error("Error fetching billing:", err);
            alert("Failed to fetch billing details.");
        }
    };

    const handleConfirmPayment = async () => {
        try {
            // Confirm payment/checkout
            await axios.post('/api/guests/payment-done', {
                guestID: selectedGuestId,
                amount: billingDetails.AmountToBePaid
            });
            alert("Checkout Successful!");
            setIsBillingModalOpen(false);
            fetchGuests(); // Refresh list
        } catch (err) {
            console.error("Checkout error:", err);
            alert("Checkout Failed.");
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827' }}>Guest Management</h1>
                <select
                    value={selectedHotelId}
                    onChange={(e) => setSelectedHotelId(e.target.value)}
                    style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db' }}
                >
                    {hotels.map(h => <option key={h.HotelID} value={h.HotelID}>{h.Name}</option>)}
                </select>
            </div>

            {loading ? (
                <div>Loading guests...</div>
            ) : (
                <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                            <tr>
                                <th style={{ padding: '1rem', fontWeight: '600', color: '#374151' }}>Room</th>
                                <th style={{ padding: '1rem', fontWeight: '600', color: '#374151' }}>Guest Name</th>
                                <th style={{ padding: '1rem', fontWeight: '600', color: '#374151' }}>Check In</th>
                                <th style={{ padding: '1rem', fontWeight: '600', color: '#374151' }}>Check Out</th>
                                <th style={{ padding: '1rem', fontWeight: '600', color: '#374151' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {guests.length === 0 ? (
                                <tr><td colSpan="5" style={{ padding: '1.5rem', textAlign: 'center', color: '#6b7280' }}>No guests currently checked in.</td></tr>
                            ) : (
                                guests.map((guest, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                        <td style={{ padding: '1rem', fontWeight: 'bold', color: '#2563eb' }}>{guest.RoomNumber}</td>
                                        <td style={{ padding: '1rem', fontWeight: '500' }}>{guest.FirstName} {guest.LastName}</td>
                                        <td style={{ padding: '1rem', color: '#6b7280' }}>{guest.CheckInDate}</td>
                                        <td style={{ padding: '1rem', color: '#6b7280' }}>{guest.CheckOutDate}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <button
                                                onClick={() => handleCheckoutClick(guest.GuestID)}
                                                style={{ padding: '0.25rem 0.75rem', backgroundColor: '#ef4444', color: 'white', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                                            >
                                                Check Out
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Billing Modal */}
            {isBillingModalOpen && billingDetails && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '400px', position: 'relative' }}>
                        <button onClick={() => setIsBillingModalOpen(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>

                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Checkout & Billing</h2>

                        <div style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span>Room Charges:</span>
                                <span>${billingDetails.RoomTotal.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span>Features/Extras:</span>
                                <span>${billingDetails.FeatureTotal.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '0.5rem', borderTop: '1px solid #d1d5db', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                <span>Total Amount:</span>
                                <span>${billingDetails.AmountToBePaid.toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleConfirmPayment}
                            style={{ width: '100%', padding: '0.75rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                            Confirm Payment & Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Guests;
