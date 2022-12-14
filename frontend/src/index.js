import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes,Outlet} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css';
import './style.css'

import {AuthInfo} from './auth';
import {RequestInfo} from './requests';
import {SharedComponent,PublicRoute,AdminRoute,UserRoute,ApprovedRoute} from './customRoutes'

import Welcome from './pages/welcome';
import Signup from './pages/signup';
import DashBoard from './components/dashBoard';
import Main from './pages/main';
import AuctionManage from './pages/auctionManage';
import CreateAuction from './pages/auctionCreate'
import Auction from './pages/auction';
import AuctionNavigate from './pages/auctionNavigate';
import CategoryNavigate from './pages/categoryList';

import AdminLogin from './pages/admin/adminLogin';
import AdminMain from './pages/admin/adminMain';
import AdminSignup from './pages/admin/adminSignup';
import UserManage from './pages/admin/manageUsers'

import {NotFound,NoPermission} from './pages/errors';

function App()
{
    return (
        <BrowserRouter>
            <AuthInfo><RequestInfo>
                <Routes>
                    {/* User Page */}
                    <Route
                        path="/" element={<> <DashBoard/> <Outlet/> </>}
                    >
                        <Route
                            exact path="/"
                            element = {<SharedComponent private_page={<ApprovedRoute><Main/></ApprovedRoute>} public_page={<Welcome/>}/>}
                        />
                        <Route path="/signup" element={<PublicRoute children={<Signup />}/>} />
                        <Route path="/manage" element={<UserRoute children={<Outlet/>}/>}>
                            <Route exact path="/manage" element={<AuctionManage/>} />
                            <Route path="/manage/create" element={<CreateAuction/>} />
                        </Route>
                        <Route path="/auction/:id" element={<Outlet/>}>
                            <Route exact path="/auction/:id" element={<Auction/>}/>
                            <Route path="/auction/:id/edit" element=
                                {<SharedComponent
                                    private_page={<Auction/>}
                                    public_page={<NoPermission/>}
                                />}
                            />
                        </Route>
                        <Route path="/navigate" element={<CategoryNavigate/>}/>
                        <Route path="/navigate/all" element={<AuctionNavigate/>}/>
                        <Route path="/navigate/categories/:parent_category" element={<AuctionNavigate/>}/>
                        <Route path="*" element={<NotFound/>}/>
                    </Route>

                    {/* Admin Page */}
                    <Route path="/admin" element={<> <DashBoard/> <Outlet/> </>}>
                        <Route exact path="/admin" element=
                            {<SharedComponent 
                                private_page={<AdminRoute children={<AdminMain/>} />} 
                                public_page={<AdminLogin/>}
                            />} 
                        />
                        <Route path='/admin/usermanage' element={<AdminRoute children={<UserManage/>}/>} />
                        <Route path="/admin/signup" element={<PublicRoute children={<AdminSignup/>} redirect='/admin'/>} />
                        <Route path="*" element={<NotFound/>}/>
                    </Route>
                </Routes>
            </RequestInfo></AuthInfo>
        </BrowserRouter>
    );
}


// ========================================
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App/>);