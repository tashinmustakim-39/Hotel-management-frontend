import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

const Expenses = () => {
    const [hotels, setHotels] = useState([]);
    const [selectedHotelId, setSelectedHotelId] = useState('');
    const [dateRange, setDateRange] = useState({
        start: new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString().split('T')[0], // Last 6 months
        end: new Date().toISOString().split('T')[0]
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Data States
    const [inventoryData, setInventoryData] = useState([]);
    const [maintenanceData, setMaintenanceData] = useState([]);
    const [salaryData, setSalaryData] = useState([]);
    const [revenueData, setRevenueData] = useState([]);
    const [summary, setSummary] = useState({ inventory: 0, maintenance: 0, salaries: 0, revenue: 0 });

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    useEffect(() => {
        fetchHotels();
    }, []);

    useEffect(() => {
        if (selectedHotelId) {
            fetchFinancialData();
        }
    }, [selectedHotelId, dateRange]);

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

    const fetchFinancialData = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = { start: dateRange.start, end: dateRange.end };

            const [inventoryRes, maintenanceRes, salaryRes, revenueRes, summaryRes] = await Promise.all([
                axios.get(`/api/expenses/inventory-summary/${selectedHotelId}`, { params }),
                axios.get(`/api/expenses/maintenance-summary/${selectedHotelId}`, { params }),
                axios.get(`/api/expenses/salary-summary/${selectedHotelId}`), // Salary is usually static/current, but could be historical
                axios.get(`/api/expenses/transaction-summary-admin/${selectedHotelId}`, { params }),
                axios.get(`/api/expenses/financial-summary/${selectedHotelId}`, { params })
            ]);

            setInventoryData(inventoryRes.data);
            setMaintenanceData(maintenanceRes.data);
            setSalaryData(salaryRes.data);
            setRevenueData(revenueRes.data);
            setSummary(summaryRes.data);

        } catch (err) {
            console.error("Error fetching financial data:", err);
            setError("Failed to load financial data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setDateRange(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827' }}>Financial Analytics</h1>

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

                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', backgroundColor: 'white', padding: '0.5rem', borderRadius: '8px', border: '1px solid #d1d5db' }}>
                        <input
                            type="date"
                            name="start"
                            value={dateRange.start}
                            onChange={handleDateChange}
                            style={{ border: 'none', outline: 'none', color: '#374151' }}
                        />
                        <span style={{ color: '#9ca3af' }}>to</span>
                        <input
                            type="date"
                            name="end"
                            value={dateRange.end}
                            onChange={handleDateChange}
                            style={{ border: 'none', outline: 'none', color: '#374151' }}
                        />
                    </div>
                </div>
            </div>

            {error && <div style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</div>}

            {loading ? (
                <div>Loading analytics...</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Summary Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                            <h3 style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Total Revenue</h3>
                            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>${summary.revenue ? summary.revenue.toLocaleString() : 0}</p>
                        </div>
                        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                            <h3 style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Total Salaries (Est.)</h3>
                            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ef4444' }}>${summary.salaries ? summary.salaries.toLocaleString() : 0}</p>
                        </div>
                        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                            <h3 style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Inventory Costs</h3>
                            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>${summary.inventory ? summary.inventory.toLocaleString() : 0}</p>
                        </div>
                        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                            <h3 style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Maintenance</h3>
                            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#6366f1' }}>${summary.maintenance ? summary.maintenance.toLocaleString() : 0}</p>
                        </div>
                    </div>

                    {/* Charts Row 1 */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                        {/* Revenue Chart */}
                        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', marginBottom: '1.5rem' }}>Monthly Revenue</h3>
                            <div style={{ height: '300px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={revenueData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="RevenueMonth" />
                                        <YAxis />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="TotalRevenue" stroke="#10b981" fill="#d1fae5" name="Revenue ($)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Salary Distribution */}
                        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', marginBottom: '1.5rem' }}>Salary Distribution</h3>
                            <div style={{ height: '300px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={salaryData}
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={100}
                                            fill="#8884d8"
                                            dataKey="TotalDeptSalary"
                                            nameKey="DeptName"
                                            label
                                        >
                                            {salaryData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Charts Row 2 */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                        {/* Inventory Costs */}
                        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', marginBottom: '1.5rem' }}>Inventory Costs</h3>
                            <div style={{ height: '300px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={inventoryData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="InventoryMonth" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="TotalInventoryCost" fill="#f59e0b" name="Cost ($)" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Maintenance Costs */}
                        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', marginBottom: '1.5rem' }}>Maintenance Costs</h3>
                            <div style={{ height: '300px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={maintenanceData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="MaintenanceMonth" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="TotalMaintenanceCost" fill="#6366f1" name="Cost ($)" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Expenses;
