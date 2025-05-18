import React, { useState } from 'react';
import * as fabric from 'fabric';

export default function SidebarPanel({ canvas, onSave }) {
    const [color, setColor] = useState('#000000');

    const setDrawingMode = () => {
        if (!canvas) return;
        canvas.isDrawingMode = true;
        canvas.freeDrawingBrush.color = color;
        canvas.freeDrawingBrush.width = 50;
    };

    const centerObject = (object) => {
        const center = canvas.getCenter();
        object.set({
            left: center.left - object.getScaledWidth() / 2,
            top: center.top - object.getScaledHeight() / 2,
        });
        object.setCoords();
        canvas.add(object);
        canvas.setActiveObject(object);
        canvas.renderAll();
    };

    const addImage = async (e) => {
        const file = e.target.files[0];
        if (!file || !canvas) return;

        const reader = new FileReader();
        reader.onload = async () => {
            const dataURL = reader.result;

            try {
                const img = await fabric.Image.fromURL(dataURL);

                const canvasW = canvas.getWidth();
                const canvasH = canvas.getHeight();

                img.scaleX = canvasW / img.width;
                img.scaleY = canvasH / img.height;

                img.originX = 'center';
                img.originY = 'center';
                img.left = canvasW / 2;
                img.top = canvasH / 2;

                img.set({ src: dataURL }); // Guardat imatges

                canvas.add(img);
                canvas.setActiveObject(img);
                canvas.isDrawingMode = false;
                canvas.requestRenderAll();
            } catch (error) {
                console.error('Error carregant imatge:', error);
            }
        };

        reader.readAsDataURL(file);
    };  

    const addShape = (type) => {
        if (!canvas) return;
        let shape;

        switch (type) {
            case 'rect':
                shape = new fabric.Rect({
                    width: 100,
                    height: 100,
                    fill: color,
                    left: 100,
                    top: 100,
                });
                break;
            case 'circle':
                shape = new fabric.Circle({
                    radius: 50,
                    fill: color,
                    left: 120,
                    top: 120,
                });
                break;
            case 'triangle':
                shape = new fabric.Triangle({
                    width: 100,
                    height: 100,
                    fill: color,
                    left: 120,
                    top: 120,
                });
                break;
            case 'line':
                shape = new fabric.Line([50, 100, 200, 100], {
                    stroke: color,
                    strokeWidth: 3,
                    left: 100,
                    top: 150,
                });
                break;
            case 'text':
                shape = new fabric.IText('Text aquí', {
                    left: 200,
                    top: 200,
                    fill: color,
                    fontSize: 20,
                });
                break;
            default:
                return;
        }

        centerObject(shape);
        canvas.isDrawingMode = false;
    };

    const deleteObject = () => {
        const active = canvas?.getActiveObject();
        if (active) canvas.remove(active);
    };

    return (
        <div className="absolute left-4 top-20 bg-white shadow-xl rounded-2xl p-4 w-60 space-y-4 z-50 border border-gray-200">
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">🎨 Color</label>
                <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full h-10 rounded-md border border-gray-300"
                />
            </div>

            <button onClick={setDrawingMode} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-3 rounded-md transition">🖍️ Llapis</button>

            <button onClick={() => addShape('rect')} className="w-full bg-gray-100 hover:bg-gray-200 text-sm py-2 rounded-md">⬛ Quadrat</button>
            <button onClick={() => addShape('circle')} className="w-full bg-gray-100 hover:bg-gray-200 text-sm py-2 rounded-md">⚪ Cercle</button>
            <button onClick={() => addShape('triangle')} className="w-full bg-gray-100 hover:bg-gray-200 text-sm py-2 rounded-md">🔺 Triangle</button>
            <button onClick={() => addShape('line')} className="w-full bg-gray-100 hover:bg-gray-200 text-sm py-2 rounded-md">📏 Línia</button>
            <button onClick={() => addShape('text')} className="w-full bg-gray-100 hover:bg-gray-200 text-sm py-2 rounded-md">T Text</button>


            <div className="pt-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">🖼️ Afegeix imatge</label>
                <input type="file" accept="image/*" onChange={addImage} className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" />
            </div>

            <button onClick={deleteObject} className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-3 rounded-md transition">Esborrar selecció</button>
            <hr />
        </div>
    );
}
