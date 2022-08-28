import { useContext  } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../auth';

function SignupForm(){
    const navigate = useNavigate();
    const {adminSignup} = useContext(AuthContext);

    return(
        <form onSubmit={HandleSubmit}>
            <label>
                Username
                <input placeholder="Username" type="text" name='username' required/>
                <br></br>
            </label>
            <label>
                Password
                <input placeholder="Password" type="password" name='password' required minLength="8"/>
                <br></br>
            </label>
            <label>
                Confirm password
                <input placeholder="Confirm password" type="password" name='confirm_password' required minLength="8"/>
                <br></br>
            </label>
            <label>
                First name
                <input placeholder="First name" type="text" name='first_name' required/>
                <br></br>
            </label>
            <label>
                Last name
                <input placeholder="Last name" type="text" name='last_name' required/>
                <br></br>
            </label>
            <label>
                E-mail
                <input placeholder="E-mail" type="text" name='email' required/>
                <br></br>
            </label>
            <div>
                <button type="submit">Sign-Up</button>
            </div>
        </form>
    );

    function HandleSubmit(event){
        event.preventDefault();
        adminSignup(event);
        // navigate('/signup/success');
    };
}

function AdminSignup() {
    return(
        <div>
            <SignupForm/>
        </div>
    );
}

export default AdminSignup;