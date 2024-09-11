import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../Login';
import Home from '../Home';
import Register from '../Register';
import RecuperarContra from '../recuperarcontra';

function Router() {
    return(
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Navigate to="/login"/>}/>
                <Route path='/login' element={<Login/>}/>
                <Route path='/inicio' element={<Home/>}/>
                <Route path='/registro' element={<Register/>}/>
                <Route path="/contraseña_olvidada" element={<RecuperarContra/>} />
            </Routes>
        </BrowserRouter>
    );
}

export default Router;