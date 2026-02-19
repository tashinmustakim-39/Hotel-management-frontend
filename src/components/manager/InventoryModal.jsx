import { useState, useEffect } from 'react';

const InventoryModal = ({ isOpen, onClose, onSubmit, mode, inventoryItems, initialSelectedId, title }) => {
    // mode: 'add-item' or 'order-item'
    const [formData, setFormData] = useState({
        itemName: '',
        inventoryID: '',
        quantity: '',
        unitPrice: ''
    });

    useEffect(() => {
        if (isOpen) {
            if (mode === 'order-item' && initialSelectedId && inventoryItems) {
                const item = inventoryItems.find(i => i.InventoryID == initialSelectedId);
                setFormData({
                    itemName: '',
                    inventoryID: initialSelectedId,
                    quantity: '',
                    unitPrice: item ? item.UnitPrice : ''
                });
            } else {
                setFormData({
                    itemName: '',
                    inventoryID: '',
                    quantity: '',
                    unitPrice: ''
                });
            }
        }
    }, [isOpen, initialSelectedId, inventoryItems, mode]);

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

    const handleItemSelect = (e) => {
        const selectedId = e.target.value;
        const item = inventoryItems.find(i => i.InventoryID == selectedId);
        setFormData(prev => ({
            ...prev,
            inventoryID: selectedId,
            unitPrice: item ? item.UnitPrice : ''
        }));
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
                borderRadius: '12px',
                width: '100%',
                maxWidth: '500px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>{title}</h2>
                    <button
                        onClick={onClose}
                        style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#6b7280' }}
                    >
                        &times;
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                    {mode === 'add-item' && (
                        <>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '500' }}>Item Name</label>
                                <input
                                    type="text"
                                    name="itemName"
                                    value={formData.itemName}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. Towels, Soap, Light Bulbs"
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
                                />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '500' }}>Initial Quantity</label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={formData.quantity}
                                        onChange={handleChange}
                                        min="0"
                                        placeholder="0"
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '500' }}>Unit Price ($)</label>
                                    <input
                                        type="number"
                                        name="unitPrice"
                                        value={formData.unitPrice}
                                        onChange={handleChange}
                                        min="0.01"
                                        step="0.01"
                                        placeholder="0.00"
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {mode === 'order-item' && (
                        <>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '500' }}>Select Item</label>
                                <select
                                    name="inventoryID"
                                    value={formData.inventoryID}
                                    onChange={handleItemSelect}
                                    required
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
                                >
                                    <option value="" disabled>Select an item...</option>
                                    {inventoryItems.map(item => (
                                        <option key={item.InventoryID} value={item.InventoryID}>{item.ItemName} (Current: {item.Quantity})</option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '500' }}>Quantity</label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={formData.quantity}
                                        onChange={handleChange}
                                        required
                                        min="1"
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '500' }}>Unit Price ($)</label>
                                    <input
                                        type="number"
                                        name="unitPrice"
                                        value={formData.unitPrice}
                                        readOnly
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db', backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
                                    />
                                    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>Fixed per item settings</span>
                                </div>
                            </div>

                            {/* Total Price Display */}
                            {formData.quantity && formData.unitPrice && (
                                <div style={{
                                    padding: '1rem',
                                    backgroundColor: '#eff6ff',
                                    borderRadius: '8px',
                                    border: '1px solid #bfdbfe',
                                    color: '#1e40af',
                                    fontWeight: 'bold',
                                    textAlign: 'right'
                                }}>
                                    Total Price: ${(parseFloat(formData.quantity) * parseFloat(formData.unitPrice)).toFixed(2)}
                                </div>
                            )}
                        </>
                    )}

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                flex: 1,
                                padding: '0.75rem',
                                backgroundColor: 'white',
                                color: '#374151',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: '500'
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            style={{
                                flex: 1,
                                padding: '0.75rem',
                                backgroundColor: '#2563eb',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: '500'
                            }}
                        >
                            {mode === 'add-item' ? 'Add Item' : 'Place Order'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InventoryModal;
