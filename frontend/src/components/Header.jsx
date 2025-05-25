import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function Header() {
    const { token, setToken, user } = useContext(AuthContext);
    const nav = useNavigate();

    const handleLogout = () => {
        setToken(null);
        nav('/');
    };


    return (
        <header className="bg-slate-100 shadow-md p-4 flex items-center justify-between font-sans">
            <Link to="/" className="flex items-center">
                <img src="/logo.png" alt="img logo" className="h-10 w-auto transition-transform duration-300 hover:scale-105" />
            </Link>

            {/* Mostra només si hi ha usuari loguejat (per si més tard incloc el header a la landing o altres pags) */}
            {token && (
                <nav className="flex items-center space-x-6 text-sm">
                    <Link to="/designs" className="relative text-gray-700 hover:text-blue-600 transition duration-200 group">
                        <span className="group-hover:border-blue-600 pb-1 border-b-2 border-transparent transition-all duration-200">Dissenys</span>
                    </Link>
                    <Link to="/profile" className="relative text-gray-700 hover:text-blue-600 transition duration-200 group">
                        <span className="group-hover:border-blue-600 pb-1 border-b-2 border-transparent transition-all duration-200">Perfil</span>
                    </Link>

                    {/* Lletra usuari */}
                    {user && (
                        <div title={user.username} className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-full uppercase font-semibold">
                            {user.username?.charAt(0)}
                        </div>
                    )}

                    {/* Logout */}
                    <button onClick={handleLogout} className="relative text-red-500 hover:text-red-700 transition duration-200 group">
                        <span className="group-hover:border-red-700 pb-1 border-b-2 border-transparent transition-all duration-200">Log Out</span>
                    </button>
                </nav>
            )}
        </header>
    );
}