import React, { useContext, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function AuthLayout() {
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, token);

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow p-4 bg-gray-50">
                <Outlet /> {/* EditorPage, DesignsPage, ProfilePage */}
            </main>
            <Footer />
        </div>
    );
}