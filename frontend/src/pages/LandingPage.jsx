import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function LandingPage() {
    const nav = useNavigate();
    const { token } = useContext(AuthContext);
    const [slideIndex, setSlideIndex] = useState(0);

    const images = [
        '/base-catifa.png',
        '/catifa-random.jpg',
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setSlideIndex((prev) => (prev + 1) % images.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [images.length]);

    const handleLogin = () => {
        if (token) {
            nav('/designs');
        } else {
            nav('/login');
        }
    };

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-gray-50 px-4 sm:px-6 pt-20 pb-12">
            {/* Text i botó */}
            <div className="text-center max-w-lg">
                <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
                    Custom Furniture
                </h1>
                <p className="text-gray-600 text-lg mb-6">
                    Crea i personalitza els teus productes decoratius online.
                </p>
                <button onClick={handleLogin} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition duration-300">
                    Comença a editar!
                </button>
            </div>

            {/* Carrusel imatges */}
            <div className="relative w-full overflow-hidden my-12">
                <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${slideIndex * 100}%)` }}>
                    {images.map((img, idx) => (
                        <div key={idx} className="flex-shrink-0 w-full flex justify-center items-center">
                            <img src={img} alt={'Imatge exemple'} className="max-h-[500px] w-auto object-contain mx-auto"/>
                        </div>
                    ))}
                </div>
            </div>


            {/* Icones features web */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center max-w-6xl mx-auto">
                <div>
                    <p className="text-blue-600 text-3xl mb-2">🎨</p>
                    <p className="font-semibold">Editor Visual</p>
                    <p className="text-sm text-gray-500">Canvia colors, formes i més.</p>
                </div>
                <div>
                    <p className="text-blue-600 text-3xl mb-2">📐</p>
                    <p className="font-semibold">Mides personalitzades</p>
                    <p className="text-sm text-gray-500">Adapta cada peça a casa teva.</p>
                </div>
                <div>
                    <p className="text-blue-600 text-3xl mb-2">🛒</p>
                    <p className="font-semibold">Compra fàcil</p>
                    <p className="text-sm text-gray-500">Tot online i sense complicacions.</p>
                </div>
                <div>
                    <p className="text-blue-600 text-3xl mb-2">🚚</p>
                    <p className="font-semibold">Entrega ràpida</p>
                    <p className="text-sm text-gray-500">Rep els teus productes en dies.</p>
                </div>
            </div>
        </div>
    );
}
