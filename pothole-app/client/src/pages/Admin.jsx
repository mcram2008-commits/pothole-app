import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { CheckCircle, AlertOctagon, X, RefreshCw } from 'lucide-react';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AdminPage = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReport, setSelectedReport] = useState(null);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/reports`);
            setReports(res.data);
        } catch (err) {
            console.error("Error fetching reports:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await axios.put(`${API_URL}/reports/${id}/status`, { status: newStatus });
            setReports(reports.map(r => r._id === id ? { ...r, status: newStatus } : r));
            setSelectedReport(null);
        } catch (err) {
            console.error("Error updating status:", err);
        }
    };

    return (
        <div className="flex flex-col h-full relative">
            {loading && (
                <div className="absolute inset-0 bg-white bg-opacity-75 z-[1000] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            )}

            <div className="bg-white p-4 shadow-md z-[500] flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <AlertOctagon className="text-red-500" /> Pothole Map
                </h2>
                <button onClick={fetchReports} className="p-2 rounded-full hover:bg-gray-100 transition-colors" title="Refresh Map">
                    <RefreshCw className="w-5 h-5 text-gray-600" />
                </button>
            </div>

            <div className="flex-1 w-full relative z-0">
                <MapContainer center={[20.5937, 78.9629]} zoom={5} scrollWheelZoom={true} className="h-full w-full">
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {reports.map((report) => (
                        <Marker
                            key={report._id}
                            position={[report.latitude, report.longitude]}
                            eventHandlers={{
                                click: () => {
                                    setSelectedReport(report);
                                },
                            }}
                        >
                        </Marker>
                    ))}
                </MapContainer>
            </div>

            {selectedReport && (
                <div className="absolute bottom-0 left-0 right-0 bg-white p-6 rounded-t-xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-[1001] transition-transform duration-300 transform translate-y-0">
                    <button onClick={() => setSelectedReport(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                        <X className="w-6 h-6" />
                    </button>
                    <div className="flex gap-4">
                        <div className="w-1/3">
                            <img src={`${API_URL.replace('/api', '')}${selectedReport.imageUrl}`} alt="Report" className="w-full h-32 object-cover rounded-md" />
                        </div>
                        <div className="w-2/3 pr-8">
                            <h3 className="text-lg font-bold mb-1">{selectedReport.description}</h3>
                            <p className="text-sm text-gray-500 mb-2">Severity: <span className="font-semibold">{selectedReport.severity}</span></p>
                            <p className="text-xs text-gray-400 mb-4">{new Date(selectedReport.createdAt).toLocaleString()}</p>

                            <div className="flex gap-2">
                                <button onClick={() => handleStatusUpdate(selectedReport._id, 'Pending')} className={`px-3 py-1 text-sm rounded-full ${selectedReport.status === 'Pending' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600'}`}>Pending</button>
                                <button onClick={() => handleStatusUpdate(selectedReport._id, 'In Progress')} className={`px-3 py-1 text-sm rounded-full ${selectedReport.status === 'In Progress' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-600'}`}>In Progress</button>
                                <button onClick={() => handleStatusUpdate(selectedReport._id, 'Fixed')} className={`px-3 py-1 text-sm rounded-full ${selectedReport.status === 'Fixed' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'}`}>Fixed</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPage;
