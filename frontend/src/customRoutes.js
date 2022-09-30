import { Navigate } from 'react-router-dom'
import { useContext} from 'react'
import {NoPermission,NotApproved} from './pages/errors'
import AuthContext from './auth'

//Different components on same route based on authentication
const SharedComponent = ({private_page,public_page}) => {
    const {authorized} = useContext(AuthContext);
    
    return(
        authorized ? private_page : public_page
    );
}

//Route that can only be accesed if logged out
const PublicRoute = ({children,redirect="/"}) => {
    const {authorized} = useContext(AuthContext);
    
    return(
        !authorized ? children : <Navigate  to={redirect} />
    );
}

//Route than can only be accesed by admin
const AdminRoute = ({children}) => {
    const {authorized,userInfo} = useContext(AuthContext);

    return(
        authorized && userInfo.is_staff ? <ApprovedRoute children={children}/> : <NoPermission/>
    );
}

//Route that can only be accesed by user
const UserRoute= ({children}) => {
    const {authorized,userInfo} = useContext(AuthContext);

    return(
        authorized && !userInfo.is_staff ? <ApprovedRoute children={children}/> : <NoPermission/>
    );
}

const PrivateRoute = ({children}) => {
    
}

//Route that can only be accesed by logged in users
const ApprovedRoute = ({children})=> {
    const {authorized,userInfo} = useContext(AuthContext);

    if(!authorized) return children;
    
    return(
        authorized && userInfo.is_approved ? children : <NotApproved/>
    );
}

export {SharedComponent,PublicRoute,AdminRoute,UserRoute,ApprovedRoute};