import React from 'react';
import * as fabric from 'fabric';

export default function SidebarPanel({ canvas, onSave }) {
    const addRect = () => {
        const rect = new fabric.Rect({
            left: 100,
            top: 100,
            fill: 'skyblue',
            width: 100,
            height: 60,
        });
        canvas.add(rect);
    };

    const addCircle = () => {
        const circle = new fabric.Circle({
            left: 150,
            top: 150,
            fill: 'lightgreen',
            radius: 50,
        });
        canvas.add(circle);
    };

    const addText = () => {
        const text = new fabric.IText('Text aquí', {
            left: 200,
            top: 200,
            fontSize: 20,
        });
        canvas?.add(text);
    };

    const deleteObject = () => {
        const active = canvas?.getActiveObject();
        if (active) canvas.remove(active);
    };

    const undo = () => {
        //
    };

    const redo = () => {
        //
    };

    return (
        <aside className="w-48 bg-white border-r p-4 space-y-2 shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Eines</h2>
            <button onClick={addRect} className="w-full bg-blue-100 hover:bg-blue-200 text-sm py-1 px-2 rounded transition">Afegir rectangle</button>
            <button onClick={addCircle} className="w-full bg-blue-100 hover:bg-blue-200 text-sm py-1 px-2 rounded transition">Afegir cercle</button>
            <button onClick={addText} className="w-full bg-blue-100 hover:bg-blue-200 text-sm py-1 px-2 rounded transition">Afegir text</button>
            <hr />
            <button onClick={deleteObject} className="w-full text-red-600 text-sm py-1 px-2 rounded hover:bg-red-50 transition">Esborrar selecció</button>
            <button onClick={undo} className="w-full text-gray-600 text-sm py-1 px-2 rounded hover:bg-gray-100 transition">Desfer</button>
            <button onClick={redo} className="w-full text-gray-600 text-sm py-1 px-2 rounded hover:bg-gray-100 transition">Refer</button>
            <button onClick={onSave} className="w-full bg-green-100 hover:bg-green-200 text-sm py-1 px-2 rounded transition">Desar</button>
            <hr />

        </aside>
    );
}
