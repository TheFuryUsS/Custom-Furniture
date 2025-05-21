import React, { useState } from 'react';
import * as fabric from 'fabric';
import { Pencil, Square, Circle, Triangle, Type, LineChart, ImagePlus as ImageIcon, Trash } from 'lucide-react';

export default function SidebarPanel({ canvas, onSave }) {
    const [color, setColor] = useState('#000000');
    const [isDrawing, setIsDrawing] = useState(false);


    const setDrawingMode = () => {
        if (!canvas) return;
        canvas.isDrawingMode = !canvas.isDrawingMode;
        setIsDrawing(canvas.isDrawingMode)
        if (!canvas.freeDrawingBrush) {
            canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
        }
        canvas.freeDrawingBrush.color = color;
        canvas.freeDrawingBrush.width = 5;
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
                setIsDrawing(false);
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
        setIsDrawing(false);
    };

    const deleteObject = () => {
        const active = canvas.getActiveObject();
        if (active) canvas.remove(active);
    };

    return (
        <div className="mt-4 w-14 bg-white border-r border-gray-200 p-2 shadow-md flex flex-col items-center gap-2">

            {/* TOOLS */}
            <div className="flex flex-col gap-2">
                <button onClick={setDrawingMode} title="Dibuix_lliure" className={`p-2 rounded-md transition-colors duration-100 ${isDrawing ? 'bg-blue-100' : 'hover:bg-gray-200'}`}>
                    <Pencil className={`w-5 h-5 ${isDrawing ? 'text-blue-600' : 'text-gray-700'}`} />
                </button>
                <button onClick={() => addShape('rect')} title="Quadrat" className="p-2 hover:bg-gray-200 rounded-md transition-colors duration-100">
                    <Square className="w-5 h-5 text-gray-700" />
                </button>
                <button onClick={() => addShape('circle')} title="Cercle" className="p-2 hover:bg-gray-200 rounded-md transition-colors duration-100">
                    <Circle className="w-5 h-5 text-gray-700" />
                </button>
                <button onClick={() => addShape('triangle')} title="Triangle" className="p-2 hover:bg-gray-200 rounded-md transition-colors duration-100">
                    <Triangle className="w-5 h-5 text-gray-700" />
                </button>
                <button onClick={() => addShape('line')} title="Linia" className="p-2 hover:bg-gray-200 rounded-md transition-colors duration-100">
                    <LineChart className="w-5 h-5 text-gray-700" />
                </button>
                <button onClick={() => addShape('text')} title="Text" className="p-2 hover:bg-gray-200 rounded-md transition-colors duration-100">
                    <Type className="w-5 h-5 text-gray-700" />
                </button>
            </div>

            <div className="w-full h-px bg-gray-300 my-2" />

            {/* IMATGE */}
            <label className="cursor-pointer p-2 hover:bg-gray-200 rounded-md transition-colors duration-100">
                <ImageIcon className="w-5 h-5 text-gray-700" />
                <input type="file" accept="image/*" onChange={addImage} className="hidden" />
            </label>

            <div className="w-full h-px bg-gray-300 my-2" />

            {/* COLORPICKER */}
            <input
                type="color"
                value={color}
                onChange={(e) => {
                    setColor(e.target.value)
                    if (canvas?.freeDrawingBrush) {
                        canvas.freeDrawingBrush.color = e.target.value;
                    }
                }}
                className="w-10 h-10 rounded-md border border-gray-300"
            />

            <div className="w-full h-px bg-gray-300 my-2" />

            {/* DELETE */}
            <button onClick={deleteObject} title="Esborra" className="p-2 bg-red-10 hover:bg-red-200 rounded-md transition-colors duration-100">
                <Trash className="w-5 h-5 text-red-600" />
            </button>
        </div>
    );
}
