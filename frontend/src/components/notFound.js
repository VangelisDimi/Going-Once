import React from 'react';
import DashBoard from './dashBoard';

class NotFound extends React.Component{
    render() {
        return(
            <div>
                <DashBoard/>
                <div>Page not found.</div>
            </div>
        );
    }
}

export default NotFound;