import React from 'react';

const AudioPlayer = ({ audioUrl }) => {
    return (
        <audio controls>
            <source src={audioUrl} type="audio/mpeg" />
            Tu navegador no soporta el elemento de audio.
        </audio>
    );
};

export default AudioPlayer;
