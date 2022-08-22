import axios from 'axios';
import {createContext,useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

// Global axios settings
const axios_ins = axios.create({
    baseURL: 'http://localhost:8000/'
});
const AuthContext = createContext();

const AuthInfo = ({children}) => {
    const navigate = useNavigate();
    const [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null);
    let [loading, setLoading] = useState(true)

    const contextData = {
        authTokens:authTokens,
        login: login,
        signup: signup,
        logout: logout
    };

    useEffect(() => {
        const updateToken = () => {
            const data = new FormData();
            data.append("refresh",authTokens.refresh);
    
            axios_ins.post(`users/token/refresh/`,data)
            .then(res => {
                setAuthTokens(res.data);
                localStorage.setItem('authTokens', JSON.stringify(res.data));
            })
            .catch(function (error) {
                if (error.response) {
                    blacklist_token();
                }
            });
    
            if(loading){
                setLoading(false);
            }
        };

        const blacklist_token = () => {
            const data = new FormData();
            data.append("refresh",authTokens.refresh)
    
            axios_ins.post(`users/token/blacklist/`,data)
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
    
            setAuthTokens(null);
            localStorage.removeItem('authTokens');
        };

        if(authTokens) {
            if(loading){
                updateToken();
            }

            const refresh_time = 1000 * 60 * 0.1;

            const interval =  setInterval(()=> { 
                console.log("refresh");
                if(authTokens){
                    updateToken();
                }
            }, refresh_time)
            return ()=> clearInterval(interval)
        }
        else {
            setLoading(false);
        }
    }, [authTokens, loading]);

    return(
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    );

    function login(event) {
        const data = new FormData();
        data.append("username",event.target.username.value)
        data.append("password",event.target.password.value)

        axios_ins.post(`users/token/`,data
        )
        .then(res => {
            setAuthTokens(res.data);
            localStorage.setItem('authTokens', JSON.stringify(res.data));
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

        axios_ins.post(`users/register/`,data
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
        data.append("refresh",authTokens.refresh)

        axios_ins.post(`users/token/blacklist/`,data)
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

        setAuthTokens(null);
        localStorage.removeItem('authTokens');
    };
}

export default AuthContext;
export {AuthInfo};