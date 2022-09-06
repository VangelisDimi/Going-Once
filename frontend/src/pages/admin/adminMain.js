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

function AuctionList(){
    function createXML(){
        // const xmlStr = '<q id="a"><span id="b">hey!</span></q>';
        // const parser = new DOMParser();
        // const doc = parser.parseFromString(xmlStr, "application/xml");
        // // print the name of the root element or error message
        // const errorNode = doc.querySelector("parsererror");
        // if (errorNode) {
        // console.log("error while parsing");
        // } else {
        // console.log(doc.documentElement.nodeName);
        // }

        // let blob = new Blob(['<q id="a"><span id="b">hey!</span></q>'], {type: 'text/xml'});
        // let url = URL.createObjectURL(blob);
        // window.open(url);
        // URL.revokeObjectURL(url);
    }

    return(
        <button onClick={createXML}>Create</button>
    )
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
        <AuctionList/>
        </>
    );
}

export default AdminMain;