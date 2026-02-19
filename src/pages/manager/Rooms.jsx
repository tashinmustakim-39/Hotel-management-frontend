import { useState, useEffect } from 'react';
import axios from 'axios';
import RoomModal from '../../components/manager/RoomModal';

const Rooms = () => {
    const [hotels, setHotels] = useState([]);
    const [selectedHotelId, setSelectedHotelId] = useState('');
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);

    // Fetch Hotels for the dropdown
    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const response = await axios.get('/api/hotels/get-hotels');
                setHotels(response.data);
                if (response.data.length > 0) {
                    setSelectedHotelId(response.data[0].HotelID); // Default to first hotel
                }
            } catch (err) {
                console.error("Error fetching hotels:", err);
                setError("Failed to load hotels. Please try again.");
            }
        };
        fetchHotels();
    }, []);

    // Fetch Rooms when a hotel is selected
    useEffect(() => {
        if (selectedHotelId) {
            fetchRooms(selectedHotelId);
        }
    }, [selectedHotelId]);

    const fetchRooms = async (hotelId) => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/rooms/get-hotel-rooms/${hotelId}`);
            setRooms(response.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching rooms:", err);
            setError("Failed to load rooms.");
        } finally {
            setLoading(false);
        }
    };

    const handleHotelChange = (e) => {
        setSelectedHotelId(e.target.value);
    };

    const handleAddClick = () => {
        if (!selectedHotelId) {
            alert("Please select a hotel first.");
            return;
        }
        setSelectedRoom(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (room) => {
        setSelectedRoom(room);
        setIsModalOpen(true);
    };

    const handleDeleteClick = async (roomId) => {
        if (!window.confirm("Are you sure you want to delete this room?")) return;

        try {
            await axios.delete(`/api/rooms/delete-room/${roomId}`);
            setRooms(rooms.filter(r => r.id !== roomId));
            alert("Room deleted successfully");
        } catch (err) {
            console.error("Error deleting room:", err);
            alert("Failed to delete room");
        }
    };

    const handleModalSubmit = async (formData, imageFile) => {
        const data = new FormData();
        data.append('hotelID', selectedHotelId);
        data.append('roomNumber', formData.roomNumber);
        data.append('type', formData.type);
        data.append('price', formData.price);
        data.append('capacity', formData.capacity);
        if (imageFile) {
            data.append('roomImage', imageFile);
        }

        try {
            if (selectedRoom) {
                // Update
                await axios.put(`/api/rooms/update-room/${selectedRoom.id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                alert("Room updated successfully");
            } else {
                // Add
                await axios.post('/api/rooms/add-room', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                alert("Room added successfully");
            }
            setIsModalOpen(false);
            fetchRooms(selectedHotelId);
        } catch (err) {
            console.error("Error saving room:", err);
            alert(err.response?.data?.message || err.response?.data?.error || "Failed to save room");
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827' }}>Room Management</h1>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <select
                        value={selectedHotelId}
                        onChange={handleHotelChange}
                        style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', cursor: 'pointer' }}
                    >
                        <option value="" disabled>Select Hotel</option>
                        {hotels.map(hotel => (
                            <option key={hotel.HotelID} value={hotel.HotelID}>{hotel.Name}</option>
                        ))}
                    </select>

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
                        + Add New Room
                    </button>
                </div>
            </div>

            {error && <div style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</div>}

            {loading ? (
                <div>Loading rooms...</div>
            ) : rooms.length === 0 ? (
                <div style={{ color: '#6b7280', textAlign: 'center', marginTop: '3rem' }}>
                    No rooms found for this hotel. Add one to get started!
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {rooms.map(room => (
                        <div key={room.id} style={{
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <div style={{ height: '180px', backgroundColor: '#e5e7eb', overflow: 'hidden', position: 'relative' }}>
                                {room.image ? (
                                    <img
                                        src={`data:image/jpeg;base64,${room.image}`}
                                        alt={`Room ${room.room_number}`}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9ca3af' }}>
                                        No Image
                                    </div>
                                )}
                                <div style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    backgroundColor: room.status === 'available' ? '#10b981' : '#f59e0b',
                                    color: 'white',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '9999px',
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold',
                                    textTransform: 'capitalize'
                                }}>
                                    {room.status}
                                </div>
                            </div>

                            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>#{room.room_number}</h3>
                                    <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#2563eb' }}>${room.price}</span>
                                </div>

                                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                                    <span style={{ backgroundColor: '#f3f4f6', color: '#374151', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem' }}>
                                        {room.type}
                                    </span>
                                    <span style={{ backgroundColor: '#f3f4f6', color: '#374151', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem' }}>
                                        👥 {room.capacity}
                                    </span>
                                </div>

                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                                    <button
                                        onClick={() => handleEditClick(room)}
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
                                        onClick={() => handleDeleteClick(room.id)}
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
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <RoomModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                initialData={selectedRoom}
                title={selectedRoom ? "Edit Room" : "Add New Room"}
            />
        </div >
    );
};

export default Rooms;
