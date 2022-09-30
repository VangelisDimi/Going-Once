import { useContext,useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../auth';

function SignupSuccess(){
    const navigate = useNavigate();

    // Redirect to welcome page after some time
    useEffect(() => {
        setTimeout(() => {
            navigate('/');
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

    return(
        <form onSubmit={HandleSubmit}>
            <label className='required'>
                Username
            </label>
            <input className="form-control" placeholder="Username" type="text" name='username' required/>
            <div className="invalid-feedback" id="invalid-username">
                Wrong username
            </div>
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

            <div>
                <button className="btn btn-primary" type="submit">Sign-Up</button>
            </div>
        </form>
    );

    function HandleSubmit(event){
        event.preventDefault();
        signup(event)
        .then(res => {
            setSuccess(true);
        })
        .catch((error) => {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                if(error.response.data.username){
                    event.target.username.className = "form-control is-invalid"
                }
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
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