import React, { useEffect, useState } from 'react';

const Configuraciones = ({ onConfigChange }) => {
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(null);
    const [speed, setSpeed] = useState(1);

    // Carga las voces disponibles al iniciar
    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            // Filtra solo las voces en español
            const spanishVoices = availableVoices.filter(voice => voice.lang.startsWith('es'));
            setVoices(spanishVoices);

            // Selecciona la primera voz en español por defecto
            if (spanishVoices.length > 0) {
                setSelectedVoice(spanishVoices[0].name);
            }
        };

        // Para asegurar la carga de voces en algunos navegadores
        window.speechSynthesis.onvoiceschanged = loadVoices;
        loadVoices();
    }, []);

    const handleVoiceChange = (e) => {
        setSelectedVoice(e.target.value);
        onConfigChange({ voice: e.target.value, speed });
    };

    const handleSpeedChange = (e) => {
        setSpeed(e.target.value);
        onConfigChange({ voice: selectedVoice, speed: e.target.value });
    };

    return (
        <div>
            <h2>Configuraciones de Lectura</h2>
            <div>
                <label>Voz (Español):</label>
                <select value={selectedVoice} onChange={handleVoiceChange}>
                    {voices.map((voice) => (
                        <option key={voice.name} value={voice.name}>
                            {voice.name} ({voice.lang})
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label>Velocidad:</label>
                <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={speed}
                    onChange={handleSpeedChange}
                />
                <span>{speed}</span>
            </div>
        </div>
    );
};

export default Configuraciones;
