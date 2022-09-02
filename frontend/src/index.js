import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import './index.css';

import {AuthInfo} from './auth';
import {SharedComponent,PublicRoute} from './customRoutes'

import Welcome from './pages/welcome';
import Signup,{SignupSuccess} from './pages/signup';
import DashBoard from './components/dashBoard';

import AdminLogin from './pages/admin/adminLogin';
import AdminMain from './pages/admin/adminMain';
import AdminSignup from './pages/admin/adminSignup';
import AuctionManage from './pages/auctionManage';

import NotFound from './pages/notFound';

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
                        element = {<SharedComponent private_page={null} public_page={<Welcome/>}/>}
                    />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/signup/success" element={<SignupSuccess/>} />
                    <Route path="/manage" element={<AuctionManage/>} />

                    {/* Admin Page */}
                    <Route path="/admin" element={<SharedComponent private_page={<AdminMain/>} public_page={<AdminLogin/>}/>} />
                    <Route path="/admin/signup" element={<PublicRoute children={<AdminSignup/>} redirect='/admin'/>} />

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