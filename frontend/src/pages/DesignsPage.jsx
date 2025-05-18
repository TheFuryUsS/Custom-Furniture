import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { BedSingle, LampFloor, Barcode, Trash2 } from 'lucide-react';

export default function DesignsPage() {
    const [designs, setDesigns] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [newName, setNewName] = useState('');
    const [newType, setNewType] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const ICON = {
        moble: BedSingle,
        catifa: Barcode,
        lampara: LampFloor,
    };

    useEffect(() => {
        api.get('/designs')
            .then(res => setDesigns(res.data))
            .catch(err => console.error(err));
    }, []);

    const handleNewDesignClick = () => {
        setNewName('');
        setError('');
        setShowPopup(true);
    };

    const handleCreateDesign = async () => {
        const nameExists = designs.some(d => d.name.trim().toLowerCase() === newName.trim().toLowerCase());
        if (!newName.trim()) {
            setError('El nom no pot estar buit.');
            return;
        }
        if (!newType) {
            setError('Has de seleccionar un tipus de disseny.');
            return;
        }
        if (nameExists) {
            setError('Ja existeix un disseny amb aquest nom.');
            return;
        }

        try {
            const res = await api.post('/designs', {
                name: newName.trim(),
                type: newType,
                data: {}
            });
            navigate(`/editor/${res.data.id}`);
        } catch (err) {
            console.error('Error creant disseny:', err);
            alert('No s’ha pogut crear el disseny');
        } finally {
            setShowPopup(false);
        }
    };

    const handleDelete = async (id) => {
        const confirm = window.confirm('Segur que vols eliminar aquest disseny?');
        if (!confirm) return;

        try {
            await api.delete(`/designs/${id}`);
            setDesigns(prev => prev.filter(d => d.id !== id));
            alert('Disseny eliminat correctament.');
        } catch (err) {
            console.error('Error esborrant:', err);
            alert('No s’ha pogut eliminar el disseny');
        }
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Els meus dissenys</h2>

            {/* POPUP */}
            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
                        <h3 className="text-lg font-semibold mb-2">Nom del nou disseny</h3>
                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="w-full border p-2 rounded mb-2"
                            placeholder="Ex. Disseny catifa 4"
                        />
                        <select value={newType} onChange={(e) => setNewType(e.target.value)} className="w-full border p-2 rounded mb-2">
                            <option value="" disabled hidden>Quin tipus de moble vols personalitzar?</option>
                            <option value="moble">Moble</option>
                            <option value="catifa">Catifa</option>
                            <option value="lampara">Làmpara</option>
                        </select>

                        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setShowPopup(false)} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
                                Cancel·lar
                            </button>
                            <button onClick={handleCreateDesign} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                                Crear
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* DISSENYS */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

                <div onClick={handleNewDesignClick} className="border-2 border-dashed border-blue-400 p-6 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50">
                    <span className="text-4xl text-blue-500">＋</span>
                    <p className="mt-2 font-medium text-blue-700">Nou disseny</p>
                </div>

                {designs.map(d => {
                    const IconComponent = ICON[d.type];
                    return (
                        <div key={d.id}
                            onClick={() => navigate(`/editor/${d.id}`)}
                            className="relative border p-4 rounded shadow hover:shadow-md cursor-pointer group">

                            <button
                                onClick={(e) => {
                                    e.stopPropagation(); // Per a que no detecti el clic a la card
                                    handleDelete(d.id);
                                }}
                                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition pointer-events-none group-hover:pointer-events-auto">
                                <Trash2 size={18} />
                            </button>

                            {IconComponent && (
                                <IconComponent className="text-blue-500 mb-2" size={26} />
                            )}

                            <h3 className="font-semibold text-lg mb-2">{d.name}</h3>
                            {/*<p className="text-sm text-gray-600">ID: {d.id}</p>*/}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}