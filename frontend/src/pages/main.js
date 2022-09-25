import {useContext} from 'react';
import AuthContext from '../auth';
import {NotApproved} from './errors'


function Main(){
    const {userInfo,authorized} = useContext(AuthContext);

    if (authorized && !userInfo.is_approved) return <NotApproved/>

    return(
        <>
        </>
    );
}

export default Main;