import {useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../auth';

function SignupButton(){
    const navigate = useNavigate();
    return(
        <button type="button" onClick={() => navigate("/admin/signup")}>Signup</button>
    );
}

function LoginField(){
    const {adminLogin} = useContext(AuthContext);

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
        adminLogin(event);
    };
}


function AdminLogin(){
    return (
        <div>
            <LoginField/>
            <SignupButton/>
        </div>
    );
}

export default AdminLogin;