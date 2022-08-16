import { useState, useEffect  } from 'react';
import DashBoard from './dashBoard';
import axios from '../axios_config';
import { useNavigate } from 'react-router-dom';

function SignupSuccess(){
    const navigate = useNavigate();

    // Redirect to welcome page after some time
    useEffect(() => {
        setTimeout(() => {
            navigate('/welcome');
        }, 5000)
    });

    return(
        <div>
            <DashBoard page="welcome"/>
            <div>User signup successfull.</div>
        </div>
    );
}

function SignupForm(){
    const [values,setValues] = useState({
        signup_username: '',
        signup_password: '',
        signup_confirm_password: '',
        first_name: '',
        last_name: '',
        e_mail: '',
        phone: '',
        street_name: '',
        street_number: '',
        postal_code: '',
        country: '',
        location: '',
        tin: '',
    });
    const navigate = useNavigate();

    return(
        <form onSubmit={HandleSubmit}>
            <label>
                Username
                <input placeholder="Username" type="text" id='signup_username' onChange={onChange} required/>
                <br></br>
            </label>
            <label>
                Password
                <input placeholder="Password" type="password" id='signup_password' onChange={onChange} required minLength="8"/>
                <br></br>
            </label>
            <label>
                Confirm password
                <input placeholder="Confirm password" type="password" id='signup_confirm_password' onChange={onChange} required minLength="8"/>
                <br></br>
            </label>
            <label>
                First name
                <input placeholder="First name" type="text" id='first_name' onChange={onChange} required/>
                <br></br>
            </label>
            <label>
                Last name
                <input placeholder="Last name" type="text" id='last_name' onChange={onChange} required/>
                <br></br>
            </label>
            <label>
                E-mail
                <input placeholder="E-mail" type="text" id='e_mail' onChange={onChange} required/>
                <br></br>
            </label>
            <label>
                Phone Number
                <input placeholder="Phone Number" type="text" id='phone' onChange={onChange} required/>
                <br></br>
            </label>
            <label>
                Street name
                <input placeholder="Street name" type="text" id='street_name' onChange={onChange} required/>
                <br></br>
            </label>
            <label>
                Street number
                <input placeholder="Street number" type="text" id='street_number' onChange={onChange} required/>
                <br></br>
            </label>
            <label>
                Postal code
                <input placeholder="Postal code" type="text" id='postal_code' onChange={onChange} required/>
                <br></br>
            </label>
            <label>
                Country
                <input placeholder="Country" type="text" id='country' onChange={onChange} required/>
                <br></br>
            </label>
            <label>
                Location
                <input placeholder="Location" type="text" id='location' onChange={onChange} required/>
                <br></br>
            </label>
            <label>
                TIN
                <input placeholder="TIN" type="text" id='tin' onChange={onChange} required/>
                <br></br>
            </label>
            <div>
                <button type="submit">Sign-Up</button>
            </div>
        </form>
    );

    function onChange(event) {
        setValues({...values, [event.target.id]: event.target.value})
    };

    function HandleSubmit(event){
        event.preventDefault();
        
        const data = new FormData();
        data.append("username",values.username)
        data.append("password",values.password)
        data.append("first_name",values.first_name)
        data.append("last_name",values.last_name)
        data.append("email",values.email)
        data.append("phone_number",values.phone_number)
        data.append("street_name",values.street_name)
        data.append("street_number",values.street_number)
        data.append("postal_code",values.postal_code)
        data.append("country",values.country)
        data.append("location",values.location)
        data.append("tin",values.tin)

        axios.post(`users/register/`,data
        )
        .then(res => {
            console.log(res);
        })
        .catch(function (error) {
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);
            } else if (error.request) {
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
              console.log(error.request);
            } else {
              // Something happened in setting up the request that triggered an Error
              console.log('Error', error.message);
            }
            console.log(error.config);
        });
        navigate('/signup/success');
    };
}

function Signup(){
    return(
        <div>
            <DashBoard page="signup"/>
            <SignupForm/>
        </div>
    );
}

export default Signup
export {SignupSuccess};