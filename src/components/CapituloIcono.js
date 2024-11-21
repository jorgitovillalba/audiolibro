import React, { useState } from 'react';
import CapituloModal from '../components/CapituloModal'; // Ajusta la ruta según la ubicación real de CapituloModal.js
import '../css/CapituloIcono.css'; // Asegúrate de que esta ruta sea correcta

const CapituloIcono = ({ onCapituloSeleccionado }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleModal = () => setIsOpen(!isOpen);

    return (
        <div>
            <div className="floating-icon" onClick={toggleModal}>
                <span className="icon">≡</span> {/* Puedes reemplazar con un ícono de Font Awesome */}
                <span className="text">Episodios</span>
            </div>

            {isOpen && (
                <CapituloModal 
                    onClose={toggleModal} 
                    onCapituloSeleccionado={onCapituloSeleccionado} // Pasa la función como prop
                />
            )}
        </div>
    );
};

export default CapituloIcono;