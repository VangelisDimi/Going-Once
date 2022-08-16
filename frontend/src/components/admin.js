import { useState } from 'react';
import axios from '../axios_config'
import { useNavigate } from 'react-router-dom';

function SignupButton(){
    const navigate = useNavigate();
    return(
        <button onClick={() => navigate("/admin/signup")}>Signup</button>
    );
}

function LoginField(){
    const [values,setValues] = useState({
        login_username: '',
        login_password: '',
    });

    return (
        <form onSubmit={handleSubmit}> 
            <label>
                Username
                <input placeholder="Username" type="text" id="login_username" onChange={onChange} required/>
                <br></br>
            </label>
            <label>
                Password
                <input placeholder="Password" type="password" id="login_password" onChange={onChange} required/>
                <br></br>
            </label>
            <div>
                <button type="submit">Log-In</button>
            </div>
        </form>
    );

    function onChange(event) {
        setValues({...values, [event.target.id]: event.target.value})
    };

    function handleSubmit(event){
        event.preventDefault();
        
        const data = new FormData();
        data.append("username",values.username)
        data.append("password",values.password)

        axios.post(`users/token/`,data
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