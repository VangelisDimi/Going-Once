import {useContext} from 'react';
import { useNavigate,useLocation,NavLink } from 'react-router-dom';
import AuthContext from '../auth';


function LoginDropDown(){
    
}

function SignupButton(){
    const location = useLocation().pathname;
    const navigate = useNavigate();

    if (location.startsWith("/admin")) return null;

    return(
        <button className="btn btn-outline-secondary" type="button" onClick={() => navigate("/signup")}>Signup</button>
    );
}

function LoginField(){
    const location = useLocation().pathname;
    const {login} = useContext(AuthContext);

    if (location.startsWith("/admin")) return null;

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
        <button type="button" className="dropdown-item" onClick={logout}>
            Logout
        </button>
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
                <li className="nav-item">
                    <NavLink to='/admin/usermanage' className={"nav-link" + (location.startsWith("/admin/usermanage")? " active" : "")}>
                            Manage Users
                    </NavLink>
                </li>
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
            {authorized && !userInfo.is_staff ?
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

    return <NavLink className="navbar-brand" to='/'>Logo</NavLink>
}

function UserDropDown(){
    const {userInfo} = useContext(AuthContext);

    return(
        <ul className="navbar-nav">
            <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" href="#" id="navbarDarkDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                {userInfo.username}
                    &thinsp;
                {userInfo.is_staff ? <span className="badge bg-secondary">Admin</span> : null}
            </a>
            <ul className="dropdown-menu" aria-labelledby="navbarDarkDropdownMenuLink">
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

    if(authorized && !userInfo.is_approved){ 
        return(
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <NavBarLogo/>
                <UserDropDown/>
            </nav>
        );
    }

    return(
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <NavBarLogo/>
            <NavbarItems/>
            {authorized ? <UserDropDown/> : null}
            {!authorized ? <LoginField/> : null}
            {!authorized && !(location==="/signup") ? <SignupButton/> : null}
        </nav>
    );
}

export default DashBoard;