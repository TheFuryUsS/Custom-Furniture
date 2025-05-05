import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

export default function DesignsPage() {
    const [designs, setDesigns] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/designs')
            .then(res => setDesigns(res.data))
            .catch(err => console.error(err));
    }, []);

    const handleNewDesign = async () => {
        const nextName = `Disseny ${designs.length + 1}`;
        try {
            const res = await api.post('/designs', { 
                name: nextName,
                data: {}
            });
            navigate(`/editor/${res.data.id}`);
        } catch (err) {
            console.error('Error creant el disseny:', err);
            alert('No s’ha pogut crear el disseny');
        }
    };

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Els meus dissenys</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

                <div onClick={handleNewDesign} className="border-2 border-dashed border-blue-400 p-6 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50">
                    <span className="text-4xl text-blue-500">＋</span>
                    <p className="mt-2 font-medium text-blue-700">Nou disseny</p>
                </div>


                {designs.map(d => (
                    <div key={d.id} className="border p-4 rounded shadow hover:shadow-md cursor-pointer" onClick={() => navigate(`/editor/${d.id}`)}>
                        <h3 className="font-semibold text-lg mb-2">{d.name}</h3>
                        <p className="text-sm text-gray-600">ID: {d.id}</p>
                        {/* afegir imatge preview per ex. */}
                    </div>
                ))}
            </div>
        </div>
    );
}