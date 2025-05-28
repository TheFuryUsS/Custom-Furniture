import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as fabric from 'fabric';
import { Pencil, Square, Circle, Triangle, Type, Slash, ImagePlus as ImageIcon, QrCode as QrCodeIcon, Trash, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import api from '../../lib/api';

export default function SidebarPanel({ canvas, onSave, designId, onTriggerQr }) {
    const [color, setColor] = useState('#000000');
    const [isDrawing, setIsDrawing] = useState(false);
    const [showQr, setShowQr] = useState(false);
    const navigate = useNavigate();


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

        const formData = new FormData();
        formData.append('image', file);

        try {
            const uploadRes = await api.post(`/designs/${designId}/upload-image-direct`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            const imageUrl = uploadRes.data.imageUrl;
            console.log(imageUrl)
            const fullImageUrl = `http://localhost:3000${imageUrl}`;

            const img = await fabric.Image.fromURL(fullImageUrl, { crossOrigin: 'anonymous' });
            img.crossOrigin = "anonymous";

            const maxWidth = 150;
            const scaleFactor = maxWidth / img.width;

            img.scale(scaleFactor);

            img.originX = 'center';
            img.originY = 'center';
            img.left = canvas.getWidth() / 2;
            img.top = canvas.getHeight() / 2;

            img.set({ src: imageUrl }); // Guardat imatges
            canvas.add(img);
            canvas.setActiveObject(img);
            canvas.isDrawingMode = false;
            setIsDrawing(false);
            canvas.requestRenderAll();
        } catch (error) {
            console.error('Error carregant imatge:', error);
        }
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

    const handleColorChange = (e) => {
        const newColor = e.target.value;
        setColor(newColor);

        if (!canvas) return;

        const activeObject = canvas.getActiveObject();

        if (canvas.isDrawingMode && canvas.freeDrawingBrush) {
            canvas.freeDrawingBrush.color = newColor;
        } else if (activeObject) {
            if (activeObject.type === 'text') {
                activeObject.set({ fill: newColor });
            } else {
                activeObject.set({ fill: newColor, stroke: newColor });
            }
            canvas.requestRenderAll();
        }
    };

    return (
        <>
            <div className="mt-4 w-14 bg-white border-r border-gray-200 p-2 shadow-md flex flex-col items-center gap-2">

                {/* TOOLS */}
                <div className="flex flex-col gap-2">
                    <button onClick={setDrawingMode} title="Pinzell" className={`p-2 rounded-md transition-colors duration-100 ${isDrawing ? 'bg-blue-100' : 'hover:bg-gray-200'}`}>
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
                        <Slash className="w-5 h-5 text-gray-700" />
                    </button>
                    <button onClick={() => addShape('text')} title="Text" className="p-2 hover:bg-gray-200 rounded-md transition-colors duration-100">
                        <Type className="w-5 h-5 text-gray-700" />
                    </button>
                </div>

                <div className="w-full h-px bg-gray-300 my-2" />

                {/* IMATGE i IMATGEQR */}
                <label title="Puja una imatge" className="cursor-pointer p-2 hover:bg-gray-200 rounded-md transition-colors duration-100">
                    <ImageIcon className="w-5 h-5 text-gray-700" />
                    <input type="file" accept="image/*" onChange={addImage} className="hidden" />
                </label>

                <button
                    onClick={() => {
                        onTriggerQr(true)
                        setShowQr(true)
                    }}
                    title="Puja des de mòbil" className="p-2 hover:bg-gray-200 rounded-md transition-colors duration-100">
                    <QrCodeIcon className="w-5 h-5 text-gray-700" />
                </button>


                <div className="w-full h-px bg-gray-300 my-2" />

                {/* COLORPICKER */}
                <input
                    type="color"
                    title="Escull el color"
                    value={color}
                    onChange={handleColorChange}
                    className="w-10 h-10 rounded-md border border-gray-300"
                />

                <div className="w-full h-px bg-gray-300 my-2" />

                {/* DELETE */}
                <button onClick={deleteObject} title="Esborra" className="p-2 bg-red-10 hover:bg-red-200 rounded-md transition-colors duration-100">
                    <Trash className="w-5 h-5 text-red-600" />
                </button>
            </div>


            {/* POPUP QR */}
            {showQr && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg text-center relative w-80">
                        <button onClick={() => { onTriggerQr(false); setShowQr(false) }} className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 transition" title="Tancar">
                            <X className="h-5 w-5 text-gray-500 hover:text-gray-800 transition" />
                        </button>
                        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center leading-snug">
                            Penja una imatge des del mòbil escanejant aquest QR!
                        </h2>
                        <div className="flex justify-center items-center">
                            <QRCodeSVG value={`${window.location.origin}/upload/${designId}`} size={200} />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
