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
            <label className='required'>
                Username
            </label>
            <input className="form-control" placeholder="Username" type="text" name='username' required/>
            <label className='required'>
                Password
            </label>
            <input className="form-control" placeholder="Password" type="password" name='password' required minLength="8"/>
            <label className='required'>
                Confirm password
            </label>
            <input className="form-control" placeholder="Confirm password" type="password" name='confirm_password' required minLength="8"/>            
            <label className='required'>
                First name
            </label>
            <input className="form-control" placeholder="First name" type="text" name='first_name' required/>
            <label className='required'>
                Last name
            </label>
            <input className="form-control" placeholder="Last name" type="text" name='last_name' required/>
            <label className='required'>
                E-mail
            </label>
            <input className="form-control" placeholder="E-mail" type="email" name='email' required/>

            <div>
                <button className="btn btn-primary" type="submit">Sign-Up</button>
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
            <h3>Register</h3>
            <SignupForm setSuccess={setSuccess}/>
        </div>
    );
}

export default AdminSignup;