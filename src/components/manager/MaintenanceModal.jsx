import { useState, useEffect } from 'react';

const MaintenanceModal = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        serviceType: '',
        amount: '',
        ledgerDate: new Date().toISOString().split('T')[0],
        description: ''
    });

    useEffect(() => {
        if (isOpen) {
            setFormData({
                serviceType: '',
                amount: '',
                ledgerDate: new Date().toISOString().split('T')[0],
                description: ''
            });
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '8px',
                width: '100%',
                maxWidth: '500px',
                position: 'relative'
            }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'none',
                        border: 'none',
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                        color: '#6b7280'
                    }}
                >
                    &times;
                </button>

                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#111827' }}>
                    Add Maintenance Entry
                </h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', textTransform: 'uppercase', color: '#6b7280', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                            Service Type
                        </label>
                        <select
                            name="serviceType"
                            value={formData.serviceType}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #d1d5db', outline: 'none' }}
                        >
                            <option value="">Select Service Type</option>
                            <option value="Plumbing">Plumbing</option>
                            <option value="Electrical">Electrical</option>
                            <option value="HVAC">HVAC (Heating/Cooling)</option>
                            <option value="Cleaning">Deep Cleaning</option>
                            <option value="Painting">Painting/Decor</option>
                            <option value="Furniture">Furniture Repair</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', textTransform: 'uppercase', color: '#6b7280', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                            Amount ($)
                        </label>
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            required
                            min="0"
                            step="0.01"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #d1d5db', outline: 'none' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', textTransform: 'uppercase', color: '#6b7280', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                            Date
                        </label>
                        <input
                            type="date"
                            name="ledgerDate"
                            value={formData.ledgerDate}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #d1d5db', outline: 'none' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', textTransform: 'uppercase', color: '#6b7280', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="3"
                            placeholder="Details about the work done..."
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #d1d5db', outline: 'none' }}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid #d1d5db', backgroundColor: 'white', cursor: 'pointer', color: '#374151' }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', backgroundColor: '#2563eb', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            Add Entry
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MaintenanceModal;
