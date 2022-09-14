import {useState,useEffect,useContext} from 'react';
import RequestContext from '../../requests'

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

function AdminList() {
    return(
        null
    );
}

function UserList() {
    const [data,setData] = useState([]);
    const {getUserList} = useContext(RequestContext);

    useEffect(() => {
        getUserList()
        .then(res => {
            setData(JSON.parse(JSON.stringify(res.data)));
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
        <table class="table">
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
                <th scope="col"></th>
                </tr>
            </thead>
            <tbody>
                {listItems}
            </tbody>
        </table>
    );

    function refreshData() {
        getUserList()
        .then(res => {
            setData(JSON.parse(JSON.stringify(res.data)));
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
            <button class="btn btn-success" onClick={() => approveUser(user_id)}>
                <i class="bi bi-check"></i> Approve
            </button>
        );
    }

    function RejectButton(user_id) {
        const[id,setId] = useState(user_id); 

        return(
            <button class="btn btn-danger" onClick={() => rejectUser(user_id)}>
                <i class="bi bi-x"></i> Reject
            </button>
        );
    }
}

function AdminMain() {

    return(
        <>
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
        </>
    );
}

export default AdminMain;