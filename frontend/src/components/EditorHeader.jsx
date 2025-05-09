import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../lib/api';

export default function EditorHeader() {
    const { id } = useParams();
    const [designName, setDesignName] = useState('');
    const [originalName, setOriginalName] = useState('');
    const [allDesigns, setAllDesigns] = useState([]);


    // Llegeix nom inicial disseny i guarda llista de tots (això cada vegada que canvia id, per exemple si es mouen a un altre disseny utilitzant el navegador i introduint el numero a mà)
    useEffect(() => {
        const fetchDesigns = async () => {
            try {
                const res = await api.get('/designs');
                setAllDesigns(res.data);
                const current = res.data.find(d => d.id === Number(id));
                if (current) {
                    setDesignName(current.name || '');
                    setOriginalName(current.name || '');
                }
            } catch (err) {
                console.error('Error carregant els dissenys:', err);
            }
        };

        fetchDesigns();
    }, [id]);

    // Funció per actualitzar el nom
    const updateName = async () => {
        const nameTrimmed = designName.trim();
        if (!nameTrimmed || nameTrimmed === originalName) return;

        const nameExists = allDesigns.some(d =>
            d.id !== Number(id) &&
            d.name.trim().toLowerCase() === nameTrimmed.toLowerCase()
        );

        if (nameExists) {
            alert('Ja existeix un altre disseny amb aquest nom.');
            setDesignName(originalName); // Mostra alerta i es reverteix el canvi
            return;
        }

        try {
            await api.put(`/designs/${id}`, { name: nameTrimmed });
            setOriginalName(nameTrimmed);
        } catch (err) {
            console.error('Error actualitzant el nom:', err);
            alert('No s’ha pogut actualitzar el nom');
        }
    };

    // Enter guarda l'input
    const handleKey = (e) => {
        if (e.key === 'Enter') e.target.blur();
    };

    return (
        <header className="bg-gray-100 border-b px-4 py-2 flex items-center space-x-4 shadow-sm">
            {/* Logo */}
            <a href="/designs">
                <img
                    src="/iconbo.png"
                    alt="imglogo"
                    className="h-9 w-auto hover:scale-105 transition-transform"
                />
            </a>

            {/* Nom */}
            <input
                type="text"
                value={designName}
                onChange={(e) => setDesignName(e.target.value)}
                onBlur={updateName}
                onKeyDown={handleKey}
                className="text-lg font-medium bg-transparent focus:outline-none px-2 py-1 rounded transition
                hover:ring-[0.5px] hover:ring-black/70
                focus:ring-[0.5px] focus:ring-black/70"            />
        </header>
    );
}
