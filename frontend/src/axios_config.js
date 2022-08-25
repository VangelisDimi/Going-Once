import axios from 'axios'
import jwt_decode from "jwt-decode"
import dayjs from 'dayjs'
import AuthContext from './auth'
import {useContext} from 'react'

const axios_ins = axios.create({
    baseURL: 'http://localhost:8000/'
});

const AxiosPrivate = () => {
    const {refresh,setRefresh,access,setAccess} = useContext(AuthContext);

    const axios_private_ins = axios.create({
        baseURL: 'http://localhost:8000/',
        headers : {
            Authorization: "Bearer " + access,
        },
    });

    //Called before request is send
    axios_private_ins.interceptors.request.use(req => {
        //Check if access token has expired
        if (access) {
            const access_inf = jwt_decode(access);
            const isExpiredAccess = dayjs.unix(access_inf.exp).diff(dayjs()) < 1000 * 60 * 1;//Expires in 1 minute
            if(!isExpiredAccess) return req;
        }

        //Check if refresh token has expired
        const refresh_inf = jwt_decode(refresh);
        const isExpiredRefresh = dayjs.unix(refresh_inf.exp).diff(dayjs()) < 1000 * 60 * 1;//Expires in 1 minute
        const CancelToken = axios.CancelToken;
        if(isExpiredRefresh) {
            //Cancel request and logout
        }
        
        //Refresh access token
        const data = new FormData();
        data.append("refresh",refresh);
        axios_ins.post('users/token/refresh/',data)
        .then(res => {
                localStorage.setItem('refresh', JSON.stringify(res.data.refresh));
                setRefresh(res.data.refresh);
                setAccess(res.data.access);
                req.headers.Authorization = "Bearer " + res.data.access;
                console.log(res.data);
        });
        return req;
    })

    return axios_private_ins;
}

export default AxiosPrivate;
export {axios_ins as axios};