import { Navigate } from 'react-router-dom'
import { useContext } from 'react'
import {NoPermission} from './pages/errors'
import AuthContext from './auth'

const SharedComponent = ({private_page,public_page}) => {
    const {authorized} = useContext(AuthContext);
    
    return(
        authorized ? private_page : public_page
    )
}

const PublicRoute = ({children,redirect="/"}) => {
    const {authorized} = useContext(AuthContext);
    
    return(
        !authorized ? children : <Navigate  to={redirect} />
    )
}

const AdminRoute = ({children}) => {
    const {userInfo} = useContext(AuthContext);

    return(
        userInfo.is_staff ? children : <NoPermission/>
    )
}


const UserRoute= ({children}) => {
    const {userInfo} = useContext(AuthContext);

    return(
        !userInfo.is_staff ? children : <NoPermission/>
    )
}

export {SharedComponent,PublicRoute,AdminRoute,UserRoute};