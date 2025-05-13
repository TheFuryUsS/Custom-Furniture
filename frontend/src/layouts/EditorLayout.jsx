import React from 'react';
import { Outlet } from 'react-router-dom';
import EditorHeader from '../components/EditorHeader';

export default function EditorLayout() {
    return (
        <div className="w-screen h-screen flex flex-col bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/canvasBackground.jpg')" }}>
            <EditorHeader />
            <main className="flex-grow relative">
                <Outlet />
            </main>
        </div>
    );
}
