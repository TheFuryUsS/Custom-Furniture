import React, { useState, useEffect } from 'react';
import api from '../lib/api';

export default function ProfilePage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        api.get('/users')
            .then(res => {
                setUser(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError('Perfil no trobat.');
                setLoading(false);
            });
    }, []);

    if (loading) return <p>🔄 Loading...</p>;
    if (error) return <p>❌ {error}</p>;

    return (
        <div>
            <h2 className="text-xl mb-4">Perfil d’usuari</h2>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
        </div>
    );
}