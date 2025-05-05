import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';

export default function PublicLayout() {
    return (
        <div className="flex flex-col min-h-screen w-full">
            <main className="flex-grow w-full">
                <Outlet />  {/* LandingPage, LoginPage */}
            </main>
            <Footer />
        </div>
    );
}