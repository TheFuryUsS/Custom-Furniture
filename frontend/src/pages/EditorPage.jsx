import React from 'react';
import EditorHeader from '../components/EditorHeader';
import CanvasEditor from '../components/CanvasEditor';

export default function EditorPage() {
    return (
        <div className="flex">
            <div className="flex-grow p-2">
                <CanvasEditor />
            </div>
        </div>
    );
}