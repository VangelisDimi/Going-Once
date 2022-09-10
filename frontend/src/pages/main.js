import {useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../auth';


function Main(){
    const {userInfo} = useContext(AuthContext);
    let navigate = useNavigate();

    return(
        <>
        </>
    );
}

export default Main;