import SideBar from './components/SideBar/SideBar';
import './App.css';
import './assets/main.css'
import { BrowserRouter, Route } from 'react-router-dom';
import AppRoutes from './components/AppRoutes';
import AppBar from './components/AppBar/AppBar';

export default function App() {
    return (
        <BrowserRouter>
            <SideBar/>
            <AppBar />
            <div>
                <AppRoutes />
            </div>
        </BrowserRouter>
    );
}

