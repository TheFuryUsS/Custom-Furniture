import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import EditorHeader from '../components/EditorHeader';
import CanvasEditor from '../components/CanvasEditor';

export default function EditorPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        api.get(`/designs/${id}`)
            .then(res => {
                if (!res.data && !res.data.id)
                    navigate('/designs');
            })
            .catch(() => {
                navigate('/designs');
            })
    }, [id]);

    return (
        <div className="flex flex-col h-screen">
            <div className="flex-grow p-2">
                <CanvasEditor />
            </div>
        </div>
    );
}