import axios from 'axios'
import jwt_decode from "jwt-decode"
import dayjs from 'dayjs'
import AuthContext from './auth'
import {useContext} from 'react'

const axios_ins = axios.create({
    baseURL: 'http://localhost:8000/'
});

const AxiosPrivate = () => {
    const {authTokens,setAuthTokens} = useContext(AuthContext);

    const axios_private_ins = axios.create({
        baseURL: 'http://localhost:8000/',
        headers : {
            Authorization: "Bearer " + authTokens?.access,
        },
    });

    //Called before request is send
    axios_private_ins.interceptors.request.use(req => {
        //Check if access token has expired
        const user = jwt_decode(authTokens.access);
        const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1000 * 60 * 1;//Expires in 1 minute
        if(!isExpired) return req;

        //Check if refresh token has expired
        const refresh = jwt_decode(authTokens.refresh);
        const isExpiredRefresh = dayjs.unix(refresh.exp).diff(dayjs()) < 1000 * 60 * 1;//Expires in 1 minute
        const CancelToken = axios.CancelToken;
        if(isExpiredRefresh)
        {
            //Cancel request and logout
        }
        
        //Refresh access token
        const data = new FormData();
        data.append("refresh",authTokens.refresh);
        axios_ins.post('users/token/refresh/',data)
        .then(res => {
                localStorage.setItem('authTokens', JSON.stringify(res.data));
                setAuthTokens(res.data);
                req.headers.Authorization = "Bearer " + res.data.access;
                console.log(res.data);
        });
        return req;
    })

    return axios_private_ins;
}

export default AxiosPrivate;
export {axios_ins as axios};