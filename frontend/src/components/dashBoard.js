import {useContext} from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import AuthContext from '../auth';

function SignupButton(){
    const navigate = useNavigate();
    return(
        <button onClick={() => navigate("/signup")}>Signup</button>
    );
}

function HomeButton()
{
    const navigate = useNavigate();
    return(
        <button onClick={() => navigate("/welcome")}>Logo</button>
    );
}

function LoginField(){
    const {login} = useContext(AuthContext);

    return (
        <form onSubmit={handleSubmit}> 
            <label>
                Username
                <input placeholder="Username" type="text" name="username" required/>
                <br></br>
            </label>
            <label>
                Password
                <input placeholder="Password" type="password" name="password" required/>
                <br></br>
            </label>
            <div>
                <button type="submit">Log-In</button>
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
        <button onClick={logout}>
            Logout
        </button>
    );
}

function DashBoard(){
    const {authTokens} = useContext(AuthContext);

    const location = useLocation().pathname;
    if(authTokens)//Logged In
    {
        return(
            <LogoutButton/>
        )
    }
    else //Logged Out
    {
        if(location==="/signup") {
            return(
                <div>
                    <HomeButton/>
                    <LoginField/>
                </div>
            );
        }
        else if(location.startsWith("/admin"))
        {
            return null;
        }
        else {
            return(
                <div>
                    <HomeButton/>
                    <LoginField/>
                    <SignupButton/>
                </div>
            );
        }
    }
}

export default DashBoard;