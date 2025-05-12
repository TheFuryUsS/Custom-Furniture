import React, { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as fabric from 'fabric';
import api from '../lib/api';
import SidebarPanel from './canvas/SidebarPanel';

export default function CanvasEditor() {
    const canvasRef = useRef(null);
    const [canvas, setCanvas] = useState(null);
    const { id } = useParams();

    // Inicialitza Fabric.js
    useEffect(() => {
        const fabricCanvas = new fabric.Canvas(canvasRef.current, {
            width: 900,
            height: 600,
            backgroundColor: '#ffffff',
        });

        setCanvas(fabricCanvas);

        return () => fabricCanvas.dispose();
    }, []);

    // Segon useEffect per evitar errors quan canvas es null (només quan canvia el canvas i l'id)
    useEffect(() => {
        if (!canvas) return;

        api.get(`/designs/${id}`)
            .then(res => {
                const designData = res.data?.data;
                if (designData) {
                    canvas.loadFromJSON(designData, () => {
                        setTimeout(() => { // Per a que el renderAll s'executi correctament abans que el canvas carregui els objectes
                            canvas.renderAll();
                            canvas.calcOffset();
                        }, 0);
                    });
                }
            })
            .catch(err => {
                console.error('Error carregant el disseny:', err);
            });
    }, [canvas, id]);


    const handleSave = async () => {
        if (!canvas) return;
        const jsonDisseny = canvas.toJSON();

        try {
            await api.put(`/designs/${id}`, { data: jsonDisseny });
            alert('Disseny desat correctament');
        } catch (err) {
            console.error('Error desant el disseny:', err);
            alert('No s’ha pogut desar');
        }
    };


    return (
        <div className="flex h-full">
            <SidebarPanel canvas={canvas} onSave={handleSave} />
            <div className="flex-grow flex justify-center items-center bg-gray-50 p-4">
                <canvas id="editor-canvas" ref={canvasRef} className="border shadow" />
            </div>
        </div>
    );
}
