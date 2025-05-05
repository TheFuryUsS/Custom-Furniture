import React, { useState } from 'react';

export default function CanvasEditor() {
    const [elements, setElements] = useState([]);

    const addText = () => {
        setElements(prev => [
            ...prev,
            { id: Date.now(), type: 'text', content: 'Text nou', x: 100, y: 100 }
        ]);
    };

    const addImage = () => {
        setElements(prev => [
            ...prev,
            { id: Date.now(), type: 'image', src: './logobo.png', x: 150, y: 150 }
        ]);
    };

    return (
        <div>
            <div className="mb-4 space-x-2">
                <button onClick={addText} className="px-4 py-2 bg-blue-600 text-white rounded">Afegir text</button>
                <button onClick={addImage} className="px-4 py-2 bg-purple-600 text-white rounded">Afegir imatge</button>
            </div>
            <div className="relative border border-gray-400 w-full h-[600px] bg-white">
                {elements.map(el => (
                    <div
                        key={el.id}
                        style={{ position: 'absolute', top: el.y, left: el.x }}
                        className="border border-dashed p-1 bg-opacity-90 bg-white"
                    >
                        {el.type === 'text' && <p>{el.content}</p>}
                        {el.type === 'image' && <img src={el.src} alt="element" />}
                    </div>
                ))}
            </div>
        </div>
    );
}