import { React, useContext } from 'react';
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
        <div className="flex items-center justify-center h-screen bg-gray-50">
            <div className="text-center p-8 bg-white shadow-lg rounded-2xl max-w-md">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">Custom Furniture</h1>
                <p className="text-gray-600 mb-6">Crea i personalitza els teus productes decoratius online.</p>
                <button onClick={handleLogin} 
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition duration-300">
                    Inicia sessió o Registra’t
                </button>
            </div>
        </div>
    );
}