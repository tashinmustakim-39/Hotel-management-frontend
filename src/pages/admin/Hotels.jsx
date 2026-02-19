import { useState, useEffect } from 'react';
import axios from 'axios';
import HotelModal from '../../components/admin/HotelModal';

const Hotels = () => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedHotel, setSelectedHotel] = useState(null);

    const fetchHotels = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/hotels/get-hotels');
            setHotels(response.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching hotels:", err);
            setError(err.response?.data?.message || err.message || "Failed to load hotels.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHotels();
    }, []);

    const handleAddClick = () => {
        setSelectedHotel(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (hotel) => {
        setSelectedHotel(hotel);
        setIsModalOpen(true);
    };

    const handleDeactivate = async (id) => {
        if (!window.confirm("Are you sure you want to deactivate this hotel?")) return;

        try {
            await axios.put(`/api/hotels/deactivate-hotel/${id}`);
            alert("Hotel deactivated successfully");
            fetchHotels();
        } catch (err) {
            console.error("Error deactivating hotel:", err);
            alert("Failed to deactivate hotel");
        }
    };

    const handleModalSubmit = async (formData, imageFile) => {
        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('location', formData.location);
        data.append('starRating', formData.starRating);
        data.append('status', formData.status);
        if (imageFile) {
            data.append('hotelImage', imageFile);
        }

        try {
            if (selectedHotel) {
                // Update
                await axios.put(`/api/hotels/update-hotel/${selectedHotel.HotelID}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                alert("Hotel updated successfully");
            } else {
                // Add
                await axios.post('/api/hotels/add-hotel', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                alert("Hotel added successfully");
            }
            setIsModalOpen(false);
            fetchHotels();
        } catch (err) {
            console.error("Error saving hotel:", err);
            alert(err.response?.data?.message || "Failed to save hotel");
        }
    };

    if (loading) return <div style={{ padding: '2rem' }}>Loading hotels...</div>;

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827' }}>Hotel Management</h1>
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
                    + Add New Hotel
                </button>
            </div>

            {error && <div style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</div>}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {hotels.map(hotel => (
                    <div key={hotel.HotelID} style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <div style={{ height: '200px', backgroundColor: '#e5e7eb', overflow: 'hidden' }}>
                            {hotel.HotelImage ? (
                                <img
                                    src={`data:image/jpeg;base64,${hotel.HotelImage}`}
                                    alt={hotel.Name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            ) : (
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9ca3af' }}>
                                    No Image
                                </div>
                            )}
                        </div>

                        <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>{hotel.Name}</h3>
                                <span style={{
                                    backgroundColor: '#fef3c7',
                                    color: '#d97706',
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '4px',
                                    fontSize: '0.875rem',
                                    fontWeight: 'bold'
                                }}>
                                    {hotel.StarRating} ★
                                </span>
                            </div>

                            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
                                📍 {typeof hotel.Location === 'string' ? hotel.Location : JSON.stringify(hotel.Location)}
                            </p>

                            <p style={{ color: '#374151', marginBottom: '1.5rem', flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {hotel.Description}
                            </p>

                            <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
                                <button
                                    onClick={() => handleEditClick(hotel)}
                                    style={{
                                        flex: 1,
                                        padding: '0.5rem',
                                        backgroundColor: '#f3f4f6',
                                        color: '#374151',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontWeight: '500'
                                    }}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeactivate(hotel.HotelID)}
                                    style={{
                                        flex: 1,
                                        padding: '0.5rem',
                                        backgroundColor: '#fee2e2',
                                        color: '#b91c1c',
                                        border: '1px solid #fca5a5',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontWeight: '500'
                                    }}
                                >
                                    Deactivate
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <HotelModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                initialData={selectedHotel}
                title={selectedHotel ? "Edit Hotel" : "Add New Hotel"}
            />
        </div>
    );
};

export default Hotels;
