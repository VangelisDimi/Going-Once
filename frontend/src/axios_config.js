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

    // axios_private_ins.interceptors.request.use(req => {
    //     //To-do
    //     if(!token)
    //     {
    //         setToken(localStorage.getItem('token') ? localStorage.getItem('token') : null);
    //         if(!token)
    //         {
    //             //Logout and cancel
    //         }
    //         req.headers.Authorization = "Token " + token;
    //     }
    //     return req;
    // })

    // //Called before request is send
    // axios_private_ins.interceptors.response.use(res => {
    //     return res;
    // }, function (error) {
    //     //To-do
    //     storageToken = localStorage.getItem('token') ? localStorage.getItem('token') : null;
    //     if(token != storageToken) 
    //     {
    //         setToken(storageToken);
    //         req.headers.Authorization = "Token " + token;
    //         //Retry request
    //     }
    //     else 
    //     {
    //         if (error.request)
    //         {
    //             //Logout
    //         }
    //     }
    //     return error;
    // })

    return axios_private_ins;
}

export default AxiosPrivate;
export {axios_ins as axios};