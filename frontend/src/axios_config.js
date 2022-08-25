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
            Authorization: "Token " + token,
        },
    });

    axios_private_ins.interceptors.request.use(req => {
        //To-do
        return req;
    })

    //Called before request is send
    axios_private_ins.interceptors.response.use(res => {
        return res;
    }, function (error) {
        //To-do
    })

    return axios_private_ins;
}

export default AxiosPrivate;
export {axios_ins as axios};