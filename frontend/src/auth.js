import {useEffect,createContext,useState} from 'react';
import  {axios} from './axios_config'
import Modal from  'bootstrap/js/dist/modal'
import { NoConnection } from './pages/errors';

const AuthContext = createContext();

//Handles authentication
const AuthInfo = ({children}) => {
    const [token, setToken] = useState(() => localStorage.getItem('token') ? localStorage.getItem('token') : null);
    const [authorized,setAuthorized] = useState(token ? true : false);
    const [userInfo,setUserInfo] = useState([]);
    const [loading,setLoading] = useState(true);
    const [connection,setConnection] = useState(true);

    const contextData = {
        authorized: authorized,
        token: token,
        userInfo: userInfo,
        setToken: setToken,
        login: login,
        signup: signup,
        adminLogin: adminLogin,
        adminSignup: adminSignup,
        logout: logout
    };

    useEffect(() => {
        setLoading(true);
        const axios_priv = axios.create({
            headers : {
                Authorization: "Token " + token,
            },
        });

        axios.get('pingserver/')
        .catch(function(error) {
            setConnection(false);
        })

        if(token && connection){
            axios_priv.get('users/get/')
            .then(res => {
                setUserInfo(JSON.parse(JSON.stringify(res.data)));
            })
            .catch(function (error) {
                if (error.response) {
                    if (error.response.status === 401){//Unauthorized
                        logout();
                    }
                }
            });
        }

        setLoading(false);
    },[token]);


    return(
        <AuthContext.Provider value={contextData}>
            {!loading ?
                (connection ? children : <NoConnection/>)
                :
                null
            }
        </AuthContext.Provider>
    );

    function adminLogin(event){
        return login(event,true);
    };

    function login(event,admin=false) {
        let url = '/users/login/';
        if(admin) url = '/users/admin/login/'
        
        return axios.post(url,{},{ 
            auth:{
                "username": event.target.username.value,
                "password": event.target.password.value,
            }
        })
        .then(res => {
            setToken(res.data.token);
            localStorage.setItem('token', res.data.token);
            setAuthorized(true);
        })
    };

    function adminSignup(event) {
        return signup(event,true);
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

        return axios.post(url,data);
    };

    function logout() {
        axios.post('/users/logout/',{},{
            headers:{
                "Authorization": `Token ${token}`,
            }
        })
        .then(res => {
            setToken(null);
            setAuthorized(false);
            setUserInfo([]);
            localStorage.removeItem('token');
        })
        .catch(function (error) {
            if (error.response && error.response.status!==0) {
                setToken(null);
                setAuthorized(false);
                setUserInfo([]);
                localStorage.removeItem('token');
            }
            else{
                const myModal = new Modal(document.getElementById('ErrorModal'));
                myModal.show();
            }
        })
    };
}

export default AuthContext;
export {AuthInfo};