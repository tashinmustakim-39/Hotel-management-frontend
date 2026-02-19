import { useState, useEffect } from 'react';
import axios from 'axios';
import InventoryModal from '../../components/manager/InventoryModal';

const Inventory = () => {
    const [hotels, setHotels] = useState([]);
    const [selectedHotelId, setSelectedHotelId] = useState('');
    const [activeTab, setActiveTab] = useState('stock'); // 'stock' or 'orders'
    const [inventory, setInventory] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add-item'); // 'add-item' or 'order-item'
    const [preSelectedItemId, setPreSelectedItemId] = useState(null);

    useEffect(() => {
        fetchHotels();
    }, []);

    useEffect(() => {
        if (selectedHotelId) {
            fetchData();
        }
    }, [selectedHotelId, activeTab]);

    const fetchHotels = async () => {
        try {
            const response = await axios.get('/api/hotels/get-hotels');
            setHotels(response.data);
            if (response.data.length > 0) {
                setSelectedHotelId(response.data[0].HotelID);
            }
        } catch (err) {
            console.error("Error fetching hotels:", err);
            setError("Failed to load hotels.");
        }
    };

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            // Always fetch inventory (needed for Stock tab AND Orders tab catalog)
            const invResponse = await axios.get(`/api/inventory/inventory/${selectedHotelId}`);
            setInventory(invResponse.data);

            // Fetch transactions only if on history tab
            if (activeTab === 'history') {
                const txResponse = await axios.get(`/api/inventory/transactions/${selectedHotelId}`);
                setTransactions(txResponse.data);
            }
        } catch (err) {
            console.error("Error fetching data:", err);
            setError("Failed to load inventory data.");
        } finally {
            setLoading(false);
        }
    };

    const handleReceiveOrder = async (transactionID) => {
        try {
            await axios.post('/api/inventory/receive-order', { transactionID });
            alert("Order received and stock updated!");
            fetchData();
        } catch (err) {
            console.error("Error receiving order:", err);
            alert(err.response?.data?.message || err.response?.data || "Failed to receive order");
        }
    };

    const handleDeleteItem = async (inventoryID) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            try {
                await axios.delete(`/api/inventory/delete-item/${inventoryID}`);
                alert("Item deleted successfully");
                fetchData();
            } catch (err) {
                console.error("Error deleting item:", err);
                alert(err.response?.data?.message || err.response?.data || "Failed to delete item");
            }
        }
    };

    const handleModalSubmit = async (formData) => {
        try {
            if (modalMode === 'add-item') {
                await axios.post('/api/inventory/add-item', {
                    hotelID: selectedHotelId,
                    itemName: formData.itemName,
                    quantity: formData.quantity,
                    unitPrice: formData.unitPrice
                });
                alert("Item added successfully");
            } else {
                await axios.post('/api/inventory/order-item', {
                    hotelID: selectedHotelId,
                    inventoryID: formData.inventoryID,
                    quantity: formData.quantity,
                    unitPrice: formData.unitPrice
                });
                alert("Order placed successfully");
            }
            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            console.error("Error submitting form:", err);
            alert(err.response?.data?.message || err.response?.data || "Failed to submit");
        }
    };

    const openModal = (mode) => {
        setModalMode(mode);
        setPreSelectedItemId(null);
        setIsModalOpen(true);
    };

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827' }}>Inventory Management</h1>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <select
                        value={selectedHotelId}
                        onChange={(e) => setSelectedHotelId(e.target.value)}
                        style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', cursor: 'pointer' }}
                    >
                        {hotels.map(hotel => (
                            <option key={hotel.HotelID} value={hotel.HotelID}>{hotel.Name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #e5e7eb', marginBottom: '2rem' }}>
                <button
                    onClick={() => setActiveTab('stock')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        border: 'none',
                        background: 'none',
                        borderBottom: activeTab === 'stock' ? '2px solid #2563eb' : 'none',
                        color: activeTab === 'stock' ? '#2563eb' : '#6b7280',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}
                >
                    Stock Levels
                </button>
                <button
                    onClick={() => setActiveTab('orders')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        border: 'none',
                        background: 'none',
                        borderBottom: activeTab === 'orders' ? '2px solid #2563eb' : 'none',
                        color: activeTab === 'orders' ? '#2563eb' : '#6b7280',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}
                >
                    Orders & Procurement
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        border: 'none',
                        background: 'none',
                        borderBottom: activeTab === 'history' ? '2px solid #2563eb' : 'none',
                        color: activeTab === 'history' ? '#2563eb' : '#6b7280',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}
                >
                    Order History
                </button>
            </div>

            {/* Actions Toolbar - Context Sensitive */}
            <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
                {activeTab === 'stock' && (
                    <button
                        onClick={() => openModal('add-item')}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: '500'
                        }}
                    >
                        + Add New Item
                    </button>
                )}

                {/* No top-level actions needed for Orders (catalog buttons are inline) or History */}
            </div>

            {error && <div style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</div>}

            {loading ? (
                <div>Loading data...</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Stock Tab Content */}
                    {activeTab === 'stock' && (
                        <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                    <tr>
                                        <th style={{ padding: '1rem', fontWeight: '600', color: '#374151' }}>Item Name</th>
                                        <th style={{ padding: '1rem', fontWeight: '600', color: '#374151' }}>In Stock</th>
                                        <th style={{ padding: '1rem', fontWeight: '600', color: '#374151' }}>Unit Price</th>
                                        <th style={{ padding: '1rem', fontWeight: '600', color: '#374151' }}>Last Updated</th>
                                        <th style={{ padding: '1rem', fontWeight: '600', color: '#374151' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inventory.length === 0 ? (
                                        <tr><td colSpan="5" style={{ padding: '1.5rem', textAlign: 'center', color: '#6b7280' }}>No items in inventory.</td></tr>
                                    ) : (
                                        inventory.map(item => (
                                            <tr key={item.InventoryID} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                                <td style={{ padding: '1rem', color: '#111827', fontWeight: '500' }}>{item.ItemName}</td>
                                                <td style={{ padding: '1rem', color: '#111827', fontWeight: 'bold' }}>{item.Quantity}</td>
                                                <td style={{ padding: '1rem', color: '#4b5563' }}>${item.UnitPrice}</td>
                                                <td style={{ padding: '1rem', color: '#6b7280' }}>{new Date(item.LastUpdated).toLocaleDateString()}</td>
                                                <td style={{ padding: '1rem' }}>
                                                    <button
                                                        onClick={() => handleDeleteItem(item.InventoryID)}
                                                        style={{
                                                            padding: '0.25rem 0.75rem',
                                                            backgroundColor: '#ef4444',
                                                            color: 'white',
                                                            border: 'none',
                                                            borderRadius: '4px',
                                                            cursor: 'pointer',
                                                            fontWeight: '500',
                                                            fontSize: '0.875rem'
                                                        }}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Orders Tab Content (Catalog Only) */}
                    {activeTab === 'orders' && (
                        <div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#374151', marginBottom: '1rem' }}>Order Catalog</h2>
                            <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead style={{ backgroundColor: '#eff6ff', borderBottom: '1px solid #dbeafe' }}>
                                        <tr>
                                            <th style={{ padding: '1rem', fontWeight: '600', color: '#1e40af' }}>Item Name</th>
                                            <th style={{ padding: '1rem', fontWeight: '600', color: '#1e40af' }}>Unit Price (Fixed)</th>
                                            <th style={{ padding: '1rem', fontWeight: '600', color: '#1e40af' }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {inventory.map(item => (
                                            <tr key={item.InventoryID} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                                <td style={{ padding: '1rem', fontWeight: '500' }}>{item.ItemName}</td>
                                                <td style={{ padding: '1rem' }}>${item.UnitPrice}</td>
                                                <td style={{ padding: '1rem' }}>
                                                    <button
                                                        onClick={() => {
                                                            setModalMode('order-item');
                                                            setPreSelectedItemId(item.InventoryID);
                                                            setIsModalOpen(true);
                                                        }}
                                                        style={{ padding: '0.25rem 0.75rem', backgroundColor: '#2563eb', color: 'white', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                                                    >
                                                        Order This
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* History Tab Content */}
                    {activeTab === 'history' && (
                        <div>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#374151', marginBottom: '1rem' }}>Order History</h2>
                            <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                        <tr>
                                            <th style={{ padding: '1rem', fontWeight: '600', color: '#374151' }}>Date</th>
                                            <th style={{ padding: '1rem', fontWeight: '600', color: '#374151' }}>Item</th>
                                            <th style={{ padding: '1rem', fontWeight: '600', color: '#374151' }}>Cost Breakdown</th>
                                            <th style={{ padding: '1rem', fontWeight: '600', color: '#374151' }}>Status</th>
                                            <th style={{ padding: '1rem', fontWeight: '600', color: '#374151' }}>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.length === 0 ? (
                                            <tr><td colSpan="5" style={{ padding: '1.5rem', textAlign: 'center', color: '#6b7280' }}>No orders found.</td></tr>
                                        ) : (
                                            transactions.map(tx => (
                                                <tr key={tx.TransactionID} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                                    <td style={{ padding: '1rem', color: '#6b7280' }}>{new Date(tx.TransactionDate).toLocaleDateString()}</td>
                                                    <td style={{ padding: '1rem', color: '#111827', fontWeight: '500' }}>{tx.ItemName}</td>
                                                    <td style={{ padding: '1rem', color: '#4b5563' }}>
                                                        {tx.Quantity} x ${tx.UnitPrice}
                                                        <div style={{ fontWeight: 'bold' }}>Total: ${(tx.Quantity * tx.UnitPrice).toFixed(2)}</div>
                                                    </td>
                                                    <td style={{ padding: '1rem' }}>
                                                        <span style={{
                                                            backgroundColor: tx.Status === 'Completed' ? '#d1fae5' : '#fef3c7',
                                                            color: tx.Status === 'Completed' ? '#065f46' : '#92400e',
                                                            padding: '0.25rem 0.5rem',
                                                            borderRadius: '9999px',
                                                            fontSize: '0.75rem',
                                                            fontWeight: 'bold'
                                                        }}>
                                                            {tx.Status}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '1rem' }}>
                                                        {tx.Status === 'Pending' && (
                                                            <button
                                                                onClick={() => handleReceiveOrder(tx.TransactionID)}
                                                                style={{
                                                                    padding: '0.25rem 0.75rem',
                                                                    backgroundColor: '#2563eb',
                                                                    color: 'white',
                                                                    border: 'none',
                                                                    borderRadius: '4px',
                                                                    cursor: 'pointer',
                                                                    fontSize: '0.875rem'
                                                                }}
                                                            >
                                                                Receive
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <InventoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
                mode={modalMode}
                inventoryItems={inventory}
                initialSelectedId={preSelectedItemId}
                title={modalMode === 'add-item' ? "Add New Inventory Item" : "Place Procurement Order"}
            />
        </div>
    );
};

export default Inventory;
