import {useContext,useState} from 'react';
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
    const [errors,setErrors] = useState({
        username:'Wrong username or password.',
        password:'Wrong username or password.'
    });

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>
                    Username
                </label>
                <input className='form-control' placeholder="Username" type="text" name="username" required/>
                <div className="invalid-feedback">
                    {errors.username}
                </div>
            </div>
            <div>
                <label>
                    Password
                </label>
                <input className='form-control' placeholder="Password" type="password" name="password" required/>
                <div className="invalid-feedback">
                    {errors.username}
                </div>
            </div>
            
            <div className="alert alert-danger hide" role="alert" id="alert">
                <i className="bi bi-exclamation-triangle-fill"></i> There was an unexpected error in the submission
            </div>
            <button className='btn btn-primary' type="submit">Log-In</button>
        </form>
    );

    function handleSubmit(event){
        event.preventDefault();
        document.getElementById('alert').className = "alert alert-danger hide";
        event.target.username.className = "form-control"
        event.target.password.className = "form-control"

        adminLogin(event)
        .catch((error) => {
            if (error.response && error.response.status===401) {
                event.target.username.className = "form-control is-invalid";
                event.target.password.className = "form-control is-invalid";
            }
            else{
                document.getElementById('alert').className = "alert alert-danger fade show";
            }
        })
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