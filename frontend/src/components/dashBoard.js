import {useContext,useState} from 'react';
import { useNavigate,useLocation,NavLink } from 'react-router-dom';
import AuthContext from '../auth';
import {ErrorModal} from './errors';
import './dashBoard.css'
import Modal from  'bootstrap/js/dist/modal'

function LoginDropDown(){
    const location = useLocation().pathname;

    if (location.startsWith("/admin")) return null;

    return(
        <ul className="navbar-nav">
            <li className="nav-item dropdown">
            <button className="nav-link dropdown-toggle button" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                User
            </button>
            <ul className="dropdown-menu">
                <LoginField/>
                <li><hr className="dropdown-divider"/></li>
                <SignupButton/>
            </ul>
            </li>
        </ul>
    );
}

function SignupButton(){
    const location = useLocation().pathname;
    const navigate = useNavigate();

    if (location.startsWith("/admin")) return null;

    return(
        <button className="dropdown-item" type="button" onClick={() => navigate("/signup")}>Signup</button>
    );
}

function LoginField(){
    const {login} = useContext(AuthContext);
    const [errors,setErrors] = useState({
        username:'Wrong username or password.',
        password:'Wrong username or password.'
    });

    return (
        <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="login-username"> Username </label>
                    <input className="form-control form-control-sm" placeholder="Username" type="text" name="username" id="login-username" required/>
                    <div className="invalid-feedback">
                        {errors.username}
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="login-password"> Password </label>
                    <input  className="form-control form-control-sm" placeholder="Password" type="password" name="password" id="login-password" required/>
                    <div className="invalid-feedback">
                        {errors.password}
                    </div>
                </div>
                <div className="form-group">
                <button type="submit" className="btn btn-primary">Log-In</button>
                </div>
        </form>
    );

    function handleSubmit(event){
        event.preventDefault();
        event.target.username.className = "form-control"
        event.target.password.className = "form-control"


        login(event)
        .catch((error) => {
            if (error.response && error.response.status===401) {
                event.target.username.className = "form-control is-invalid";
                event.target.password.className = "form-control is-invalid";
            }
            else{
                const myModal = new Modal(document.getElementById('ErrorModal'));
                myModal.show();
            }
        })
    };
}

function LogoutButton(){
    const {logout} = useContext(AuthContext);

    function handleLogout(event){
        logout();
    }

    return (
        <>
            <button type="button" className="dropdown-item" onClick={handleLogout}>
                Logout
            </button>
        </>
    );
}

function NavbarItems(){
    const location = useLocation().pathname;
    const {authorized,userInfo} = useContext(AuthContext);

    //Admin Navbar
    if (location.startsWith("/admin")){
        if(!userInfo.is_staff) return null;

        return(
            <ul className="navbar-nav">
                {userInfo.is_approved ?
                    <li className="nav-item">
                        <NavLink to='/admin/usermanage' className={"nav-link" + (location.startsWith("/admin/usermanage")? " active" : "")}>
                                Manage Users
                        </NavLink>
                    </li>
                    :
                    null
                }
                <li className="nav-item">
                    <a className="nav-link" href='/'>
                        Main Page
                    </a>
                </li>
            </ul>
        );
    }

    //Normal navbar
    return(
        <ul className="navbar-nav">
            <li className="nav-item">
                <NavLink to='/navigate' className={"nav-link" + (location.startsWith("/navigate")? " active" : "")}>
                            Navigate
                </NavLink>
            </li>
            {authorized && !userInfo.is_staff && userInfo.is_approved ?
                <li className="nav-item">
                    <NavLink to='/manage' className={"nav-link" + (location.startsWith("/manage") ? " active" : "")}>
                            Manage
                    </NavLink>
                </li>
                :
                null
            }
            {authorized && userInfo.is_staff ?
                <li className="nav-item">
                    <a className="nav-link" href='/admin'>
                        Admin Page
                    </a>
                </li>
                :
                null
            }
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

    return <NavLink className="navbar-brand" to='/'>GoingOnce</NavLink>
}

function UserDropDown(){
    const {userInfo} = useContext(AuthContext);

    return(
        <ul className="navbar-nav">
            <li className="nav-item dropdown">
            <button className="nav-link dropdown-toggle button" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                {userInfo.username}
                    &thinsp;
                {userInfo.is_staff ? <span className="badge bg-secondary">Admin</span> : null}
            </button>
            <ul className="dropdown-menu">
                    <li><hr className="dropdown-divider"/></li>
                    <LogoutButton/>
            </ul>
            </li>
        </ul>
    )
}

function DashBoard(){
    const {authorized,userInfo} = useContext(AuthContext);
    const location = useLocation().pathname;

    if(location.startsWith("/admin") && authorized && !userInfo.is_staff) return null;

    return(
        <>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <NavBarLogo/>
            <NavbarItems/>
            {authorized ? <UserDropDown/> : <LoginDropDown/>}
        </nav>

        {authorized ? 
            <ErrorModal>There was an unexpected error while trying to log-out.</ErrorModal> 
            : 
            <ErrorModal>There was an unexpected error while trying to log-in.</ErrorModal>
        }
        </>
    );
}

export default DashBoard;