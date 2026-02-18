import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Camera, MapPin, Clock, AlertTriangle, ShieldCheck, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet marker icons
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const HomePage = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, fixed: 0, pending: 0 });

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const res = await axios.get(`${API_URL}/reports`);
                setReports(res.data);

                // Calculate Stats
                const total = res.data.length;
                const fixed = res.data.filter(r => r.status === 'Fixed').length;
                const pending = total - fixed;
                setStats({ total, fixed, pending });
            } catch (err) {
                console.error("Error fetching reports:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchReports();
    }, []);

    return (
        <div className="container mx-auto p-4 max-w-6xl">
            {/* Hero Section with Live Stats */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl shadow-2xl overflow-hidden mb-12 text-white relative">
                <div className="absolute top-0 right-0 p-12 opacity-10">
                    <ShieldCheck size={200} />
                </div>

                <div className="p-10 md:p-16 relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className=" text-center md:text-left">
                        <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-1.5 rounded-full text-sm font-bold mb-6 border border-blue-500/30">
                            <Activity size={16} className="animate-pulse" /> Live Community Data
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
                            Fixing Roads, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">Together.</span>
                        </h1>
                        <p className="text-slate-300 text-lg md:text-xl mb-8 max-w-xl leading-relaxed">
                            Join thousands of citizens reporting infrastructure issues in real-time.
                            Our AI-driven platform connects you directly to city officials.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                            <Link to="/report" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-900/50 transition-all hover:-translate-y-1 flex items-center justify-center gap-3">
                                <Camera size={24} /> Report Issue
                            </Link>
                            <a href="#live-map" className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg backdrop-blur-sm transition-all flex items-center justify-center gap-2">
                                <MapPin size={24} /> View Map
                            </a>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full md:w-auto">
                        <StatCard label="Total Reports" value={stats.total} icon={<Activity />} color="text-blue-400" />
                        <StatCard label="Fixed" value={stats.fixed} icon={<ShieldCheck />} color="text-green-400" />
                        <StatCard label="Pending" value={stats.pending} icon={<AlertTriangle />} color="text-yellow-400" />
                    </div>
                </div>
            </div>

            {/* LIVE MAP SECTION */}
            <div id="live-map" className="mb-16 scroll-mt-24">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                        <MapPin className="text-red-500" size={32} /> Live Pothole Map
                    </h2>
                    <div className="text-sm text-gray-500 font-medium">Auto-updated from user reports</div>
                </div>

                <div className="h-[500px] w-full rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                    {typeof window !== 'undefined' && (
                        <MapContainer
                            center={[11.4769, 77.9997]} // Default location (change as needed)
                            zoom={13}
                            style={{ height: '100%', width: '100%' }}
                            scrollWheelZoom={false}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            />
                            {reports.map((report) => (
                                report.latitude && report.longitude && (
                                    <Marker
                                        key={report._id}
                                        position={[report.latitude, report.longitude]}
                                    >
                                        <Popup>
                                            <div className="min-w-[200px]">
                                                <h3 className="font-bold text-lg mb-1">{report.description || "Reported Issue"}</h3>
                                                <div className={`text-xs font-bold px-2 py-1 rounded inline-block mb-2 ${report.status === 'Fixed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {report.status}
                                                </div>
                                                {report.imageUrl && (
                                                    <img src={`${API_URL.replace('/api', '')}${report.imageUrl}`} className="w-full h-32 object-cover rounded-lg mb-2" />
                                                )}
                                                <div className="text-xs text-gray-500">
                                                    Severity: <span className="font-bold">{report.severity}</span>
                                                </div>
                                            </div>
                                        </Popup>
                                    </Marker>
                                )
                            ))}
                        </MapContainer>
                    )}
                </div>
            </div>

            {/* Recent Reports Grid */}
            <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <Clock className="text-gray-400" /> Recent Activity
                </h3>

                {loading ? (
                    <div className="text-center py-20 text-gray-400">Loading data...</div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {reports.slice(0, 6).map((report) => (
                            <div key={report._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 overflow-hidden group">
                                <div className="h-48 relative overflow-hidden">
                                    {report.imageUrl ? (
                                        <img
                                            src={`${API_URL.replace('/api', '')}${report.imageUrl}`}
                                            alt="Pothole"
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">No Image</div>
                                    )}
                                    <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-md bg-white/90 ${report.status === 'Fixed' ? 'text-green-600' : 'text-yellow-600'
                                        }`}>
                                        {report.status}
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h4 className="font-bold text-gray-800 mb-2 line-clamp-1">{report.description || "Road Issue"}</h4>
                                    <div className="flex justify-between items-center text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <MapPin size={14} /> {report.latitude.toFixed(4).substr(0, 6)}...
                                        </span>
                                        <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">
                                            {new Date(report.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const StatCard = ({ label, value, icon, color }) => (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/15 transition-colors">
        <div className={`mb-2 ${color}`}>{icon}</div>
        <div className="text-3xl font-bold mb-1">{value}</div>
        <div className="text-sm text-slate-300 font-medium">{label}</div>
    </div>
);

export default HomePage;
