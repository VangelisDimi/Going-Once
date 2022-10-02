import { useContext,useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../auth';

//Signup page

function SignupSuccess(){
    const navigate = useNavigate();

    // Redirect to welcome page after some time
    useEffect(() => {
        setTimeout(() => {
            navigate('/',{replace:true});
        }, 5000)
    });

    return(
        <div>
            <div>User signup successfull.</div>
        </div>
    );
}

function SignupForm({setSuccess}){
    const {signup} = useContext(AuthContext);
    const [errors,setErrors] = useState({
        username:'',
        email:'',
        password:'',
        confirm_password:''
    });

    return(
        <form onSubmit={HandleSubmit} id="signup_form">
            <div>
                <label className='required'>
                    Username
                </label>
                <input className="form-control" placeholder="Username" type="text" name='username' required/>
                <div className="invalid-feedback">
                    {errors.username}
                </div>
            </div>
            <div>
                <label className='required'>
                    Password
                </label>
                <input className="form-control" placeholder="Password" type="password" name='password' required minLength="8"/>
                <div className="invalid-feedback">
                    {errors.password}
                </div>
            </div>
            <div>
                <label className='required'>
                    Confirm password
                </label>
                <input className="form-control" placeholder="Confirm password" type="password" name='confirm_password' required/>
                <div className="invalid-feedback">
                    {errors.confirm_password}
                </div>
            </div>
            <label className='required'>
                First name
            </label>
            <input className="form-control" placeholder="First name" type="text" name='first_name' required/>
            <label className='required'>
                Last name
            </label>
            <input className="form-control" placeholder="Last name" type="text" name='last_name' required/>
            <div>
                <label className='required'>
                    E-mail
                </label>
                <input className="form-control" placeholder="E-mail" type="email" name='email' aria-describedby="invalid-email" required/>
                <div className="invalid-feedback" id="invalid-email">
                    {errors.email}
                </div>
            </div>
            <label className='required'>
                Phone Number
            </label>
            <input className="form-control" placeholder="Phone Number" type="text" name='phone' required/>
            <label className='required'>
                Street name
            </label>
            <input className="form-control" placeholder="Street name" type="text" name='street_name' required/>
            <label className='required'>
                Street number
            </label>
            <input className="form-control" placeholder="Street number" type="text" name='street_number' required/>
            <label className='required'>
                Postal code
            </label>
            <input className="form-control" placeholder="Postal code" type="text" name='postal_code' required/>
            <label className='required'>
                Country
            </label>
            <input className="form-control" placeholder="Country" type="text" name='country' required/>
            <label className='required'>
                Location
            </label>
            <input className="form-control" placeholder="Location" type="text" name='location' required/>
            <label className='required'>
                TIN
            </label>
            <input className="form-control" placeholder="TIN" type="text" name='tin' required/>
            
            <div className="alert alert-danger hide" role="alert" id="alert">
                <i className="bi bi-exclamation-triangle-fill"></i> There was an unexpected error in the submission
            </div>
            <div>
                <button className="btn btn-primary" type="submit">Sign-Up</button>
            </div>
        </form>
    );

    function HandleSubmit(event){
        //Validate form and submit
        event.preventDefault();

        document.getElementById('alert').className = "alert alert-danger hide";
        event.target.username.className = "form-control"
        event.target.email.className = "form-control"
        event.target.password.className = "form-control"
        event.target.confirm_password.className = "form-control"
        
        //Passwords don't match
        if(event.target.password.value !== event.target.confirm_password.value){
            errors.confirm_password = "Password and confirm password don't match";
            setErrors({...errors});
            event.target.confirm_password.className = "form-control is-invalid";
            return;
        }
        //1 uppercase,1 lowercase and 1 number
        else if(!(/[A-Z]/.test(event.target.password.value) && /[a-z]/.test(event.target.password.value) 
        && /[0-9]/.test(event.target.password.value))){
            errors.password = "Password must contain at least one uppercase character,one lowercase character and one numeric character";
            setErrors({...errors});
            event.target.password.className = "form-control is-invalid";
            event.target.confirm_password.value = '';
            return;
        }
        

        signup(event)
        .then(res => {
            setSuccess(true);
        })
        .catch((error) => {
            if (error.response && error.response.status!==0) {
                // Serverside form validation
                if(error.response.data.username){
                    errors.username = error.response.data.username;
                    setErrors({...errors});
                    event.target.username.className = "form-control is-invalid";
                }
                if(error.response.data.email){
                    errors.email = error.response.data.email;
                    setErrors({...errors});
                    event.target.email.className = "form-control is-invalid"
                }
                if(error.response.data.password){
                    errors.password = error.response.data.password;
                    setErrors({...errors});
                    event.target.password.className = "form-control is-invalid";
                    event.target.confirm_password.value = '';
                }
            }
            else{
                document.getElementById('alert').className = "alert alert-danger fade show";
            }
        });
    };
}

function Signup(){
    const [success,setSuccess] = useState(false);

    if(success) return <SignupSuccess/>

    return(
        <div>
            <h3>Register</h3>
            <SignupForm setSuccess={setSuccess}/>
        </div>
    );
}

export default Signup