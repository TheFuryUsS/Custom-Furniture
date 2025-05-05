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
        <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-20 p-4 border rounded">
            <h2 className="text-lg mb-2">Iniciar sessió</h2>
            {successMessage && (
                <div className="mb-4 p-2 bg-green-100 text-green-800 rounded">
                    {successMessage}
                </div>
            )}

            <input className="w-full p-2 border mb-4" placeholder="Username o email" value={username_or_email} onChange={e => setUsernameOrEmail(e.target.value)}/>
            <input type="password" className="w-full p-2 border mb-4" placeholder="Contrasenya" value={password} onChange={e => setPassword(e.target.value)}/>
            <button type="submit" className="w-full p-2 bg-blue-600 text-white">
                Entrar
            </button>

            <div>
                <p className="mt-4 text-center">
                    Encara no tens un compte? <a href="/register" className="text-blue-600 underline">Registra't aquí</a>
                </p>
            </div>
        </form>
    );
}