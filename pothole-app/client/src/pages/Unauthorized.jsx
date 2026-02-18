import React from 'react';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
    return (
        <div className="flex h-screen bg-gray-50 items-center justify-center">
            <div className="text-center p-8 bg-white rounded-xl shadow-lg border border-red-100 max-w-md">
                <ShieldCheck className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Access Denied</h1>
                <p className="text-gray-600 mb-6">You do not have permission to view this page. Please log in with the correct role.</p>
                <div className="flex justify-center gap-4">
                    <Link to="/" className="flex items-center text-blue-600 hover:text-blue-800 font-medium">
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Go Home
                    </Link>
                    <Link to="/login" className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700">
                        Switch Account
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;
