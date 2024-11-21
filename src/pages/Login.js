import React, { useState } from 'react';
import api from '../api';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await api.post('/usuarios/iniciar-sesion', { usuario: username, contrasena: password });
            const token = response.data.token;
    
            if (token) {
                localStorage.setItem('token', token);
                onLogin(token); // Llama a la función de autenticación en App.js
            }
        } catch (error) {
            setError('Usuario o contraseña incorrectos');
            console.error('Error de inicio de sesión:', error);
        }
    };
    

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Usuario"
                required
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                required
            />
            <button type="submit">Iniciar Sesión</button>
            {error && <p>{error}</p>}
        </form>
    );
};

export default Login;
