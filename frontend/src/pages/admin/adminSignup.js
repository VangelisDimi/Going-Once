import { useContext,useEffect,useState  } from 'react';
import { useNavigate } from 'react-router-dom';
import {BackButton} from '../../components/forms';
import AuthContext from '../../auth';

function SignupSuccess(){
    const navigate = useNavigate();

    // Redirect to welcome page after some time
    useEffect(() => {
        setTimeout(() => {
            navigate('/admin');
        }, 5000)
    });

    return(
        <div>
            <div>Admin User signup successfull.</div>
        </div>
    );
}

function SignupForm({setSuccess}){
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
        setSuccess(true);
    };
}

function AdminSignup() {
    const [success,setSuccess] = useState(false);

    if(success) return <SignupSuccess/>

    return(
        <div>
            <BackButton/>
            <SignupForm setSuccess={setSuccess}/>
        </div>
    );
}

export default AdminSignup;