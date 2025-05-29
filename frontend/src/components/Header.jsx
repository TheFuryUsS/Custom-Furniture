import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Menu, X } from 'lucide-react'

export default function Header() {
    const { token, setToken, user } = useContext(AuthContext);
    const nav = useNavigate();
    const [menuDisplayed, setMenuDisplayed] = useState(false);

    const handleLogout = () => {
        setToken(null);
        nav('/');
    };


    return (
        <header className="bg-slate-100 shadow-md p-4 flex items-center justify-between font-sans relative">
            <Link to="/" className="flex items-center">
                <img src="/logo.png" alt="img logo" className="h-10 w-auto transition-transform duration-300 hover:scale-105" />
            </Link>

            {/* Mostra només si hi ha usuari loguejat (per si més tard incloc el header a la landing o altres pags) */}
            {token && (
                <div className="flex items-center space-x-4">
                    {/* Lletra usuari (mòbil) */}
                    {user && (
                        <div title={user.username} className="w-8 h-8 flex items-center justify-center md:hidden bg-blue-600 text-white rounded-full uppercase font-semibold">
                            {user.username?.charAt(0)}
                        </div>
                    )}

                    {/* MENÚ NORMAL (ordinador) */}
                    <nav className="hidden md:flex items-center space-x-6 text-sm">
                        {/* Dissenys i perfil */}
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

                    {/* Icona activar menú mòbil */}
                    <div className="relative w-6 h-6 md:hidden">
                        <Menu size={24} onClick={() => setMenuDisplayed(true)} className={`absolute top-0 left-0 transition-all duration-300 ease-in-out transform ${menuDisplayed ? 'opacity-0 rotate-45 scale-90 pointer-events-none' : 'opacity-100 rotate-0 scale-100'}`} />
                        <X size={24} onClick={() => setMenuDisplayed(false)} className={`absolute top-0 left-0 transition-all duration-300 ease-in-out transform ${menuDisplayed ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-45 scale-90 pointer-events-none'}`} />
                    </div>

                </div>
            )}
            {/* MENÚ DESPLEGABLE MÒBIL */}
            {menuDisplayed && (
                <div className="absolute right-2 top-12 z-50 bg-white border rounded-md shadow-lg flex flex-col text-base md:hidden w-48 transform transition-all duration-300 ease-out">
                    <Link to="/designs" onClick={() => setMenuDisplayed(false)} className="px-4 py-2.5 hover:bg-gray-100 text-gray-700">Dissenys</Link>
                    <Link to="/profile" onClick={() => setMenuDisplayed(false)} className="px-4 py-2.5 hover:bg-gray-100 text-gray-700">Perfil</Link>
                    <button onClick={() => { setMenuDisplayed(false); handleLogout(); }} className="px-4 py-2.5 text-left hover:bg-gray-100 text-red-500">Log Out</button>
                </div>
            )}
        </header>
    );
}