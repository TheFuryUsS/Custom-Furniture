import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';

export default function AuthLayout() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow p-4 bg-gray-50">
                <Outlet /> {/* EditorPage, DesignsPage, ProfilePage */}
            </main>
        </div>
    );
}