import {useEffect,createContext,useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {axios} from './axios_config'

const AuthContext = createContext();

const AuthInfo = ({children}) => {
    const navigate = useNavigate();
    const [token, setToken] = useState(() => localStorage.getItem('token') ? localStorage.getItem('token') : null);
    const [authorized,SetAuthorized] = useState(token ? true : false);

    const contextData = {
        authorized: authorized,
        token: token,
        setToken: setToken,
        login: login,
        signup: signup,
        adminLogin: adminLogin,
        adminSignup: adminSignup,
        logout: logout
    };

    // useEffect(() => {
    // });

    return(
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );

    function adminLogin(event){
        login(event,true);
    };

    function login(event,admin=false) {
        let url = '/users/login/';
        if(admin) url = '/users/admin/login/'
        axios.post(url,{},{ 
            auth:{
                "username": event.target.username.value,
                "password": event.target.password.value,
            }
        })
        .then(res => {
            setToken(res.data.token);
            localStorage.setItem('token', res.data.token);
            SetAuthorized(true);
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

    function adminSignup(event) {
        signup(event,true);
    }

    function signup(event,admin=false) {
        let url='/users/register/';
        if (admin) url='/users/admin/register/';

        const data = new FormData();
        data.append("username",event.target.username.value)
        data.append("password",event.target.password.value)
        data.append("first_name",event.target.first_name.value)
        data.append("last_name",event.target.last_name.value)
        data.append("email",event.target.email.value)
        if(!admin){
            data.append("phone_number",event.target.phone.value)
            data.append("street_name",event.target.street_name.value)
            data.append("street_number",event.target.street_number.value)
            data.append("postal_code",event.target.postal_code.value)
            data.append("country",event.target.country.value)
            data.append("location",event.target.location.value)
            data.append("tin",event.target.tin.value)
        }

        axios.post(url,data
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

    function logout() {
        axios.post('/users/logout/',{},{
            headers:{
                "Authorization": `Token ${token}`,
            }
        })
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

        setToken(null);
        SetAuthorized(false);
        localStorage.removeItem('token');
    };
}

export default AuthContext;
export {AuthInfo};