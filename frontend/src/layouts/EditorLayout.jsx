import React from 'react';
import { Outlet } from 'react-router-dom';
import EditorHeader from '../components/EditorHeader';

export default function EditorLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <EditorHeader />
            <main className="flex-grow p-4">
                <Outlet />
            </main>
        </div>
    );
}
