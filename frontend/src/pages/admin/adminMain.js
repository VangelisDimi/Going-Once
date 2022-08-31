import {useState,useEffect} from 'react';
import AxiosPrivate from "../../axios_config"

// import 'bootstrap/dist/css/bootstrap.min.css';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

function AdminList() {
    return(
        "aasasaas"
    );
}

function UserList() {
    const axios = AxiosPrivate();
    const [data,setData] = useState([]);

    useEffect(() => {
        axios.get('/users/admin/getuserslist/')
        .then(res => {
            setData(JSON.parse(res.data));
        });
    },[]); 


    const listItems = data.map((user) =>
            <tr key={user.pk}>
                <th scope="row">{user.pk}</th>
                    <td>{user.username}</td>
                    <td>{user.first_name} {user.last_name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone_number}</td>
                    <td>{user.street_name} {user.street_number}</td>
                    <td>{user.postal_code}</td>
                    <td>{user.country}</td>
                    <td>{user.location}</td>
                    <td>{user.tin}</td>
                    <td>{user.is_approved ? 'Approved' : 'Not approved'}</td>
                    <td>{!user.is_approved ? <><ApproveButton/> <RejectButton/></> : null}</td>
            </tr>
    );

    return (
        <table>
            <thead>
                <tr>
                <th scope="col">Id</th>
                <th scope="col">Username</th>
                <th scope="col">Full name</th>
                <th scope="col">E-mail</th>
                <th scope="col">Phone number</th>
                <th scope="col">Address</th>
                <th scope="col">Postal code</th>
                <th scope="col">Country</th>
                <th scope="col">Location</th>
                <th scope="col">TIN</th>
                <th scope="col">Status</th>
                </tr>
            </thead>
            <tbody>
                {listItems}
            </tbody>
        </table>
    );

    function refreshData() {
        axios.get('/users/admin/getuserslist/')
        .then(res => {
            setData(JSON.parse(res.data));
        });
    }

    function approveUser(user_id) {
        refreshData();
    } 

    function rejectUser(user_id) {
        refreshData();
    }

    function ApproveButton(user_id) {
        const[id,setId] = useState(user_id); 

        return(
            <button onClick={() => approveUser(user_id)}>
                Approve
            </button>
        );
    }

    function RejectButton(user_id) {
        const[id,setId] = useState(user_id); 

        return(
            <button onClick={() => rejectUser(user_id)}>
                Reject
            </button>
        );
    }
}

function AdminMain() {

    return(
        <Tabs
            defaultActiveKey="users"
        >
            <Tab eventKey="users" title="Users">
                <UserList />
            </Tab>
            <Tab eventKey="admins" title="Admins">
                <AdminList />
            </Tab>
        </Tabs>
    );
}

export default AdminMain;