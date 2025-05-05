import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export default function Header() {
    const { token, setToken, user } = useContext(AuthContext);
    const nav = useNavigate();

    const handleLogout = () => {
        setToken(null);
        nav('/');
    };

    return (
        <header className="bg-white shadow p-4 flex items-center justify-between">
            <Link to="/" className="text-xl font-bold">🏠 Decorador</Link>
            {token && (
                <nav className="flex items-center space-x-4">
                    <Link to="/designs" className="hover:underline">Dissenys</Link>
                    <Link to="/profile" className="hover:underline">Perfil</Link>

                    {user && (
                        <div title={user.username} className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-full uppercase font-semibold">
                            {user.username?.charAt(0)}
                        </div>
                    )}
                    <button onClick={handleLogout} className="text-red-500 ml-2">Log Out</button>
                </nav>
            )}
        </header>
    );
}