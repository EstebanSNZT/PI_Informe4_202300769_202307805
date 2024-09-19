import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../Login';
import Home from '../Home';
import OtherHome from '../OtherHome';
import Register from '../Register';
import RecuperarContra from '../recuperarcontra';
import CrearPost from '../crearpost';
import PerfilPersonal from '../perfil';

function Router() {
    return(
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Navigate to="/login"/>}/>
                <Route path='/login' element={<Login/>}/>
                <Route path='/inicio' element={<OtherHome/>}/>
                <Route path='/registro' element={<Register/>}/>
                <Route path="/contraseña_olvidada" element={<RecuperarContra/>} />
                <Route path="/crearpost" element={<CrearPost/>} /> 
                <Route path="/Perfil" element={<PerfilPersonal/>} /> 
            </Routes>
        </BrowserRouter>
    );
}

export default Router;