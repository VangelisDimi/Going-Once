import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';
import './index.css';

import Welcome from './pages/welcome';
import Signup,{SignupSuccess} from './pages/signup';
import NotFound from './pages/notFound';
import Admin from './pages/admin';
import DashBoard from './components/dashBoard';
import {AuthInfo} from './auth';
import PrivateRoute  from './privateRoute';

function App()
{
    return (
        <BrowserRouter>
            <AuthInfo>
                <DashBoard/>
                <Routes>
                    {/* User Page */}
                    <Route
                        exact path="/"
                        element = {<Navigate to="/welcome"/>}
                    />
                    <Route path="/welcome" element={<Welcome />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/signup/success" element={<SignupSuccess/>} />
                    {/* Admin Page */}
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/admin/signup" element={<Admin />} />
                    {/* Various Pages */}
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </AuthInfo>
        </BrowserRouter>
    );
}


// ========================================
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App/>);