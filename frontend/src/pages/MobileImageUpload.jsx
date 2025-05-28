import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../lib/api';

export default function MobileImageUpload() {
    const { designId } = useParams();
    const [file, setFile] = useState(null);
    const navigate = useNavigate();

    // Provar quan estigui funcional a internet (Evita accedir manualment al upload d'altres dissenys)
    /*useEffect(() => {
        api.get(`/designs/${designId}`)
            .then(res => {
                if (!res.data || !res.data.id) {
                    navigate('/designs');
                }
            })
            .catch(() => {
                navigate('/designs');
            });
    }, [designId, navigate]);*/

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            alert('Selecciona una imatge primer');
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await api.post(`/designs/${designId}/upload-image`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Imatge enviada!');
            console.log(res.data);
        } catch (err) {
            console.error(err);
            alert('Error enviant la imatge');
        }
    };

    return (
        <div className="p-4 text-center">
            <h2 className="mb-4 text-lg font-semibold">Puja una imatge al disseny</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="mb-4"
                />
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Enviar imatge
                </button>
            </form>
        </div>
    );
}
