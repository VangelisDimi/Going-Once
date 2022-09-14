import {useContext} from 'react';
import { useNavigate,useLocation,NavLink } from 'react-router-dom';
import AuthContext from '../auth';

function SignupButton(){
    const navigate = useNavigate();
    return(
        <button className="btn btn-outline-secondary" type="button" onClick={() => navigate("/signup")}>Signup</button>
    );
}

function LoginField(){
    const {login} = useContext(AuthContext);

    return (
        <form className='form-inline' onSubmit={handleSubmit}>
                <div className="form-group">
                <label htmlFor="login-username"> Username </label>
                <input className="form-control form-control-sm" placeholder="Username" type="text" name="username" id="login-username" required/>
                </div>
                <div className="form-group">
                <label htmlFor="login-password"> Password </label>
                <input  className="form-control form-control-sm" placeholder="Password" type="password" name="password" id="login-password" required/>
                </div>
                <div className="form-group">
                <button type="submit" className="btn btn-primary">Log-In</button>
                </div>
        </form>
    );

    function handleSubmit(event){
        event.preventDefault();
        login(event);
    };
}

function LogoutButton(){
    const {logout} = useContext(AuthContext);

    return (
        <button type="button" className="btn btn-outline-danger" onClick={logout}>
            Logout
        </button>
    );
}

function NavbarItems(){
    const location = useLocation().pathname;

    return(
        <ul className="navbar-nav">
            <li className="nav-item">
                <NavLink to='/navigate' className={"nav-link" + (location.startsWith("/navigate")? " active" : "")}>
                            Navigate
                </NavLink>
            </li>
            <li className="nav-item">
                <NavLink to='/manage' className={"nav-link" + (location.startsWith("/manage") ? " active" : "")}>
                        Manage
                </NavLink>
            </li>
        </ul>
    );
}

function NavBarLogo(){
    const location = useLocation().pathname;

    if(location.startsWith("/admin")){
        return( 
            <NavLink className="navbar-brand" to='/admin'>Admin</NavLink>
        );
    }

    return <NavLink className="navbar-brand" to='/'>Logo</NavLink>
}

function DashBoard(){
    const {authorized,userInfo} = useContext(AuthContext);
    const location = useLocation().pathname;

    if(!authorized && location.startsWith("/admin")) return null;

    return(
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <NavBarLogo/>
            {authorized && !location.startsWith("/admin") ?
                <NavbarItems/>
                : null
            }
            {!authorized ? <LoginField/> : null}
            {authorized ? <LogoutButton/> : null}
            {!authorized && !(location==="/signup") ? <SignupButton/> : null}
        </nav>
    );
}

export default DashBoard;