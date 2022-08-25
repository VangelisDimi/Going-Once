import {createContext,useState} from 'react';
import { useNavigate } from 'react-router-dom';
import {axios} from './axios_config'

const AuthContext = createContext();

const AuthInfo = ({children}) => {
    const navigate = useNavigate();
    const [refresh, setRefresh] = useState(() => localStorage.getItem('refresh') ? localStorage.getItem('refresh') : null);
    const [access, setAccess] = useState(null);
    const [authorized,SetAuthorized] = useState(refresh ? true : false);

    const contextData = {
        authorized: authorized,
        refresh:refresh,
        setRefresh:setRefresh,
        access: access,
        setAccess: setAccess,
        login: login,
        signup: signup,
        logout: logout
    };

    // useEffect(() => {
    // });

    return(
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    );

    function login(event) {
        const data = new FormData();
        data.append("username",event.target.username.value)
        data.append("password",event.target.password.value)

        axios.post(`users/token/`,data
        )
        .then(res => {
            setRefresh(res.data.refresh);
            setAccess(res.data.access);
            localStorage.setItem('refresh', JSON.stringify(res.data.refresh));
            SetAuthorized(true);
            navigate('/');

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

    function signup(event) {
        const data = new FormData();
        data.append("username",event.target.username.value)
        data.append("password",event.target.password.value)
        data.append("first_name",event.target.first_name.value)
        data.append("last_name",event.target.last_name.value)
        data.append("email",event.target.email.value)
        data.append("phone_number",event.target.phone.value)
        data.append("street_name",event.target.street_name.value)
        data.append("street_number",event.target.street_number.value)
        data.append("postal_code",event.target.postal_code.value)
        data.append("country",event.target.country.value)
        data.append("location",event.target.location.value)
        data.append("tin",event.target.tin.value)

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
    };

    function logout() {
        const data = new FormData();
        data.append("refresh",refresh)

        axios.post(`users/token/blacklist/`,data)
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

        setRefresh(null);
        setAccess(null);
        SetAuthorized(false);
        localStorage.removeItem('refresh');
    };
}

export default AuthContext;
export {AuthInfo};