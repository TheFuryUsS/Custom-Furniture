import React from 'react';
import { Save, Download, Undo, Redo } from 'lucide-react';

export default function TopMenu({ onSave, onExport, onUndo, onRedo }) {
    return (
        <div className="absolute top-4 left-4 z-50 flex items-center gap-1 bg-white border border-gray-200 rounded-md p-1 shadow-sm">
            <button onClick={onSave} title="Desa" className="p-2 hover:bg-gray-200 rounded-md transition-colors duration-100">
                <Save className="w-5 h-5 text-gray-700" />
            </button>
            <button onClick={onExport} title="Exporta" className="p-2 hover:bg-gray-200 rounded-md transition-colors duration-100">
                <Download className="w-5 h-5 text-gray-700" />
            </button>

            <div className="w-px h-6 bg-gray-300 mx-1" />

            <button onClick={onUndo} title="Desfer" className="p-2 hover:bg-gray-200 rounded-md transition-colors duration-100">
                <Undo className="w-5 h-5 text-gray-700" />
            </button>
            <button onClick={onRedo} title="Refer" className="p-2 hover:bg-gray-200 rounded-md transition-colors duration-100">
                <Redo className="w-5 h-5 text-gray-700" />
            </button>
        </div>
    );
}
