import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { AuthContext } from '../contexts/AuthContext';

// Almenys 8 chars, majuscula, minuscula, numero i simbol
const FORMATPASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

export default function RegisterPage() {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState({});
    const navigate = useNavigate();

    const validate = (name, value) => {
        let msg;
        if (!value) msg = 'Camp obligatori';
        else {
            if (name === 'password' && !FORMATPASSWORD.test(value)) {
                msg = 'Mínim 8 caràcters, inclou majúscules, minúscules, dígits i símbols';
            }
        }
        setError(err => ({ ...err, [name]: msg }));
    };

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData({ ...formData, [e.target.name]: e.target.value });
        validate(name, value);
    };

    const isFormValid = () => {
        return (
            formData.username &&
            formData.email &&
            formData.password &&
            !error.username &&
            !error.email &&
            !error.password
        );
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (!isFormValid()) return;

        try {
            const res = await api.post('/users/register', formData);
            navigate('/login', { state: { successMessage: "Usuari registrat correctament. Ara pots iniciar sessió." } });
        } catch (err) {
            console.error(err);
            alert('Error en el registre. Aquest correu o nom d\'usuari ja existeix.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-20 p-4 border rounded">
            <h2 className="text-lg mb-2">Crear un compte</h2>
            <div className="mb-4">
                <input name="username" value={formData.username} onChange={handleChange} placeholder="Nom d'usuari" className="w-full p-2 border mb-4" />
                {error.username && <p className="text-red-600 text-sm">{error.username}</p>}
            </div>

            <div className="mb-4">
                <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Correu electrònic" className="w-full p-2 border mb-4" />
                {error.email && <p className="text-red-600 text-sm">{error.email}</p>}
            </div>

            <div className="mb-4">
                <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Contrasenya" className="w-full p-2 border mb-4" />
                {error.password && <p className="text-red-600 text-sm">{error.password}</p>}
            </div>


            <button type="submit" disabled={!isFormValid()} className={`w-full p-2 rounded-md text-white ${isFormValid() ? 'bg-green-700 hover:bg-green-900' : 'bg-gray-400 cursor-not-allowed'}`}>Registrar-se</button>

            <div>
                <p className="mt-4 text-center">
                    Ja tens un compte? <a href="/login" className="text-blue-600 hover:text-blue-900 hover:underline">Inicia sessió aquí</a>
                </p>
            </div>
        </form>
    );
}