import React from 'react';
import DashBoard from './dashBoard';
import axios from '../axios_config'

class SignupForm extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            confirm_password: '',
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
        };
        this.onChange = this.onChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    render(){
        return(
            <form onSubmit={this.handleSubmit}>
                <label>
                    Username
                    <input placeholder="Username" type="text" id='username' onChange={this.onChange} required/>
                    <br></br>
                </label>
                <label>
                    Password
                    <input placeholder="Password" type="password" id='password' onChange={this.onChange} required/>
                    <br></br>
                </label>
                <label>
                    Confirm password
                    <input placeholder="Confirm password" type="password" id='confirm_password' onChange={this.onChange} required/>
                    <br></br>
                </label>
                <label>
                    First name
                    <input placeholder="First name" type="text" id='first_name' onChange={this.onChange} required/>
                    <br></br>
                </label>
                <label>
                    Last name
                    <input placeholder="Last name" type="text" id='last_name' onChange={this.onChange} required/>
                    <br></br>
                </label>
                <label>
                    E-mail
                    <input placeholder="E-mail" type="text" id='e_mail' onChange={this.onChange} required/>
                    <br></br>
                </label>
                <label>
                    Phone Number
                    <input placeholder="Phone Number" type="text" id='phone' onChange={this.onChange} required/>
                    <br></br>
                </label>
                <label>
                    Street name
                    <input placeholder="Street name" type="text" id='street_name' onChange={this.onChange} required/>
                    <br></br>
                </label>
                <label>
                    Street number
                    <input placeholder="Street number" type="text" id='street_number' onChange={this.onChange} required/>
                    <br></br>
                </label>
                <label>
                    Postal code
                    <input placeholder="Postal code" type="text" id='postal_code' onChange={this.onChange} required/>
                    <br></br>
                </label>
                <label>
                    Country
                    <input placeholder="Country" type="text" id='country' onChange={this.onChange} required/>
                    <br></br>
                </label>
                <label>
                    Location
                    <input placeholder="Location" type="text" id='location' onChange={this.onChange} required/>
                    <br></br>
                </label>
                <label>
                    TIN
                    <input placeholder="TIN" type="text" id='tin' onChange={this.onChange} required/>
                    <br></br>
                </label>
                <div>
                    <button type="submit">Sign-Up</button>
                </div>
            </form>
        );
    }


    onChange(event) {
        if (event.target.id === 'username') {
            this.setState({ username: event.target.value });
        } 
        else if (event.target.id === 'password') {
            this.setState({ password: event.target.value });
        } 
        else if (event.target.id === 'confirm_password') {
            this.setState({ confirm_password: event.target.value });
        } 
        else if (event.target.id === 'first_name') {
            this.setState({ first_name: event.target.value});
        }
        else if (event.target.id === 'last_name') {
            this.setState({ last_name: event.target.value});
        }
        else if (event.target.id === 'e_mail') {
            this.setState({ e_mail: event.target.value});
        }
        else if (event.target.id === 'phone') {
            this.setState({ phone: event.target.value});
        }
        else if (event.target.id === 'street_name') {
            this.setState({ street_name: event.target.value});
        }
        else if (event.target.id === 'street_number') {
            this.setState({ street_number: event.target.value});
        }
        else if (event.target.id === 'postal_code') {
            this.setState({ postal_code: event.target.value});
        }
        else if (event.target.id === 'country') {
            this.setState({ country: event.target.value});
        }
        else if (event.target.id === 'location') {
            this.setState({ location: event.target.value});
        }
        else if (event.target.id === 'tin') {
            this.setState({ tin: event.target.value});
        }
    }

    handleSubmit(event){
        event.preventDefault();
        
        const data = new FormData();
        data.append("username",this.state.username)
        data.append("password",this.state.password)
        data.append("first_name",this.state.first_name)
        data.append("last_name",this.state.last_name)
        data.append("email",this.state.email)
        data.append("phone_number",this.state.phone_number)
        data.append("street_name",this.state.street_name)
        data.append("street_number",this.state.street_number)
        data.append("postal_code",this.state.postal_code)
        data.append("country",this.state.country)
        data.append("location",this.state.location)
        data.append("tin",this.state.tin)

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
    }
}

class Signup extends React.Component{
    render() {
        return(
            <div>
                <DashBoard page="signup"/>
                <SignupForm/>
            </div>
        );
    }
}

export default Signup;