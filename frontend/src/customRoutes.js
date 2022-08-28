import { Navigate } from 'react-router-dom'
import { useContext } from 'react'
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

export {SharedComponent,PublicRoute};