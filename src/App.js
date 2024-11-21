import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Configuraciones from './pages/Configuraciones';
import Chapters from './pages/Chapters';
import CapituloDetalle from './pages/CapituloDetalle';
import Login from './pages/Login';
import CapituloIcono from './components/CapituloIcono';
import './css/CapituloIcono.css';
import './css/CapituloModal.css';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [capituloSeleccionado, setCapituloSeleccionado] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsAuthenticated(!!token);
    }, []);

    const handleLogin = (token) => {
        localStorage.setItem('token', token);
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
    };

    const handleCapituloSeleccionado = (capitulo) => {
        console.log("Capítulo seleccionado en App.js:", capitulo);
        setCapituloSeleccionado(capitulo);
        leerEnVozAlta(capitulo.contenido); // Llama a la función para leer en voz alta
    };

    // Función para leer texto en voz alta
    const leerEnVozAlta = (texto) => {
        if (!texto) {
            console.error("No hay contenido para leer en voz alta");
            return;
        }

        const speech = new SpeechSynthesisUtterance(texto);
        speech.lang = 'es-ES'; // Idioma español
        speech.rate = 1; // Velocidad normal
        speech.pitch = 1; // Tono normal

        // Cancela cualquier lectura en progreso antes de iniciar una nueva
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(speech);

        console.log("Leyendo en voz alta el texto:", texto);
    };

    return (
        <Router>
            <div className="App">
                {isAuthenticated && (
                    <>
                        <nav>
                            <Link to="/">Capítulos</Link> | 
                            <Link to="/configuraciones">Configuración</Link> | 
                            <button onClick={handleLogout}>Cerrar Sesión</button>
                        </nav>
                        <CapituloIcono onCapituloSeleccionado={handleCapituloSeleccionado} />
                    </>
                )}
                
                {/* Muestra el contenido del capítulo seleccionado */}
                {capituloSeleccionado && (
                    <div>
                        <h2>Capítulo {capituloSeleccionado.numero}</h2>
                        <p>{capituloSeleccionado.contenido}</p>
                    </div>
                )}
                
                <Routes>
                    <Route path="/login" element={<Login onLogin={handleLogin} />} />
                    <Route
                        path="/"
                        element={isAuthenticated ? <Chapters /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/capitulos/:id"
                        element={isAuthenticated ? <CapituloDetalle /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/configuraciones"
                        element={isAuthenticated ? <Configuraciones /> : <Navigate to="/login" />}
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
