import React from 'react';
import DashBoard from './dashBoard.js'

class Welcome extends React.Component{
    render() {
        return (
            <div>
                <DashBoard page="welcome"/>
            </div>
        );
    }
}

export default Welcome;