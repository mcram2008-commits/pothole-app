import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { ShieldCheck, Users, FileText, CheckCircle, Trash2, Plus, MapPin, Search, Menu } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AdminDashboard = () => {
    const { token, logout } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState('officers');
    const [officers, setOfficers] = useState([]);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newOfficer, setNewOfficer] = useState({ username: '', email: '', password: '', phone: '' });
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, [token, activeTab]);

    const fetchData = async () => {
        try {
            const [usersRes, reportsRes] = await Promise.all([
                axios.get(`${API_URL}/admin/users`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${API_URL}/reports`, { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setOfficers(usersRes.data.filter(u => u.role === 'officer'));
            setReports(reportsRes.data);
        } catch (err) {
            console.error("Error fetching admin data:", err);
        } finally {
            setLoading(false);
        }
    };

    const toggleApproval = async (id) => {
        try {
            await axios.put(`${API_URL}/admin/users/${id}/approve`, {}, { headers: { Authorization: `Bearer ${token}` } });
            fetchData();
        } catch (err) { alert("Failed to update status."); }
    };

    const deleteUser = async (id) => {
        if (!window.confirm("Delete this officer?")) return;
        try {
            await axios.delete(`${API_URL}/admin/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchData();
        } catch (err) { alert("Failed to delete user."); }
    };

    const handleAddOfficer = async (e) => {
        e.preventDefault();
        if (newOfficer.phone.length !== 10) {
            alert('Phone number must be exactly 10 digits.');
            return;
        }
        try {
            const submissionData = { ...newOfficer, phone: `+91${newOfficer.phone}`, role: 'officer', isAdminCreated: true };
            await axios.post(`${API_URL}/auth/register`, submissionData, { headers: { Authorization: `Bearer ${token}` } });
            setShowAddForm(false);
            setNewOfficer({ username: '', email: '', password: '', phone: '' });
            alert("Officer Created!");
            fetchData();
        } catch (err) { alert("Failed: " + (err.response?.data?.error || err.message)); }
    };

    return (
        <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
            {/* Sidebar */}
            <aside className={`bg-slate-900 border-r border-slate-800 flex flex-col shadow-2xl z-20 transition-all duration-300 ${isSidebarOpen ? 'w-72 translate-x-0' : 'w-0 -translate-x-full opacity-0 overflow-hidden'}`}>
                <div className="p-8 border-b border-slate-800 flex items-center gap-3">
                    <div className="relative">
                        <ShieldCheck className="w-10 h-10 text-blue-500" />
                        <div className="absolute top-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900 animate-pulse"></div>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white tracking-tight">Admin<span className="text-blue-500">Panel</span></h1>
                        <p className="text-xs text-slate-400 font-medium tracking-wide">SYSTEM CONTROL</p>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-8 space-y-2">
                    <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Modules</p>

                    <button
                        onClick={() => setActiveTab('officers')}
                        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 group ${activeTab === 'officers'
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50 scale-[1.02]'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <Users size={20} className={activeTab === 'officers' ? 'text-blue-100' : 'text-slate-500 group-hover:text-white'} />
                            <span className="font-semibold text-sm">Officers</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${activeTab === 'officers' ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                            {officers.length}
                        </span>
                    </button>

                    <button
                        onClick={() => setActiveTab('reports')}
                        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 group ${activeTab === 'reports'
                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50 scale-[1.02]'
                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <FileText size={20} className={activeTab === 'reports' ? 'text-purple-100' : 'text-slate-500 group-hover:text-white'} />
                            <span className="font-semibold text-sm">All Reports</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${activeTab === 'reports' ? 'bg-purple-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                            {reports.length}
                        </span>
                    </button>
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-700 text-slate-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50 transition-all font-semibold text-sm"
                    >
                        Log Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-slate-50 relative">
                {/* Header */}
                <header className="bg-white border-b border-slate-200 px-10 py-6 sticky top-0 z-10 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
                            <Menu size={24} />
                        </button>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{activeTab === 'officers' ? 'Team Management' : 'Global Incident Feed'}</h2>
                            <p className="text-sm text-slate-400 font-medium mt-1">{activeTab === 'officers' ? 'Oversee officer accounts & permissions.' : 'Monitor all citizen submissions.'}</p>
                        </div>
                    </div>

                    {activeTab === 'officers' && (
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-200 flex items-center gap-2 transition-transform active:scale-95 text-sm"
                        >
                            <Plus size={18} /> New Officer
                        </button>
                    )}
                </header>

                {/* Dynamic Content */}
                <div className="p-10 max-w-[1600px] mx-auto min-h-full">
                    {/* Modal */}
                    {showAddForm && (
                        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
                            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform scale-100 transition-all">
                                <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                                    <h3 className="font-bold text-slate-700">Add New Officer</h3>
                                    <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-red-500 transition-colors text-2xl font-light">&times;</button>
                                </div>
                                <form onSubmit={handleAddOfficer} className="p-6 space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Name</label>
                                        <input className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none font-medium" placeholder="Full Name" required value={newOfficer.username} onChange={e => setNewOfficer({ ...newOfficer, username: e.target.value })} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email</label>
                                        <input className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none font-medium" type="email" placeholder="Email Address" required value={newOfficer.email} onChange={e => setNewOfficer({ ...newOfficer, email: e.target.value })} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Phone</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <span className="text-slate-400 text-sm font-medium border-r border-slate-200 pr-2">+91</span>
                                            </div>
                                            <input
                                                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-14 pr-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none font-medium"
                                                placeholder="10-digit number"
                                                required
                                                value={newOfficer.phone}
                                                onChange={e => {
                                                    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                                                    setNewOfficer({ ...newOfficer, phone: value });
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Password</label>
                                        <input className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none font-medium" type="password" placeholder="••••••••" required value={newOfficer.password} onChange={e => setNewOfficer({ ...newOfficer, password: e.target.value })} />
                                    </div>
                                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-200 mt-4 transition-transform active:scale-95 uppercase tracking-wide text-sm">Create Account</button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Views */}
                    {activeTab === 'officers' ? (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-widest font-semibold">
                                        <th className="px-8 py-4">Officer</th>
                                        <th className="px-8 py-4">Contact Info</th>
                                        <th className="px-8 py-4">Status</th>
                                        <th className="px-8 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {officers.map(u => (
                                        <tr key={u._id} className="hover:bg-blue-50/50 transition-colors group">
                                            <td className="px-8 py-5 font-bold text-slate-700">{u.username}</td>
                                            <td className="px-8 py-5">
                                                <div className="font-medium text-slate-600">{u.email}</div>
                                                <div className="text-xs text-slate-400 mt-0.5">{u.phone}</div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border ${u.isApproved ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                                    {u.isApproved ? '● Active' : '● Pending'}
                                                </span>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => toggleApproval(u._id)} className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors ${u.isApproved ? 'border-slate-200 text-slate-500 hover:bg-slate-50' : 'bg-emerald-600 text-white border-transparent hover:bg-emerald-700 Shadow-sm'}`}>
                                                        {u.isApproved ? 'Revoke Access' : 'Approve Account'}
                                                    </button>
                                                    <button onClick={() => deleteUser(u._id)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors" title="Delete"><Trash2 size={16} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {officers.length === 0 && <tr><td colSpan="4" className="text-center py-20 text-slate-400 italic">No officers found. Add one to get started.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 pb-20">
                            {reports.map((report) => (
                                <div key={report._id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
                                    <div className="h-48 bg-slate-100 relative overflow-hidden group">
                                        {report.imageUrl ? (
                                            <img src={`${API_URL.replace('/api', '')}${report.imageUrl}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                                        ) : (<div className="w-full h-full flex items-center justify-center text-slate-300">No Image</div>)}

                                        <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide shadow-sm border ${report.status === 'Fixed' ? 'bg-emerald-500 text-white border-emerald-400' :
                                            report.status === 'In Progress' ? 'bg-blue-500 text-white border-blue-400' : 'bg-white text-slate-600 border-white'
                                            }`}>
                                            {report.status}
                                        </div>
                                    </div>
                                    <div className="p-5 flex-1 flex flex-col">
                                        <h4 className="font-bold text-slate-800 text-lg mb-1 truncate" title={report.description}>{report.description}</h4>
                                        <div className="flex items-center text-xs text-slate-400 mb-4 font-mono">
                                            <MapPin className="w-3 h-3 mr-1 text-slate-300" />
                                            {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
                                        </div>
                                        <div className="mt-auto border-t border-slate-100 pt-3 flex justify-between items-center">
                                            <div className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md ${report.severity === 'High' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                                                }`}>
                                                {report.severity} Priority
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-300">{new Date(report.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {reports.length === 0 && <div className="col-span-full py-20 text-center text-slate-400">No reports found in the system.</div>}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
