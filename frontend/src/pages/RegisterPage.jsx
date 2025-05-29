import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { AuthContext } from '../contexts/AuthContext';

// Almenys 8 chars, majuscula, minuscula, numero i simbol
const FORMATPASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

export default function RegisterPage() {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (name === 'password' && FORMATPASSWORD.test(value)) {
            setError('');
        }
    };

    const handleSubmit = async e => {
        e.preventDefault();

        if (!FORMATPASSWORD.test(formData.password)) {
            setError('Mínim 8 caràcters, inclou majúscules, minúscules, dígits i símbols');
            return;
        }

        try {
            const res = await api.post('/users/register', formData);
            navigate('/login', { state: { successMessage: "Usuari registrat correctament. Ara pots iniciar sessió." } });
        } catch (err) {
            console.error(err);
            alert('Error en el registre. Aquest correu o nom d\'usuari ja existeix.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto mt-20 px-4 sm:px-6 py-6 bg-white border rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-center mb-6">Crear un compte</h2>
            <div className="mb-4">
                <input name="username" value={formData.username} onChange={handleChange} placeholder="Nom d'usuari" className="w-full p-3 border mb-4" required />
            </div>

            <div className="mb-4">
                <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Correu electrònic" className="w-full p-3 border mb-4" required />
            </div>

            <div className="mb-4">
                <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Contrasenya" className="w-full p-3 border mb-4" required />
                {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
            </div>


            <button type="submit" className="w-full py-3 bg-green-700 hover:bg-green-800 text-white font-semibold rounded-md transition duration-200">Registrar-se</button>

            <div>
                <p className="mt-6 text-center text-sm text-gray-600">
                    Ja tens un compte? <a href="/login" className="text-blue-600 hover:text-blue-800 hover:underline">Inicia sessió aquí</a>
                </p>
            </div>
        </form>
    );
}