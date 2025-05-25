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
        <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-20 p-4 border rounded">
            <h2 className="text-lg mb-2">Crear un compte</h2>

            <input name="username" value={formData.username} onChange={handleChange} placeholder="Nom d'usuari" className="w-full p-2 border mb-4" />
            <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Correu electrònic" className="w-full p-2 border mb-4" />
            <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Contrasenya" className="w-full p-2 border mb-4" />
            <button type="submit" className="w-full p-2 bg-green-700 hover:bg-green-900 rounded-md transition-colors duration-100 text-white">Registrar-se</button>

            <div>
                <p className="mt-4 text-center">
                    Ja tens un compte? <a href="/login" className="text-blue-600 hover:text-blue-900 hover:underline">Inicia sessió aquí</a>
                </p>
            </div>
        </form>
    );
}