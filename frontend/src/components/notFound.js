import DashBoard from './dashBoard';

function NotFound(){
    return(
        <div>
            <DashBoard page="welcome"/>
            <div>Page not found.</div>
        </div>
    );
}

export default NotFound;