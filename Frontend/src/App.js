import SideBar from './components/SideBar/SideBar';
import './App.css';
import './assets/main.css'
import { BrowserRouter, Route } from 'react-router-dom';
import AppRoutes from './components/AppRoutes';

export default function App() {
    return (
        <BrowserRouter>
            <SideBar/>
            <div>
                <AppRoutes />
            </div>
        </BrowserRouter>
    );
}

