import { useState, useEffect } from 'react';
import axios from 'axios';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import MaintenanceModal from '../../components/manager/MaintenanceModal';

const ManagerExpenses = () => {
    const [hotels, setHotels] = useState([]);
    const [selectedHotelId, setSelectedHotelId] = useState('');
    const [financials, setFinancials] = useState({ TotalSalary: 0, TotalEarnings: 0 });
    const [monthlyStats, setMonthlyStats] = useState([]);
    const [yearlyStats, setYearlyStats] = useState([]);
    const [maintenanceLedger, setMaintenanceLedger] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchHotels();
    }, []);

    useEffect(() => {
        if (selectedHotelId) {
            fetchAllData();
        }
    }, [selectedHotelId]);

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

    const fetchAllData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [expensesRes, monthlyRes, yearlyRes, ledgerRes] = await Promise.all([
                axios.post('/api/manager/expenses/hotel-expenses', { hotelID: selectedHotelId }),
                axios.post('/api/manager/expenses/monthly-transactions', { hotelID: selectedHotelId }),
                axios.post('/api/manager/expenses/transaction-earnings', { hotelID: selectedHotelId }),
                axios.get(`/api/manager/expenses/maintenance-ledger?hotelId=${selectedHotelId}`)
            ]);

            setFinancials(expensesRes.data);

            // Format Monthly Data
            const formattedMonthly = monthlyRes.data.map(item => ({
                name: new Date(0, item.Month - 1).toLocaleString('default', { month: 'short' }),
                earnings: parseFloat(item.TotalEarnings)
            }));
            setMonthlyStats(formattedMonthly);

            // Format Yearly Data
            const formattedYearly = yearlyRes.data.map(item => ({
                year: item.Year,
                earnings: parseFloat(item.TotalAmount)
            }));
            setYearlyStats(formattedYearly);

            setMaintenanceLedger(ledgerRes.data);

        } catch (err) {
            console.error("Error fetching expenses data:", err);
            setError("Failed to load financial data.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddMaintenance = async (formData) => {
        try {
            await axios.post('/api/manager/expenses/maintenance-ledger', {
                hotelId: selectedHotelId,
                ...formData
            });
            alert("Entry added successfully");
            setIsModalOpen(false);
            fetchAllData(); // Refresh data
        } catch (err) {
            console.error("Error adding maintenance entry:", err);
            alert("Failed to add entry.");
        }
    };

    const totalMaintenance = maintenanceLedger.reduce((sum, item) => sum + parseFloat(item.Amount), 0);
    const netProfit = (parseFloat(financials.TotalEarnings) - parseFloat(financials.TotalSalary) - totalMaintenance).toFixed(2);

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827' }}>Financial Expenses</h1>
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

            {loading ? (
                <div>Loading data...</div>
            ) : error ? (
                <div style={{ color: 'red' }}>{error}</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Summary Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                            <h3 style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 'bold', textTransform: 'uppercase' }}>Total Earnings (YTD)</h3>
                            <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#10b981', marginTop: '0.5rem' }}>
                                ${parseFloat(financials.TotalEarnings || 0).toLocaleString()}
                            </p>
                        </div>
                        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                            <h3 style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 'bold', textTransform: 'uppercase' }}>Total Salaries</h3>
                            <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#f59e0b', marginTop: '0.5rem' }}>
                                ${parseFloat(financials.TotalSalary || 0).toLocaleString()}
                            </p>
                        </div>
                        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                            <h3 style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 'bold', textTransform: 'uppercase' }}>Maintenance Costs</h3>
                            <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#ef4444', marginTop: '0.5rem' }}>
                                ${totalMaintenance.toLocaleString()}
                            </p>
                        </div>
                        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                            <h3 style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 'bold', textTransform: 'uppercase' }}>Net Profit (Est.)</h3>
                            <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: netProfit >= 0 ? '#10b981' : '#ef4444', marginTop: '0.5rem' }}>
                                ${parseFloat(netProfit).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {/* Charts */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                        {/* Monthly Earnings Chart */}
                        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#374151', marginBottom: '1.5rem' }}>Monthly Earnings</h3>
                            <div style={{ height: '300px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={monthlyStats} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={(val) => `$${val}`} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1f2937', color: '#fff', border: 'none', borderRadius: '8px' }}
                                            itemStyle={{ color: '#fff' }}
                                            formatter={(value) => [`$${value}`, 'Earnings']}
                                        />
                                        <Bar dataKey="earnings" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Yearly Trends Chart */}
                        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#374151', marginBottom: '1.5rem' }}>Revenue Trends (5 Years)</h3>
                            <div style={{ height: '300px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={yearlyStats} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                        <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={(val) => `$${val}`} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#1f2937', color: '#fff', border: 'none', borderRadius: '8px' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                        <Area type="monotone" dataKey="earnings" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Maintenance Ledger */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#374151' }}>Maintenance Ledger</h2>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                style={{ padding: '0.5rem 1rem', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '500', cursor: 'pointer' }}
                            >
                                + Add Entry
                            </button>
                        </div>
                        <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                    <tr>
                                        <th style={{ padding: '1rem', fontWeight: '600', color: '#374151' }}>Date</th>
                                        <th style={{ padding: '1rem', fontWeight: '600', color: '#374151' }}>Service Type</th>
                                        <th style={{ padding: '1rem', fontWeight: '600', color: '#374151' }}>Description</th>
                                        <th style={{ padding: '1rem', fontWeight: '600', color: '#374151' }}>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {maintenanceLedger.length === 0 ? (
                                        <tr><td colSpan="4" style={{ padding: '1.5rem', textAlign: 'center', color: '#6b7280' }}>No maintenance records found.</td></tr>
                                    ) : (
                                        maintenanceLedger.map((entry, index) => (
                                            <tr key={index} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                                <td style={{ padding: '1rem', color: '#6b7280' }}>{new Date(entry.LedgerDate).toLocaleDateString()}</td>
                                                <td style={{ padding: '1rem', color: '#111827', fontWeight: '500' }}>{entry.ServiceType}</td>
                                                <td style={{ padding: '1rem', color: '#4b5563' }}>{entry.Description}</td>
                                                <td style={{ padding: '1rem', color: '#ef4444', fontWeight: 'bold' }}>-${parseFloat(entry.Amount).toFixed(2)}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            <MaintenanceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddMaintenance}
            />
        </div>
    );
};

export default ManagerExpenses;
