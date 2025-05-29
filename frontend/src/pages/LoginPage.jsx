import { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../lib/api';
import { AuthContext } from '../contexts/AuthContext';

export default function LoginPage() {
    const [username_or_email, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setToken } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const successMessage = location.state?.successMessage;

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const res = await api.post('/users/login', { username_or_email, password });
            setToken(res.data.token);
            navigate('/designs');
        } catch {
            alert('Login fallit: revisa identificador i contrasenya');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto mt-20 px-4 sm:px-6 py-6 bg-white border rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-center mb-6">Iniciar sessió</h2>
            {successMessage && (
                <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md text-sm text-center">
                    {successMessage}
                </div>
            )}

            <input className="w-full p-3 border mb-4" placeholder="Username o email" value={username_or_email} onChange={e => setUsernameOrEmail(e.target.value)} required />
            <input type="password" className="w-full p-3 border mb-4" placeholder="Contrasenya" value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="submit" className="w-full p-3 bg-blue-600 hover:bg-blue-900 rounded-md transition-colors duration-100 text-white">
                Entrar
            </button>

            <div>
                <p className="mt-6 text-center text-sm text-gray-600">
                    Encara no tens un compte? <a href="/register" className="text-blue-600 hover:text-blue-900 hover:underline">Registra't aquí</a>
                </p>
            </div>
        </form>
    );
}