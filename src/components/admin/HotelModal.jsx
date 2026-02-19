import { useState, useEffect } from 'react';

const HotelModal = ({ isOpen, onClose, onSubmit, initialData = null, title }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        location: '',
        starRating: 3,
        status: 'active'
    });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.Name || '',
                description: initialData.Description || '',
                location: typeof initialData.Location === 'string' ? initialData.Location : JSON.stringify(initialData.Location) || '', // Simplify location handling for now
                starRating: initialData.StarRating || 3,
                status: initialData.Status || 'active'
            });
            // If there's an existing image, we might want to show it, but for now we'll just handle new uploads
            setPreview(initialData.HotelImage ? `data:image/jpeg;base64,${initialData.HotelImage}` : null);
        } else {
            // Reset form for "Add New"
            setFormData({
                name: '',
                description: '',
                location: '',
                starRating: 3,
                status: 'active'
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
        // Return data to parent to handle API call
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
                maxWidth: '600px',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{title}</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* Image Upload */}
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Hotel Image</label>
                        <div style={{
                            border: '2px dashed #d1d5db',
                            padding: '1rem',
                            borderRadius: '8px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            position: 'relative',
                            height: '200px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            overflow: 'hidden',
                            backgroundColor: '#f9fafb'
                        }} onClick={() => document.getElementById('hotelImageInput').click()}>
                            {preview ? (
                                <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <span style={{ color: '#6b7280' }}>Click to upload image</span>
                            )}
                            <input
                                id="hotelImageInput"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Star Rating</label>
                            <select
                                name="starRating"
                                value={formData.starRating}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
                            >
                                <option value="1">1 Star</option>
                                <option value="2">2 Stars</option>
                                <option value="3">3 Stars</option>
                                <option value="4">4 Stars</option>
                                <option value="5">5 Stars</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="City, Country"
                            required
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            required
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '4px', resize: 'vertical' }}
                        />
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
                            {initialData ? 'Update Hotel' : 'Create Hotel'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HotelModal;
