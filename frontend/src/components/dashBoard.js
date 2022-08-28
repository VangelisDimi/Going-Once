import {useContext} from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import AuthContext from '../auth';
import AxiosPrivate from '../axios_config';

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
        <button onClick={() => navigate("/")}>Logo</button>
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

function RequestButton(){
    const axios = AxiosPrivate();

    return (
        <button onClick={request}>
            Request
        </button>
    )
    
    function request(){
        axios.get('/users/get/')
        .then(res => {
            console.log(res);
        })
        .catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
            console.log(error.config);
        });
    }

}

function DashBoard(){
    const {authorized} = useContext(AuthContext);

    const location = useLocation().pathname;
    if(authorized)//Logged In
    {
        return(
            <div>
                <LogoutButton/>
                <RequestButton/>
            </div>
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