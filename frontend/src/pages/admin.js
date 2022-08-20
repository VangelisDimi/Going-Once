import { useNavigate } from 'react-router-dom';
import {login} from '../auth';

function SignupButton(){
    const navigate = useNavigate();
    return(
        <button onClick={() => navigate("/admin/signup")}>Signup</button>
    );
}

function LoginField(){
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


function Admin(){
    return (
        <div>
            Admin page
            <LoginField/>
            <SignupButton/>
        </div>
    );
}

export default Admin;