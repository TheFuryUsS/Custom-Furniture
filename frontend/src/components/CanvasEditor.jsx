import React, { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as fabric from 'fabric';
import api from '../lib/api';
import SidebarPanel from './canvas/SidebarPanel';

export default function CanvasEditor() {
    const canvasRef = useRef(null);
    const [canvas, setCanvas] = useState(null);
    const { id } = useParams();

    const BASE_IMAGES = {
        moble: '/base-moble.png',
        catifa: '/base-catifa.png',
        lampara: '/base-lampara.png',
    };

    // Inicialitza Fabric.js
    useEffect(() => {
        const fabricCanvas = new fabric.Canvas(canvasRef.current, {
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: 'transparent',
            selection: false,
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
                const designType = res.data?.type;
                const backgroundImageUrl = BASE_IMAGES[designType] || '/base-default.png';

                fabric.util.loadImage(backgroundImageUrl, (img) => {
                    if (img) {
                        const fabricImage = new fabric.Image(img, {
                            scaleX: canvas.width / img.width,
                            scaleY: canvas.height / img.height,
                            selectable: false,
                        });
                        canvas.setBackgroundImage(fabricImage, canvas.renderAll.bind(canvas));
                    }
                });

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
            await api.put(`/designs/${id}`, { data: jsonDisseny/*, type: designType*/ });
            alert('Disseny desat correctament');
        } catch (err) {
            console.error('Error desant el disseny:', err);
            alert('No s’ha pogut desar');
        }
    };


    return (
        <div className="flex h-screen">
            <SidebarPanel canvas={canvas} onSave={handleSave} />
            <div className="flex-grow relative">
                <canvas ref={canvasRef} className="w-full h-full" />
            </div>
        </div>
    );
}
