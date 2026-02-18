import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Camera, MapPin, CheckCircle, Clock, LayoutDashboard, History, PlusCircle, LogOut, ChevronRight, Menu, Send, AlertOctagon, RotateCcw } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CitizenDashboard = () => {
    const { token, logout, user } = useContext(AuthContext);
    const [reports, setReports] = useState([]);
    const [activeTab, setActiveTab] = useState('active'); // 'active' | 'history' | 'new'
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();

    // -- REPORT FORM STATE --
    const [formData, setFormData] = useState({ description: '', severity: 'Medium' });
    const [location, setLocation] = useState(null);
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchMyReports();
        const interval = setInterval(fetchMyReports, 10000); // 10s auto-refresh
        return () => clearInterval(interval);
    }, [token]);

    const fetchMyReports = async () => {
        try {
            const res = await axios.get(`${API_URL}/my-reports`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReports(res.data);
        } catch (err) {
            console.error("Error fetching reports:", err);
        } finally {
            setLoading(false);
        }
    };

    // -- REPORT HANDLERS --
    const handleLocation = () => {
        if (navigator.geolocation) {
            setSubmitting(true); // Reuse submitting state for location loading
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude });
                    setSubmitting(false);
                    setError('');
                },
                (err) => { setError('GPS Error: ' + err.message); setSubmitting(false); }
            );
        } else setError('GPS not supported');
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) { setImage(file); setPreviewUrl(URL.createObjectURL(file)); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!location) { setError('Please pin your location first.'); return; }
        if (!image) { setError('Photo evidence is required.'); return; }

        const data = new FormData();
        data.append('description', formData.description);
        data.append('severity', formData.severity);
        data.append('latitude', location.latitude);
        data.append('longitude', location.longitude);
        data.append('image', image);

        try {
            setSubmitting(true);
            await axios.post(`${API_URL}/reports`, data, {
                headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` }
            });

            // Reset and switch tab
            setSubmitting(false);
            setFormData({ description: '', severity: 'Medium' });
            setLocation(null);
            setImage(null);
            setPreviewUrl(null);
            setActiveTab('active');
            fetchMyReports(); // Refresh list
            alert("Report Submitted Successfully!");
        } catch (err) {
            console.error(err);
            setError('Failed to submit report.');
            setSubmitting(false);
        }
    };

    // Derived state
    const activeReports = reports.filter(r => r.status !== 'Fixed');
    const historyReports = reports.filter(r => r.status === 'Fixed');
    const displayedReports = activeTab === 'active' ? activeReports : historyReports;

    const getStatusColor = (status) => {
        if (status === 'Fixed') return 'bg-emerald-100 text-emerald-800 border-emerald-200';
        if (status === 'In Progress') return 'bg-blue-100 text-blue-800 border-blue-200';
        return 'bg-amber-100 text-amber-800 border-amber-200';
    };

    return (
        <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
            {/* Sidebar Navigation */}
            <div className={`bg-white border-r border-slate-200 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10 transition-all duration-300 ${isSidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full opacity-0 overflow-hidden'}`}>
                <div className="p-8">
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                        <span className="text-blue-600 text-3xl">●</span> MyRoad
                    </h1>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-4 mb-2">Menu</div>
                    <button
                        onClick={() => setActiveTab('active')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${activeTab === 'active' ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                    >
                        <LayoutDashboard size={20} className={activeTab === 'active' ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'} />
                        <span className="font-semibold">Active Reports</span>
                        {activeReports.length > 0 && <span className="ml-auto bg-blue-100 text-blue-700 py-0.5 px-2 rounded-full text-xs font-bold">{activeReports.length}</span>}
                    </button>

                    <button
                        onClick={() => setActiveTab('history')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${activeTab === 'history' ? 'bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                    >
                        <History size={20} className={activeTab === 'history' ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600'} />
                        <span className="font-semibold">Resolved History</span>
                        {historyReports.length > 0 && <span className="ml-auto bg-emerald-100 text-emerald-700 py-0.5 px-2 rounded-full text-xs font-bold">{historyReports.length}</span>}
                    </button>

                    <div className="my-6 border-t border-slate-100"></div>

                    <button
                        onClick={() => setActiveTab('new')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg transition-all transform active:scale-95 ${activeTab === 'new'
                                ? 'bg-slate-800 text-white shadow-xl scale-[1.02]'
                                : 'bg-slate-900 text-white hover:bg-slate-800'
                            }`}
                    >
                        <PlusCircle size={20} />
                        <span className="font-bold">New Complaint</span>
                    </button>
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-sm">
                            {user?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-800 truncate">{user?.username}</p>
                            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                        </div>
                        <button onClick={logout} className="text-slate-400 hover:text-red-500 transition-colors" title="Logout">
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Header (Visible only on small screens) */}
            <div className="md:hidden fixed top-0 w-full bg-white border-b z-20 px-4 py-3 flex justify-between items-center shadow-sm">
                <h1 className="font-bold text-lg">MyRoad</h1>
                <button onClick={() => setActiveTab('new')} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm">+ New</button>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
                <header className="px-8 py-6 bg-white border-b border-slate-100 flex justify-between items-center sticky top-0 z-10 shadow-[0_4px_20px_-12px_rgba(0,0,0,0.05)]">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors">
                            <Menu size={24} />
                        </button>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800">
                                {activeTab === 'new' ? 'Submit New Report' : activeTab === 'active' ? 'Current Issues' : 'Resolution Archive'}
                            </h2>
                            <p className="text-slate-500 text-sm mt-1">
                                {activeTab === 'new' ? 'Help us fix the roads by providing details below.' : activeTab === 'active' ? 'Track the status of your reported problems.' : 'View your successfully fixed potholes.'}
                            </p>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8 scroll-smooth">
                    {activeTab === 'new' ? (
                        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                            <div className="bg-slate-900 p-6 text-white text-center">
                                <AlertOctagon className="w-10 h-10 mx-auto mb-2 text-blue-400" />
                                <h3 className="text-xl font-bold">New Pothole Report</h3>
                            </div>
                            <div className="p-8">
                                {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm font-bold flex items-center gap-2"><AlertOctagon size={16} /> {error}</div>}
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* 1. Photo */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">1. Snap Evidence</label>
                                        <div className="relative group">
                                            <input type="file" id="file-upload" className="hidden" onChange={handleImageChange} accept="image/*" />
                                            <label htmlFor="file-upload" className="cursor-pointer block w-full h-48 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center bg-slate-50 hover:bg-white transition-all hover:border-blue-400">
                                                {previewUrl ? (
                                                    <img src={previewUrl} className="w-full h-full object-cover rounded-xl" />
                                                ) : (
                                                    <div className="text-center">
                                                        <Camera className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                                                        <span className="text-blue-600 font-bold text-sm">Upload Photo</span>
                                                    </div>
                                                )}
                                            </label>
                                        </div>
                                    </div>
                                    {/* 2. Location */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">2. Location</label>
                                        <button type="button" onClick={handleLocation} disabled={submitting} className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors ${location ? 'bg-emerald-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                                            <MapPin size={18} /> {location ? 'GPS Locked ✓' : 'Detect GPS Location'}
                                        </button>
                                    </div>
                                    {/* 3. Details */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Description</label>
                                            <input type="text" className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Main road..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Severity</label>
                                            <select className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500" value={formData.severity} onChange={e => setFormData({ ...formData, severity: e.target.value })}>
                                                <option>Low</option><option>Medium</option><option>High</option>
                                            </select>
                                        </div>
                                    </div>
                                    {/* 4. Submit */}
                                    <button type="submit" disabled={submitting} className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                                        {submitting ? <RotateCcw className="animate-spin" /> : <Send />} Submit Report
                                    </button>
                                </form>
                            </div>
                        </div>
                    ) : loading ? (
                        <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                            <p className="animate-pulse font-medium">Syncing data...</p>
                        </div>
                    ) : (
                        <>
                            {displayedReports.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${activeTab === 'active' ? 'bg-blue-50 text-blue-300' : 'bg-green-50 text-green-300'}`}>
                                        {activeTab === 'active' ? <LayoutDashboard size={32} /> : <History size={32} />}
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-700">No {activeTab} reports found</h3>
                                    <p className="text-slate-500 text-sm max-w-xs text-center mt-1">
                                        {activeTab === 'active'
                                            ? "You don't have any pending reports. Great news!"
                                            : "You haven't had any reports fixed yet."}
                                    </p>
                                    {activeTab === 'active' && (
                                        <button onClick={() => setActiveTab('new')} className="mt-6 text-blue-600 font-bold text-sm hover:text-blue-700 flex items-center gap-1 group">
                                            Report an issue <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 pb-20">
                                    {displayedReports.map((report) => (
                                        <div key={report._id} className="group bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 transition-all duration-300">
                                            <div className="h-48 relative overflow-hidden bg-slate-100">
                                                {report.imageUrl ? (
                                                    <img src={`${API_URL.replace('/api', '')}${report.imageUrl}`} alt="Evidence" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                                                        <Camera size={32} className="opacity-50 mb-2" />
                                                        <span className="text-xs font-medium uppercase tracking-wider">No Photo</span>
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold border shadow-sm backdrop-blur-sm ${getStatusColor(report.status)}`}>
                                                    {report.status}
                                                </div>
                                            </div>

                                            <div className="p-5">
                                                <h4 className="font-bold text-slate-800 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors" title={report.description}>
                                                    {report.description || "Unspecified Issue"}
                                                </h4>

                                                <div className="flex items-center text-xs text-slate-500 mb-4 bg-slate-50 py-2 px-3 rounded-lg border border-slate-100">
                                                    <Clock size={14} className="mr-1.5 text-slate-400" />
                                                    {new Date(report.createdAt).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                                                </div>

                                                <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Severity</span>
                                                        <span className={`text-xs font-bold ${report.severity === 'High' ? 'text-rose-500' : report.severity === 'Medium' ? 'text-orange-500' : 'text-slate-600'}`}>
                                                            {report.severity} Priority
                                                        </span>
                                                    </div>

                                                    {report.status === 'Fixed' && (
                                                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                                            <CheckCircle size={16} />
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

export default CitizenDashboard;
