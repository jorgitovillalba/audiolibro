import React, { useEffect, useState } from 'react';
import api from '../api';

const Chapters = () => {
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchChapters = async () => {
            try {
                const response = await api.get('/capitulos'); // Asegúrate de que esta URL sea correcta
                setChapters(response.data);
                setLoading(false);
            } catch (err) {
                setError('Error al cargar capítulos');
                setLoading(false);
            }
        };

        fetchChapters();
    }, []);

    if (loading) return <p>Cargando capítulos...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Capítulos</h2>
            <ul>
                {chapters.map((chapter) => (
                    <li key={chapter.id}>Capítulo {chapter.numero}: {chapter.titulo}</li>
                ))}
            </ul>
        </div>
    );
};

export default Chapters;
