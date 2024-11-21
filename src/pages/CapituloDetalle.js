import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

const CapituloDetalle = ({ config }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [capitulo, setCapitulo] = useState(null);

    useEffect(() => {
        const fetchCapitulo = async () => {
            try {
                const response = await api.get(`/capitulos/${id}`);
                setCapitulo(response.data);
            } catch (error) {
                console.error('Error al obtener capítulo:', error);
            }
        };

        fetchCapitulo();

        // Limpiar la lectura en voz alta cuando el componente se desmonte
        return () => {
            window.speechSynthesis.cancel();
        };
    }, [id]);

    const marcarComoLeidoYEscuchar = async () => {
        try {
            await api.put(`/capitulos/${id}/marcarleido`);
            if (capitulo) {
                speakText(capitulo.contenido);
            }
        } catch (error) {
            console.error('Error al marcar capítulo como leído:', error);
        }
    };

    const speakText = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Detiene cualquier lectura anterior
            const speech = new SpeechSynthesisUtterance(text);
            const selectedVoice = window.speechSynthesis.getVoices().find((voice) => voice.name === config.voice);
            if (selectedVoice) {
                speech.voice = selectedVoice;
            }
            speech.lang = selectedVoice?.lang || 'es-ES';
            speech.rate = config.speed;
            window.speechSynthesis.speak(speech);
        } else {
            console.error('API de síntesis de voz no soportada en este navegador');
        }
    };

    const pararDeEscuchar = () => {
        window.speechSynthesis.cancel();
    };

    const escucharSiguienteCapitulo = () => {
        window.speechSynthesis.cancel();
        navigate(`/capitulos/${parseInt(id) + 1}`);
    };

    return (
        <div>
            <button onClick={() => navigate('/capitulos')}>Volver a Capítulos</button>
            <button onClick={marcarComoLeidoYEscuchar}>Escuchar</button>
            <button onClick={pararDeEscuchar}>Parar de Escuchar</button>
            <button onClick={escucharSiguienteCapitulo}>Escuchar Siguiente Capítulo</button>
            {capitulo && (
                <div>
                    <h2>Capítulo {capitulo.numero}</h2>
                    <p>{capitulo.contenido}</p>
                </div>
            )}
        </div>
    );
};

export default CapituloDetalle;
