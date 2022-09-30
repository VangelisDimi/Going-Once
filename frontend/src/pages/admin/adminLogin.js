import {useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../auth';

function SignupButton(){
    const navigate = useNavigate();
    return(
        <button className='btn btn-secondary' type="button" onClick={() => navigate("/admin/signup")}>Signup</button>
    );
}

function LoginField(){
    const {adminLogin} = useContext(AuthContext);

    return (
        <form onSubmit={handleSubmit}> 
            <label>
                Username
            </label>
            <input className='form-control' placeholder="Username" type="text" name="username" required/>
            <label>
                Password
            </label>
            <input className='form-control' placeholder="Password" type="password" name="password" required/>

            <button className='btn btn-primary' type="submit">Log-In</button>
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