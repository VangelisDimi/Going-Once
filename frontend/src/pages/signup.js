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
            <label>
                Phone Number
                <input placeholder="Phone Number" type="text" name='phone' required/>
                <br></br>
            </label>
            <label>
                Street name
                <input placeholder="Street name" type="text" name='street_name' required/>
                <br></br>
            </label>
            <label>
                Street number
                <input placeholder="Street number" type="text" name='street_number' required/>
                <br></br>
            </label>
            <label>
                Postal code
                <input placeholder="Postal code" type="text" name='postal_code' required/>
                <br></br>
            </label>
            <label>
                Country
                <input placeholder="Country" type="text" name='country' required/>
                <br></br>
            </label>
            <label>
                Location
                <input placeholder="Location" type="text" name='location' required/>
                <br></br>
            </label>
            <label>
                TIN
                <input placeholder="TIN" type="text" name='tin' required/>
                <br></br>
            </label>
            <div>
                <button type="submit">Sign-Up</button>
            </div>
        </form>
    );

    function HandleSubmit(event){
        event.preventDefault();
        signup(event);
        setSuccess(true);
    };
}

function Signup(){
    const [success,setSuccess] = useState(false);

    if(success) return <SignupSuccess/>

    return(
        <div>
            <SignupForm setSuccess={setSuccess}/>
        </div>
    );
}

export default Signup