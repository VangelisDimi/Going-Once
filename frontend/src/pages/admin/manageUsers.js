import {useState,useEffect,useContext} from 'react';
import {useSearchParams} from 'react-router-dom';
import RequestContext from '../../requests'
import {NavigatePages} from '../../components/pagination'

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

function AdminList() {
    const {getAdminList,approveUser} = useContext(RequestContext);
    const [searchParams, setSearchParams] = useSearchParams({});
    const [data,setData] = useState({results:[]});
    const[listItems,setListItems] = useState();

    useEffect(() => {
        const page = (searchParams.get("page") ? searchParams.get("page") : 1);
        const items =  (searchParams.get("items") ? searchParams.get("items") : 5);

        getAdminList(page,items)
        .then(res => {
            setData(JSON.parse(JSON.stringify(res.data)));
            window.scrollTo(0, 0);
        });
    },[getAdminList,searchParams]); 

    useEffect(() => {
        let listItems_temp = data.results.map((user) =>
            <tr key={user.pk}>
                <th scope="row">{user.pk}</th>
                    <td>{user.username} <span className="badge bg-secondary">Admin</span> {user.is_superuser ? <span className="badge bg-secondary">Superuser</span> : null}</td>
                    <td>{user.first_name} {user.last_name}</td>
                    <td>{user.email}</td>
                    <td>{user.is_approved ? <>Approved <i className="bi bi-check-lg text-success"/> </> : 'Pending'}</td>
                    <td>{!user.is_approved ? <ApproveButton user_id={user.pk}/> : null}</td>
            </tr>
        );
        
        setListItems(listItems_temp);
    },[data]);

    return (
        <>
        <table className="table">
            <thead>
                <tr>
                <th scope="col">Id</th>
                <th scope="col">Username</th>
                <th scope="col">Full name</th>
                <th scope="col">E-mail</th>
                <th scope="col">Status</th>
                <th scope="col"></th>
                </tr>
            </thead>
            <tbody>
                {listItems}
            </tbody>
        </table>

        {data ? <NavigatePages pages={data.total_pages} current={data.current} params={searchParams} setParams={setSearchParams}/> : null}
        </>
    );

    function refreshData() {
        const page = (searchParams.get("page") ? searchParams.get("page") : 1);
        const items =  (searchParams.get("items") ? searchParams.get("items") : 5);

        getAdminList(page,items)
        .then(res => {
            setData(JSON.parse(JSON.stringify(res.data)));
            window.scrollTo(0, 0);
        });
    }

    function handleApprove(user_id) {
        approveUser(user_id)
        .then(res => {
            refreshData();
        });
    }

    function ApproveButton({user_id}) {
        return(
            <button type="button" className="btn btn-success" onClick={() => handleApprove(user_id)}>
                <i className="bi bi-check-lg"></i> Approve
            </button>
        );
    }
}

function UserList() {
    const {getUserList,approveUser} = useContext(RequestContext);
    const [searchParams, setSearchParams] = useSearchParams({});
    const [data,setData] = useState({results:[]});
    const[listItems,setListItems] = useState();

    useEffect(() => {
        const page = (searchParams.get("page") ? searchParams.get("page") : 1);
        const items =  (searchParams.get("items") ? searchParams.get("items") : 5);

        getUserList(page,items)
        .then(res => {
            setData(JSON.parse(JSON.stringify(res.data)));
            window.scrollTo(0, 0);
        });
    },[getUserList,searchParams]); 


    useEffect(() => {
        const listItems_temp = data.results.map((user) =>
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
                        <td>{user.is_approved ? <>Approved <i className="bi bi-check-lg text-success"/> </> : 'Pending'}</td>
                        <td>{!user.is_approved ? <ApproveButton user_id={user.pk}/> : null}</td>
                </tr>
        );
    
        setListItems(listItems_temp);
    },[data]);

    return (
        <>
        <table className="table">
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

        {data ? <NavigatePages pages={data.total_pages} current={data.current} params={searchParams} setParams={setSearchParams}/> : null}
        </>
    );

    function refreshData() {
        const page = (searchParams.get("page") ? searchParams.get("page") : 1);
        const items =  (searchParams.get("items") ? searchParams.get("items") : 5);

        getUserList(page,items)
        .then(res => {
            setData(JSON.parse(JSON.stringify(res.data)));
            window.scrollTo(0, 0);
        });
    }

    function handleApprove(user_id) {
        approveUser(user_id)
        .then(res => {
            refreshData();
        });
    }

    function ApproveButton({user_id}) {
        return(
            <button type="button" className="btn btn-success" onClick={() => handleApprove(user_id)}>
                <i className="bi bi-check-lg"></i> Approve
            </button>
        );
    }
}

function ManageUsers() {
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

export default ManageUsers;