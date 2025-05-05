import React from 'react';
import CanvasEditor from '../components/CanvasEditor';

export default function EditorPage() {
    return (
        <div className="flex">
            <div className="w-1/6 p-2">
                <h3 className="font-semibold mb-2">PÀGINA EDITOR</h3>
            </div>
            <div className="flex-grow p-2">
                <CanvasEditor />
            </div>
            
        </div>
    );
}