import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Camera, MapPin, Send, AlertOctagon, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

// IMPORTANT: use API_URL to match the proxy or absolute path
// In App.jsx we saw protected routes, meaning we MUST send the token
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ReportPage = () => {
    const { token } = useContext(AuthContext); // Get Token for Auth
    const [formData, setFormData] = useState({ description: '', severity: 'Medium' });
    const [location, setLocation] = useState(null);
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLocation = () => {
        if (navigator.geolocation) {
            setLoading(true);
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                    setLoading(false);
                    setError('');
                },
                (err) => {
                    setError('Unable to retrieve location. Please enable GPS.');
                    setLoading(false);
                }
            );
        } else {
            setError('Geolocation is not supported by your browser.');
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!location) {
            setError('Location is required. Click the "Pin My Location" button.');
            return;
        }
        if (!image) {
            setError('A photo of the pothole is mandatory.');
            return;
        }

        const data = new FormData();
        data.append('description', formData.description);
        data.append('severity', formData.severity);
        data.append('latitude', location.latitude);
        data.append('longitude', location.longitude);
        data.append('image', image);

        try {
            setLoading(true);
            // ADD AUTHORIZATION HEADER HERE
            await axios.post(`${API_URL}/reports`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            // Show success animation or redirect
            // Assuming we want to go to the dashboard or home
            setTimeout(() => navigate('/'), 1000);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Server Error: Failed to submit report. Ensure backend is running.');
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 mb-8">

                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 text-white text-center">
                    <AlertOctagon className="w-12 h-12 mx-auto mb-2 animate-pulse" />
                    <h2 className="text-2xl font-bold">New Pothole Report</h2>
                    <p className="text-blue-100 text-sm">Help us fix the roads faster!</p>
                </div>

                <div className="p-8">
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r text-red-700 flex items-center shadow-sm animate-shake">
                            <AlertOctagon className="w-5 h-5 mr-2" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">

                        {/* 1. Photo Upload (The most important part) */}
                        <div className="text-center">
                            <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">1. Snap Evidence</label>
                            <div className="relative group">
                                <input
                                    type="file"
                                    id="file-upload"
                                    className="hidden"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    capture="environment"
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="cursor-pointer block w-full h-64 border-2 border-dashed border-blue-300 rounded-xl flex flex-col items-center justify-center bg-blue-50 hover:bg-blue-100 transition-colors"
                                >
                                    {previewUrl ? (
                                        <div className="relative w-full h-full">
                                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Camera className="w-12 h-12 text-white" />
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <Camera className="w-16 h-16 text-blue-400 mb-2" />
                                            <span className="text-blue-600 font-semibold">Tap to Take Photo</span>
                                            <span className="text-xs text-gray-400">or upload from gallery</span>
                                        </>
                                    )}
                                </label>
                            </div>
                        </div>

                        {/* 2. Location (Auto-detect) */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">2. Pin Location</label>
                            <button
                                type="button"
                                onClick={handleLocation}
                                disabled={loading}
                                className={`w-full flex items-center justify-center py-4 rounded-xl font-bold shadow-md transition-all transform active:scale-95 ${location
                                    ? 'bg-green-500 text-white hover:bg-green-600'
                                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                    }`}
                            >
                                <MapPin className={`mr-2 ${location ? 'animate-bounce' : ''}`} />
                                {location
                                    ? `Pinned: ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
                                    : 'DETECT MY GPS LOCATION'
                                }
                            </button>
                            {location && <p className="text-center text-xs text-green-600 mt-2 font-semibold">✓ High Accuracy GPS Locked</p>}
                        </div>

                        {/* 3. Details (Grid Layout) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Details (Optional)</label>
                                <input
                                    type="text"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3 bg-gray-50"
                                    placeholder="e.g. Near main bus stand..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Severity Level</label>
                                <select
                                    value={formData.severity}
                                    onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-3 bg-gray-50"
                                >
                                    <option value="Low">Low - Minor Crack</option>
                                    <option value="Medium">Medium - Standard Pothole</option>
                                    <option value="High">High - Dangerous Crater</option>
                                </select>
                            </div>
                        </div>

                        {/* 4. Submit Action */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-5 rounded-full text-lg font-bold shadow-lg transform transition-all duration-300 ${loading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-xl hover:-translate-y-1'
                                    }`}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <RotateCcw className="animate-spin mr-2" /> Sending Report...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center">
                                        <Send className="mr-2" /> SUBMIT COMPLAINT
                                    </span>
                                )}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default ReportPage;
