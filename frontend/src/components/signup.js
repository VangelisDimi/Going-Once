import React from 'react';
import TopBar from './topBar';

class SignupForm extends React.Component{
    render(){
        return(
            <form>
                <label>
                    <p>Username</p>
                    <input type="text" />
                </label>
                <label>
                    <p>Password</p>
                    <input type="password" />
                </label>
                <label>
                    <p>Confirm Password</p>
                    <input type="password" />
                </label>
                <label>
                    <p>Name</p>
                    <input type="text" />
                </label>
                <label>
                    <p>Surname</p>
                    <input type="text" />
                </label>
                <label>
                    <p>E-mail</p>
                    <input type="text" />
                </label>
                <label>
                    <p>Phone Number</p>
                    <input type="number" />
                </label>
                <label>
                    <p>Street</p>
                    <input type="text" />
                </label>
                <label>
                    <p>Number</p>
                    <input type="number" />
                </label>
                <label>
                    <p>Postal Code</p>
                    <input type="text" />
                </label>
                <label>
                    <p>Country</p>
                    <input type="text" />
                </label>
                <label>
                    <p>Location</p>
                    <input type="text" />
                </label>
                <label>
                    <p>TIN</p>
                    <input type="number" />
                </label>
                <div>
                    <button type="submit">Sign-Up</button>
                </div>
            </form>
        );
    }
}

class Signup extends React.Component{
    render() {
        return(
            <div>
                <TopBar/>
                <SignupForm/>
            </div>
        );
    }
}

export default Signup;