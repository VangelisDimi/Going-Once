import axios from 'axios'
import AuthContext from './auth'
import {useContext} from 'react'

const axios_ins = axios.create({
    baseURL: 'http://localhost:8000/'
});

const AxiosPrivate = () => {
    const {token,setToken} = useContext(AuthContext);

    const axios_private_ins = axios.create({
        baseURL: 'http://localhost:8000/',
        headers : {
            Authorization: (token ? "Token " + token : '')
        },
    });

    return axios_private_ins;
}

export default AxiosPrivate;
export {axios_ins as axios};