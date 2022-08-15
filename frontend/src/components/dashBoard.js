import React from 'react';
import {Link} from 'react-router-dom';
import axios from '../axios_config'

class SignupButton extends React.Component{
    render(){
        return(
            <div>
                <Link to="/signup">
                    <button>Signup</button>
                </Link>
            </div>
        );
    }
}

class LoginField extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
        };
        this.onChange = this.onChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}> 
                <label>
                    Username
                    <input placeholder="Username" type="text" id="username" onChange={this.onChange} required/>
                    <br></br>
                </label>
                <label>
                    Password
                    <input placeholder="Password" type="password" id="password" onChange={this.onChange} required/>
                    <br></br>
                </label>
                <div>
                    <button type="submit">Log-In</button>
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
    }

    handleSubmit(event){
        event.preventDefault();
        
        const data = new FormData();
        data.append("username",this.state.username)
        data.append("password",this.state.password)

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
    }
}

class DashBoard extends React.Component{
    render(page) {
        if(this.props.page==="welcome") {
            return(
                <div>
                    <Link to="/welcome">
                        <button>Logo</button>
                    </Link>
                    <div>
                        <LoginField/>
                    </div>
                    <div>
                        <SignupButton/>
                    </div>
                </div>
            );
        }
        else if(this.props.page==="signup") {
            return(
                <div>
                    <Link to="/welcome">
                        <button>Logo</button>
                    </Link>
                    <div>
                        <LoginField/>
                    </div>
                </div>
            );
        }
    }
}

export default DashBoard;