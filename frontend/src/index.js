import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes} from 'react-router-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import {AuthInfo} from './auth';
import {SharedComponent,PublicRoute,AdminRoute} from './customRoutes'

import Welcome from './pages/welcome';
import Signup from './pages/signup';
import DashBoard from './components/dashBoard';
import Main from './pages/main';
import AuctionManage from './pages/auctionManage';
import CreateAuctionForm from './pages/auctionCreate'

import AdminLogin from './pages/admin/adminLogin';
import AdminMain from './pages/admin/adminMain';
import AdminSignup from './pages/admin/adminSignup';

import {NotFound} from './pages/errors';

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
                        element = {<SharedComponent private_page={<Main/>} public_page={<Welcome/>}/>}
                    />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/manage" element={<AuctionManage/>} />
                    <Route path="/manage/create" element={<CreateAuctionForm/>} />

                    {/* Admin Page */}
                    <Route path="/admin" element=
                        {<SharedComponent 
                            private_page={<AdminRoute children={<AdminMain/>} />} 
                            public_page={<AdminLogin/>}
                        />} 
                    />
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