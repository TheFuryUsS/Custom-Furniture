import React from 'react';

export default function TopMenu({ onSave, onExport, onUndo, onRedo }) {
    return (
        <div className="absolute top-4 left-4 bg-white shadow-md p-2 rounded z-50 space-x-2">
            <button onClick={onSave} className="btn">💾 Desa</button>
            <button onClick={onExport} className="btn">⬇️ Exporta</button>
            <button onClick={onUndo} className="btn">↩️ Desfer</button>
            <button onClick={onRedo} className="btn">↪️ Refer</button>
        </div>
    );
}