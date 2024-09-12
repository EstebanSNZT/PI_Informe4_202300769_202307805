import React from 'react';


function Comentario({ comentario, onEliminar }) {
    return (
        <div className="comentario">
            <p>{comentario.texto}</p>
            <button onClick={() => onEliminar(comentario.id)}>Eliminar</button>
        </div>
    );
}

export default Comentario;
