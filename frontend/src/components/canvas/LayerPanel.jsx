import React, { useEffect, useState } from 'react';

export default function LayerPanel({ canvas }) {
    const [objects, setObjects] = useState([]);

    useEffect(() => {
        if (!canvas) return;

        const update = () => {
            const objs = canvas.getObjects().map((obj, index) => ({
                id: obj.id || index,
                type: obj.type,
                obj,
            }));
            setObjects(objs);
        };

        update();
        canvas.on('object:added', update);
        canvas.on('object:removed', update);
        canvas.on('object:modified', update);

        return () => {
            canvas.off('object:added', update);
            canvas.off('object:removed', update);
            canvas.off('object:modified', update);
        };
    }, [canvas]);

    const selectObject = (obj) => {
        canvas.setActiveObject(obj);
        canvas.requestRenderAll();
    };

    const deleteObject = (obj) => {
        canvas.remove(obj);
        canvas.discardActiveObject();
        canvas.requestRenderAll();
    };

    return (
        <div className="mt-4">
            <h3 className="font-semibold text-sm mb-1">Capes</h3>
            <ul className="space-y-1 text-sm">
                {objects.map((item, i) => (
                    <li key={i} className="flex items-center justify-between bg-gray-50 p-1 rounded hover:bg-gray-100 transition cursor-pointer">
                        <span onClick={() => selectObject(item.obj)} className="flex-1 truncate">
                            {item.type.charAt(0).toUpperCase() + item.type.slice(1)} #{i + 1}
                        </span>
                        <button onClick={() => deleteObject(item.obj)} className="text-red-500 hover:text-red-700 px-1">
                            ✕
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
