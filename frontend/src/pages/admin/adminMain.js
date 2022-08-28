import {useState,useEffect} from 'react';
import AxiosPrivate from "../../axios_config"

function UserList() {
    const axios = AxiosPrivate();
    const [list,setList] = useState();

    useEffect(() => {
        axios.get('/users/admin/getuserslist/')
        .then(res => {
            console.log(res);
        })
    });

    return null;
}

function AdminMain() {
    return(
        <UserList/>
    );
}

export default AdminMain