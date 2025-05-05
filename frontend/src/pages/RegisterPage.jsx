import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { AuthContext } from '../contexts/AuthContext';

export default function RegisterPage() {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const navigate = useNavigate();

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const res = await api.post('/users/register', formData);
            navigate('/login', { state: { successMessage: "Usuari registrat correctament. Ara pots iniciar sessió." } });
        } catch (err) {
            console.error('Error en el registre:', err);
            alert('Error en el registre. Aquest correu o nom d\'usuari ja existeix.'); 
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-4 bg-white shadow rounded">
            <h2 className="text-xl font-semibold mb-4">Crear un compte</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input name="username" value={formData.username} onChange={handleChange} placeholder="Nom d'usuari" className="w-full p-2 border rounded" />
                <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Correu electrònic" className="w-full p-2 border rounded" />
                <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Contrasenya" className="w-full p-2 border rounded" />
                <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">Registrar-se</button>
            </form>
        </div>
    );
}