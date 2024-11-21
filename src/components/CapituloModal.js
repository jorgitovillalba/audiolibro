import React, { useEffect, useState } from 'react';
import api from '../api';
import '../css/CapituloModal.css';

const CapituloModal = ({ onClose, onCapituloSeleccionado }) => {
    const [capitulos, setCapitulos] = useState([]);
    const [paginaActual, setPaginaActual] = useState(0);
    const capitulosPorPagina = 30;
    const totalPaginas = 5;

    useEffect(() => {
        const cargarCapitulos = async () => {
            try {
                const offset = paginaActual * capitulosPorPagina;
                const response = await api.get(`/capitulos/paginados?limit=${capitulosPorPagina}&offset=${offset}`);
                console.log('Capítulos cargados:', response.data); // Verifica el contenido
                setCapitulos(response.data);
            } catch (error) {
                console.error('Error al obtener capítulos:', error);
            }
        };
        

        cargarCapitulos();
    }, [paginaActual]);

    const marcarComoLeidoYLeer = async (capitulo) => {
        try {
            console.log('Capítulo seleccionado para marcar como leído:', capitulo); // Verifica que tenga el contenido
            await api.put(`/capitulos/${capitulo.id}/marcarleido`);
            if (onCapituloSeleccionado) {
                onCapituloSeleccionado(capitulo); // Pasa el capítulo al padre
            }
            onClose(); // Cierra el modal
        } catch (error) {
            console.error('Error al marcar capítulo como leído:', error);
        }
    };
    

    const cambiarRango = (index) => {
        setPaginaActual(index);
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <button onClick={onClose} className="close-button">Cerrar</button>
                <h2>Capítulos</h2>
                
                <div className="pagination">
                    {Array.from({ length: totalPaginas }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => cambiarRango(i)}
                            className={`pagination-button ${paginaActual === i ? 'active' : ''}`}
                        >
                            {i * capitulosPorPagina + 1}-{(i + 1) * capitulosPorPagina}
                        </button>
                    ))}
                </div>
                
                <div className="chapters-grid">
                    {capitulos.map((capitulo) => (
                        <button
                            key={capitulo.id}
                            className={`chapter-button ${capitulo.estado === 'leído' ? 'leido' : ''}`}
                            onClick={() => marcarComoLeidoYLeer(capitulo)}
                        >
                            {capitulo.numero}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CapituloModal;
