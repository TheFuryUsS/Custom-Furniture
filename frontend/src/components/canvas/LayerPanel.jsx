import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, Lock, Unlock, ArrowUp, ArrowDown, Pencil, Square, Circle, Triangle, Type, Slash, ImagePlus as ImageIcon, QrCode as QrCodeIcon, Trash, X } from 'lucide-react';

export default function LayerPanel({ canvas }) {
    const [objects, setObjects] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [nameInput, setNameInput] = useState('');
    const [activeObject, setActiveObject] = useState(null);
    const [draggedIndex, setDraggedIndex] = useState(null);

    useEffect(() => {
        if (!canvas) return;

        const handleUpdate = () => {
            refreshObjects();
            setActiveObject(canvas.getActiveObject());
        };

        refreshObjects();
        canvas.on('object:added', handleUpdate);
        canvas.on('object:removed', handleUpdate);
        canvas.on('object:modified', handleUpdate);
        canvas.on('selection:cleared', () => setActiveObject(null));
        canvas.on('selection:updated', () => setActiveObject(canvas.getActiveObject()));
        canvas.on('selection:created', () => setActiveObject(canvas.getActiveObject()));

        return () => {
            canvas.off('object:added', handleUpdate);
            canvas.off('object:removed', handleUpdate);
            canvas.off('object:modified', handleUpdate);
            canvas.off('selection:cleared');
            canvas.off('selection:updated');
            canvas.off('selection:created');
        };
    }, [canvas]);

    const refreshObjects = () => {
        const objs = canvas.getObjects()
            .filter(obj => obj)
            .map((obj, index) => ({
                id: obj.id || index,
                type: obj.type,
                obj,
                name: obj.layerName || `${obj.type.charAt(0).toUpperCase() + obj.type.slice(1)}`,
                zIndex: index
            }));

        setObjects(objs.reverse());
    };

    const selectObject = (obj) => {
        canvas.setActiveObject(obj);
        canvas.requestRenderAll();
        setActiveObject(obj);
        console.log('zIndex:', canvas.getObjects().indexOf(obj));
    };

    const deleteObject = (obj) => {
        canvas.remove(obj);
        canvas.discardActiveObject();
        canvas.requestRenderAll();
        setActiveObject(null);
    };

    const toggleVisibility = (obj) => {
        obj.visible = !obj.visible;
        canvas.requestRenderAll();
        refreshObjects();
    };

    const toggleLock = (obj) => {
        obj.selectable = !obj.selectable;
        obj.evented = obj.selectable;
        canvas.requestRenderAll();
        refreshObjects();
    };

    const reorderObject = (fromIndex, toIndex) => {
        const objs = canvas.getObjects();
        if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return;

        const [moved] = objs.splice(fromIndex, 1);
        objs.splice(toIndex, 0, moved);

        canvas._objects = objs;
        canvas.renderAll();
        refreshObjects();
    };

    const startEditing = (id, currentName) => {
        setEditingId(id);
        setNameInput(currentName);
    };

    const saveName = (item) => {
        item.obj.layerName = nameInput.trim() || item.name;
        canvas.requestRenderAll();
        setEditingId(null);
        refreshObjects();
    };

    const getLayerIcon = (type) => {
        switch (type) {
            case 'path':
                return <Pencil className="w-4 h-4 text-gray-500 mr-2" />;
            case 'rect':
                return <Square className="w-4 h-4 text-gray-500 mr-2" />;
            case 'circle':
                return <Circle className="w-4 h-4 text-gray-500 mr-2" />;
            case 'triangle':
                return <Triangle className="w-4 h-4 text-gray-500 mr-2" />;
            case 'line':
                return <Slash className="w-4 h-4 text-gray-500 mr-2" />;
            case 'i-text':
            case 'textbox':
                return <Type className="w-4 h-4 text-gray-500 mr-2" />;
            case 'image':
                return <ImageIcon className="w-4 h-4 text-gray-500 mr-2" />;
            default:
                return null;
        }
    };


    return (
        <div className="absolute mt-4 right-4 z-50 w-72 max-h-[75vh] overflow-y-auto bg-white border border-gray-200 rounded-md shadow-md p-2">
            <h3 className="font-semibold text-sm mb-2 px-1">Capes</h3>
            <ul className="space-y-1 text-sm">

                {/* OBJECTES */}
                {objects
                    .filter(item => item && item.obj)
                    .map((item, i) => {
                        const isSelected = activeObject === item.obj;
                        return (
                            <li
                                key={i}
                                draggable
                                onDragStart={() => { setDraggedIndex(i); selectObject(item.obj) }}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={() => {
                                    if (draggedIndex === null || draggedIndex === i) return;
                                    const from = objects.length - 1 - draggedIndex;
                                    const to = objects.length - 1 - i;
                                    reorderObject(from, to);
                                    setDraggedIndex(null);
                                }}
                                onClick={() => selectObject(item.obj)}
                                onDoubleClick={() => startEditing(item.id, item.obj.layerName || item.name)}
                                className={`flex items-center justify-between p-2 rounded transition cursor-pointer ${!item.obj.visible ? 'opacity-50' : ''} ${activeObject === item.obj ? 'bg-blue-100' : 'hover:bg-gray-100'} ${draggedIndex === i ? 'border border-blue-300' : ''}`}
                            >
                                {/* Nom */}
                                <div className="flex-1">
                                    {editingId === item.id ? (
                                        <input autoFocus value={nameInput} onChange={(e) => setNameInput(e.target.value)} onBlur={() => saveName(item)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') saveName(item);
                                                if (e.key === 'Escape') setEditingId(null);
                                            }}
                                            className="w-full text-sm px-1 py-0.5 border rounded focus:outline-none"
                                        />
                                    ) : (
                                        <div className="flex items-center">
                                            {getLayerIcon(item.type)}
                                            <span className="truncate text-gray-800" title="Fes doble clic per editar">
                                                {item.obj.layerName || `${item.type.charAt(0).toUpperCase() + item.type.slice(1)}`}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center space-x-1 ml-2">
                                    {/* Mostrar/Ocultar */}
                                    <button onClick={(e) => { toggleVisibility(item.obj); }} title="Mostra/Amaga" className="p-1 hover:bg-gray-200 rounded">
                                        {item.obj.visible ? (
                                            <Eye className="w-4 h-4 text-gray-600" />
                                        ) : (
                                            <EyeOff className="w-4 h-4 text-gray-600" />
                                        )}
                                    </button>

                                    {/* Lock/Unlock */}
                                    <button onClick={(e) => { toggleLock(item.obj); }} title="Bloqueja/Desbloqueja" className="p-1 hover:bg-gray-200 rounded">
                                        {item.obj.selectable ? (
                                            <Unlock className="w-4 h-4 text-gray-600" />
                                        ) : (
                                            <Lock className="w-4 h-4 text-gray-600" />
                                        )}
                                    </button>

                                    {/* Eliminar */}
                                    <button onClick={(e) => { e.stopPropagation(); deleteObject(item.obj); }} title="Esborra" className="p-1 hover:bg-red-100 rounded">
                                        <Trash className="w-4 h-4 text-red-500" />
                                    </button>
                                </div>
                            </li>
                        );
                    })}
            </ul>
        </div>
    );
}
