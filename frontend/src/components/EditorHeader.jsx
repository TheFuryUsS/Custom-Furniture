import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../lib/api';

export default function EditorHeader() {
    const { id } = useParams();
    const [designName, setDesignName] = useState('');
    const [originalName, setOriginalName] = useState('');
    const [allDesigns, setAllDesigns] = useState([]);


    useEffect(() => {
        const fetchAllDesigns = async () => {
            try {
                const res = await api.get('/designs');
                setAllDesigns(res.data);
            } catch (err) {
                console.error('Error carregant tots els dissenys:', err);
            }
        };

        fetchAllDesigns();
    }, []);

    useEffect(() => {
        const fetchCurrentDesign = async () => {
            try {
                const res = await api.get(`/designs/${id}`);
                const current = res.data;
                setDesignName(current.name || '');
                setOriginalName(current.name || '');
            } catch (err) {
                console.error('Error carregant el disseny:', err);
            }
        };
        fetchCurrentDesign();
    }, [id]);

    const updateName = async () => {
        const nameTrimmed = designName.trim();
        if (!nameTrimmed || nameTrimmed === originalName) {
            setDesignName(originalName);
            return;
        }

        const nameExists = allDesigns.some(d => d.name.trim().toLowerCase() === nameTrimmed.trim().toLowerCase() && d.id !== id);

        if (nameExists) {
            alert('Ja existeix un altre disseny amb aquest nom.');
            setDesignName(originalName);
            return;
        }

        try {
            await api.put(`/designs/${id}`, { name: nameTrimmed });
            setOriginalName(nameTrimmed);
        } catch (err) {
            console.error('Error actualitzant el nom:', err);
            alert('No s’ha pogut actualitzar el nom');
            setDesignName(originalName);
        }
    };

    const handleKey = (e) => {
        if (e.key === 'Enter' || e.key === 'Escape') e.target.blur();
    };

    return (
        <header className="bg-gray-100 border-b px-4 py-2 flex items-center space-x-4 shadow-sm">
            {/* LOGO */}
            <a href="/designs">
                <img
                    src="/iconbo.png"
                    alt="imglogo"
                    className="h-9 w-auto hover:scale-105 transition-transform"
                />
            </a>

            {/* NOM */}
            <input
                type="text"
                value={designName}
                onChange={(e) => setDesignName(e.target.value)}
                onBlur={updateName}
                onKeyDown={handleKey}
                className="text-lg font-medium bg-transparent focus:outline-none px-2 py-1 rounded transition
                hover:ring-[0.5px] hover:ring-black/70
                focus:ring-[0.5px] focus:ring-black/70"
            />
        </header>
    );
}
