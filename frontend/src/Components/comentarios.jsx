import React from 'react';

// Componente para un comentario
function Comentario({ comentario, onEliminar }) {
    return (
        <div className="comentario" style={{ padding: '0.5rem', borderBottom: '1px solid #ddd' }}>
            <p><strong>{comentario.usuario}</strong>: {comentario.texto}</p>
            <button onClick={() => onEliminar(comentario.id)} style={{ backgroundColor: 'transparent', border: 'none', color: 'red' }}>
                Eliminar Comentario
            </button>
        </div>
    );
}

export default Comentario;
