import {useState,useEffect} from 'react';
import {  Table,Tab } from "semantic-ui-react";
import AxiosPrivate from "../../axios_config"

function AdminList() {
    
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
            <Table.Row key={user.pk}>
                <Table.Cell>{user.pk}</Table.Cell>
                <Table.Cell>{user.username}</Table.Cell>
                <Table.Cell>{user.first_name} {user.last_name}</Table.Cell>
                <Table.Cell>{user.email}</Table.Cell>
                <Table.Cell>{user.phone_number}</Table.Cell>
                <Table.Cell>{user.street_name} {user.street_number}</Table.Cell>
                <Table.Cell>{user.postal_code}</Table.Cell>
                <Table.Cell>{user.country}</Table.Cell>
                <Table.Cell>{user.location}</Table.Cell>
                <Table.Cell>{user.tin}</Table.Cell>
                <Table.Cell>{user.is_approved ? 'Approved' : 'Not approved'}</Table.Cell>
                <Table.Cell>{!user.is_approved ? <><ApproveButton/> <RejectButton/></> : null}</Table.Cell>
            </Table.Row>
    );
    return (
        <Table singleLine>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Id</Table.HeaderCell>
            <Table.HeaderCell>Username</Table.HeaderCell>
            <Table.HeaderCell>Full name</Table.HeaderCell>
            <Table.HeaderCell>E-mail</Table.HeaderCell>
            <Table.HeaderCell>Phone number</Table.HeaderCell>
            <Table.HeaderCell>Address</Table.HeaderCell>
            <Table.HeaderCell>Postal code</Table.HeaderCell>
            <Table.HeaderCell>Country</Table.HeaderCell>
            <Table.HeaderCell>Location</Table.HeaderCell>
            <Table.HeaderCell>TIN</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
            {listItems}
        </Table.Body>
        </Table>
    );

    function approveUser(user_id) {

    } 

    function rejectUser(user_id) {
        
    }

    function ApproveButton(user_id) {
        const [id,setId] = useState();

        return(
            <button onClick={approveUser}>
                Approve
            </button>
        );
    }

    function RejectButton(user_id) {
        const [id,setId] = useState();

        return(
            <button onClick={rejectUser}>
                Reject
            </button>
        );
    }
}

function AdminMain() {
    const panes = [
        {
          menuItem: 'Users',
          render: () => <Tab.Pane attached={false}> <UserList/> </Tab.Pane>,
        },
        {
          menuItem: 'Admins',
          render: () => <Tab.Pane attached={false}> <AdminList/> </Tab.Pane>,
        },
    ]

    return(
        <Tab menu={{ pointing: true }} panes={panes} />
    );
}

export default AdminMain