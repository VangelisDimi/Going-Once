import { Route, Navigate  } from 'react-router-dom'
import { useContext } from 'react'
import AuthContext from './auth'

const PrivateRoute = ({children, ...rest}) => {
    const {user} = useContext(AuthContext);
    
    return(
        <Route {...rest}>{!user ? children : <Navigate  to="/welcome" /> }</Route>
    )
}

export default PrivateRoute;