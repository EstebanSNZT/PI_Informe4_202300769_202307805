import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../Login';
import ViewUsers from '../ViewUsers';
import ViewPosts from '../ViewPosts';
import Home from '../Home';
import Register from '../Register';
import CreatePost from '../CreatePosts';
import EditProfile from '../EditProfile';
import BulkUpload from '../BulkUpload';
import Reports from '../Reports';

function Router() {
    return(
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Navigate to="/login"/>}/>
                <Route path='/login' element={<Login/>}/>
                <Route path='/inicio' element={<Home/>}/>
                <Route path='/crear_posts' element={<CreatePost/>}/>
                <Route path='/register' element={<Register/>}/>
                <Route path='/editar_perfil' element={<EditProfile/>}/>
                <Route path='/administrador/visualizar_usuarios' element={<ViewUsers/>}/>
                <Route path='/administrador/visualizar_posts' element={<ViewPosts/>}/>
                <Route path='/administrador/carga_masiva' element={<BulkUpload/>}/>
                <Route path='/administrador/reportes' element={<Reports/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default Router;