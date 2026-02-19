import { useState, useEffect } from 'react';

const RoomModal = ({ isOpen, onClose, onSubmit, initialData = null, title }) => {
    const [formData, setFormData] = useState({
        roomNumber: '',
        type: 'Single',
        price: '',
        capacity: 1,
        status: 'available' // default status
    });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (initialData) {
            setFormData({
                roomNumber: initialData.room_number || '',
                type: initialData.type || 'Single',
                price: initialData.price || '',
                capacity: initialData.capacity || 1,
                status: initialData.status || 'available'
            });
            // Handle existing image if needed
            setPreview(initialData.image ? `data:image/jpeg;base64,${initialData.image}` : null);
        } else {
            // Reset
            setFormData({
                roomNumber: '',
                type: 'Single',
                price: '',
                capacity: 1,
                status: 'available'
            });
            setImage(null);
            setPreview(null);
        }
    }, [initialData, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData, image);
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '2rem',
                width: '100%',
                maxWidth: '500px',
                maxHeight: '90vh',
                overflowY: 'auto'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{title}</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    {/* Image Upload */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Room Image</label>
                        <div style={{
                            border: '2px dashed #d1d5db',
                            padding: '1rem',
                            borderRadius: '8px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            position: 'relative',
                            height: '150px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            overflow: 'hidden',
                            backgroundColor: '#f9fafb'
                        }} onClick={() => document.getElementById('roomImageInput').click()}>
                            {preview ? (
                                <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <span style={{ color: '#6b7280' }}>Click to upload image</span>
                            )}
                            <input
                                id="roomImageInput"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Room Number</label>
                        <input
                            type="text"
                            name="roomNumber"
                            value={formData.roomNumber}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Type</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
                        >
                            <option value="Single">Single</option>
                            <option value="Double">Double</option>
                            <option value="Suite">Suite</option>
                            <option value="Deluxe">Deluxe</option>
                        </select>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Price ($)</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Capacity</label>
                            <input
                                type="number"
                                name="capacity"
                                value={formData.capacity}
                                onChange={handleChange}
                                min="1"
                                required
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{ padding: '0.75rem 1.5rem', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: 'white', cursor: 'pointer' }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            style={{ padding: '0.75rem 1.5rem', border: 'none', borderRadius: '4px', backgroundColor: '#2563eb', color: 'white', cursor: 'pointer' }}
                        >
                            {initialData ? 'Update Room' : 'Add Room'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RoomModal;
