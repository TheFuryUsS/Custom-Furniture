import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function LandingPage() {
    const nav = useNavigate();
    const { token } = useContext(AuthContext);

    const handleLogin = () => {
        if (token) {
            nav('/designs');
        } else {
            nav('/login');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
            <div className="text-center p-6 sm:p-8 bg-white shadow-lg rounded-2xl w-full max-w-md">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
                    Custom Furniture
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mb-6">
                    Crea i personalitza els teus productes decoratius online.
                </p>
                <button
                    onClick={handleLogin}
                    className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition duration-300"
                >
                    Comença a editar!
                </button>
            </div>
        </div>
    );
}
