import { useState, useEffect } from 'react';
import axios from 'axios';

const EmployeeModal = ({ isOpen, onClose, onSubmit, initialData, hotelId, title }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        role: 'Receptionist',
        deptID: '',
        hourlyPay: '',
        salary: '',
        workingStatus: 'Working',
        hiredDate: new Date().toISOString().split('T')[0],
        address: ''
    });
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        if (isOpen && hotelId) {
            fetchDepartments();
        }
    }, [isOpen, hotelId]);

    useEffect(() => {
        if (initialData) {
            setFormData({
                firstName: initialData.FirstName || '',
                lastName: initialData.LastName || '',
                email: initialData.Email || '',
                phone: initialData.Phone || '',
                role: initialData.Role || 'Receptionist',
                deptID: initialData.DeptID || '',
                hourlyPay: initialData.hourly_pay || '',
                salary: initialData.Salary || '',
                workingStatus: initialData.working_status || 'Working',
                hiredDate: initialData.HiredDate ? new Date(initialData.HiredDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                address: initialData.Address || ''
            });
        } else {
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                role: 'Receptionist',
                deptID: '',
                hourlyPay: '',
                salary: '',
                workingStatus: 'Working',
                hiredDate: new Date().toISOString().split('T')[0],
                address: ''
            });
        }
    }, [initialData, isOpen]);

    const fetchDepartments = async () => {
        try {
            const response = await axios.post('/api/employees/departments', { hotelID: hotelId });
            setDepartments(response.data);
            if (!formData.deptID && response.data.length > 0) {
                setFormData(prev => ({ ...prev, deptID: response.data[0].DeptID }));
            }
        } catch (err) {
            console.error("Error fetching departments:", err);
        }
    };

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
                borderRadius: '12px',
                width: '100%',
                maxWidth: '600px',
                maxHeight: '90vh',
                overflowY: 'auto',
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

                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>

                    {/* First Name */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '500' }}>First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
                        />
                    </div>

                    {/* Last Name */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '500' }}>Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
                        />
                    </div>

                    {/* Email */}
                    <div style={{ gridColumn: 'span 2' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '500' }}>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '500' }}>Phone</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
                        />
                    </div>

                    {/* Role */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '500' }}>Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
                        >
                            <option value="Receptionist">Receptionist</option>
                            <option value="Housekeeping">Housekeeping</option>
                            <option value="Kitchen">Kitchen</option>
                            <option value="Maintenance">Maintenance</option>
                            <option value="Security">Security</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {/* Department */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '500' }}>Department</label>
                        <select
                            name="deptID"
                            value={formData.deptID}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
                        >
                            <option value="" disabled>Select Department</option>
                            {departments.map(dept => (
                                <option key={dept.DeptID} value={dept.DeptID}>{dept.DeptName}</option>
                            ))}
                        </select>
                    </div>

                    {/* Hourly Pay */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '500' }}>Hourly Pay ($)</label>
                        <input
                            type="number"
                            name="hourlyPay"
                            value={formData.hourlyPay}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
                        />
                    </div>

                    {/* Hired Date */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '500' }}>Hired Date</label>
                        <input
                            type="date"
                            name="hiredDate"
                            value={formData.hiredDate}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
                        />
                    </div>

                    {/* Working Status */}
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '500' }}>Status</label>
                        <select
                            name="workingStatus"
                            value={formData.workingStatus}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
                        >
                            <option value="Working">Working</option>
                            <option value="Terminated">Terminated</option>
                            <option value="On Leave">On Leave</option>
                        </select>
                    </div>

                    {/* Address */}
                    <div style={{ gridColumn: 'span 2' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '500' }}>Address</label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            rows="2"
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db' }}
                        />
                    </div>

                    <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
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
                            {initialData ? 'Update Employee' : 'Add Employee'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EmployeeModal;
