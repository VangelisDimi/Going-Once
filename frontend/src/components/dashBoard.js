import React from 'react';
import {Link} from 'react-router-dom';

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
    render() {
        return (
            <form>
                <label>
                    <p>Username</p>
                    <input type="text" />
                </label>
                <label>
                    <p>Password</p>
                    <input type="password" />
                </label>
                <div>
                    <button type="submit">Log-In</button>
                </div>
            </form>
        );
    }
}

class DashBoard extends React.Component{
    render() {
        return(
            <div>
                <div>
                    <LoginField/>
                </div>
                <div>
                    <SignupButton/>
                </div>
            </div>
        );
    }
}

export default DashBoard;