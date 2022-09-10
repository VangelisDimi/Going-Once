import {useNavigate} from 'react-router-dom';

function CreationButton(){
    const navigate = useNavigate();

    return(
        <button className="btn btn-outline-secondary" type="button" onClick={() => navigate("/manage/create")}>Create</button>
    );
}

function AuctionManage(){
    return(
        <>
            <CreationButton/>
        </>
    );
}

export default AuctionManage;