import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import './index.css';

import Welcome from './pages/welcome';
import Signup,{SignupSuccess} from './pages/signup';
import NotFound from './pages/notFound';
import Admin from './pages/admin'
import DashBoard from './components/dashBoard'

function App()
{
    return (
        <BrowserRouter>
        <DashBoard/>
        <Routes>
            <Route
                exact path="/"
                element = {<Navigate to="/welcome"/>}
            />
            {/* Welcome page */}
            <Route path="/welcome" element={<Welcome />} />
            {/* Signup Page */}
            <Route path="/signup" element={<Signup />} />
            <Route path="/signup/success" element={<SignupSuccess/>} />
            {/* Admin page */}
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/signup" element={<Admin />} />

            <Route path="*" element={<NotFound/>}/>
        </Routes>
        </BrowserRouter>
    );
}


// ========================================
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App/>);