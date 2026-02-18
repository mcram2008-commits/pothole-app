import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Camera, MapPin, CheckCircle, Clock, AlertTriangle, User, History, Inbox, Layout, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const OfficerDashboard = () => {
    const { token, logout, user } = useContext(AuthContext);
    const [reports, setReports] = useState([]);
    const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'resolved'
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const res = await axios.get(`${API_URL}/reports`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setReports(res.data);
            } catch (err) {
                console.error("Error fetching reports:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, [token]);

    const updateStatus = async (id, newStatus) => {
        try {
            await axios.put(`${API_URL}/reports/${id}/status`, { status: newStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReports(prev => prev.map(r => r._id === id ? { ...r, status: newStatus } : r));
        } catch (err) {
            console.error("Failed to update status", err);
            alert("Status update failed.");
        }
    };

    // Derived Lists
    const pendingReports = reports.filter(r => r.status !== 'Fixed');
    const resolvedReports = reports.filter(r => r.status === 'Fixed');
    const currentList = activeTab === 'pending' ? pendingReports : resolvedReports;

    return (
        <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
            {/* --- SIDEBAR --- */}
            <div className={`bg-white border-r border-slate-200 flex-col md:flex shadow-sm z-20 transition-all duration-75 ${isSidebarOpen ? 'w-72 translate-x-0' : 'w-0 -translate-x-full opacity-0 overflow-hidden'}`}>
                <div className="p-8 border-b border-slate-50">
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                        <span className="text-blue-600 text-3xl">🛡️</span> Officer
                    </h1>
                    <p className="text-xs font-semibold text-slate-400 mt-1 pl-1 uppercase tracking-widest">Portal</p>
                </div>

                <div className="flex-1 p-6 space-y-2">
                    <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Assignments</p>

                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group relative overflow-hidden ${activeTab === 'pending'
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 font-bold'
                            : 'text-slate-500 hover:bg-slate-50 font-medium'
                            }`}
                    >
                        <Inbox size={18} className={activeTab === 'pending' ? 'text-white' : 'text-slate-400'} />
                        <span className="z-10">Active Tasks</span>
                        {pendingReports.length > 0 && (
                            <span className={`ml-auto text-xs py-0.5 px-2 rounded-full font-bold ${activeTab === 'pending' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600'
                                }`}>
                                {pendingReports.length}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={() => setActiveTab('resolved')}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${activeTab === 'resolved'
                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 font-bold'
                            : 'text-slate-500 hover:bg-slate-50 font-medium'
                            }`}
                    >
                        <History size={18} className={activeTab === 'resolved' ? 'text-white' : 'text-slate-400'} />
                        <span>Fixed History</span>
                        {resolvedReports.length > 0 && (
                            <span className={`ml-auto text-xs py-0.5 px-2 rounded-full font-bold ${activeTab === 'resolved' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-600'
                                }`}>
                                {resolvedReports.length}
                            </span>
                        )}
                    </button>

                    <div className="my-8 border-t border-slate-100 pt-8">
                        <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Account</p>
                        <div className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group" onClick={logout}>
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold group-hover:bg-red-100 group-hover:text-red-500 transition-colors">
                                <User size={14} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-700">{user?.username || 'Officer'}</p>
                                <p className="text-[10px] text-slate-400 font-mono">ID: {user?._id?.slice(-4)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MAIN CONTENT --- */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50/50">
                <header className="bg-white border-b border-slate-200 px-8 py-5 flex justify-between items-center sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
                            <Menu size={24} />
                        </button>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                                {activeTab === 'pending' ? 'Work Orders' : 'Completed Jobs'}
                            </h2>
                            <p className="text-slate-500 text-sm mt-0.5 font-medium">
                                {activeTab === 'pending' ? 'Prioritize high severity issues.' : 'You have resolved these issues.'}
                            </p>
                        </div>
                    </div>
                    <button onClick={logout} className="text-slate-400 hover:text-red-600 font-medium text-sm flex items-center gap-2 transition-colors">
                        Log Out <span className="bg-slate-100 p-1 rounded-md"><User size={14} /></span>
                    </button>
                </header>

                <main className="flex-1 overflow-y-auto p-8 scroll-smooth">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400 animate-pulse">
                            <Layout size={48} className="opacity-20 mb-4" />
                            <p className="font-semibold">Loading data...</p>
                        </div>
                    ) : (
                        <>
                            {currentList.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-96 text-slate-400">
                                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
                                        <CheckCircle size={32} className="text-slate-300" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-600">No {activeTab} items</h3>
                                    <p className="text-sm">Your queue is empty.</p>
                                </div>
                            ) : (
                                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 pb-20">
                                    {currentList.map((report) => (
                                        <div key={report._id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full">
                                            {/* Card Image */}
                                            <div className="h-48 relative bg-slate-100 overflow-hidden">
                                                {report.imageUrl ? (
                                                    <img src={`${API_URL.replace('/api', '')}${report.imageUrl}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-300">No Image</div>
                                                )}

                                                {/* Severity Badge */}
                                                <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold text-white shadow-sm uppercase tracking-wider backdrop-blur-md ${report.severity === 'High' ? 'bg-rose-500/90' : 'bg-amber-500/90'
                                                    }`}>
                                                    {report.severity} Priority
                                                </div>

                                                {/* Status Badge */}
                                                <div className={`absolute bottom-3 right-3 px-3 py-1 rounded-full text-xs font-bold border shadow-md backdrop-blur-md ${report.status === 'Fixed' ? 'bg-emerald-500 text-white border-transparent' :
                                                    report.status === 'In Progress' ? 'bg-blue-500 text-white border-transparent' : 'bg-white/90 text-slate-600 border-white'
                                                    }`}>
                                                    {report.status}
                                                </div>
                                            </div>

                                            {/* Card Body */}
                                            <div className="p-5 flex-1 flex flex-col">
                                                <div className="mb-4">
                                                    <h3 className="font-bold text-slate-800 text-lg leading-tight mb-2 truncate" title={report.description}>
                                                        {report.description || "Unspecified Location"}
                                                    </h3>
                                                    <div className="flex items-center text-xs font-mono text-slate-500 bg-slate-50 rounded-md px-2 py-1 w-fit border border-slate-100">
                                                        <MapPin size={12} className="mr-1.5 text-blue-400" />
                                                        {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
                                                    </div>
                                                </div>

                                                <div className="mt-auto pt-4 border-t border-slate-100 grid items-center gap-3">
                                                    {report.status !== 'Fixed' ? (
                                                        <div className="grid grid-cols-2 gap-3">
                                                            {report.status !== 'In Progress' && (
                                                                <button
                                                                    onClick={() => updateStatus(report._id, 'In Progress')}
                                                                    className="px-4 py-2.5 bg-blue-50 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors uppercase tracking-wide"
                                                                >
                                                                    Start
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => updateStatus(report._id, 'Fixed')}
                                                                className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-sm hover:shadow-md ${report.status === 'In Progress'
                                                                    ? 'col-span-2 bg-emerald-500 text-white hover:bg-emerald-600'
                                                                    : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                                                    }`}
                                                            >
                                                                <CheckCircle size={14} /> Mark Done
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="bg-emerald-50 text-emerald-700 text-xs font-bold py-3 rounded-xl text-center border border-emerald-100 flex items-center justify-center gap-2">
                                                            <CheckCircle size={14} /> Completed
                                                            <span className="text-emerald-400 font-normal ml-1">
                                                                on {new Date().toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default OfficerDashboard;
