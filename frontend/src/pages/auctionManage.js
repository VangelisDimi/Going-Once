import { useEffect,useContext } from 'react';
import {useNavigate,useSearchParams} from 'react-router-dom';
import RequestContext from '../requests';

function CreationButton(){
    const navigate = useNavigate();

    return(
        <button className="btn btn-outline-secondary" type="button" onClick={() => navigate("/manage/create")}>Create</button>
    );
}

function NavigatePages(){
    return(
        <nav aria-label="Page navigation example">
            <ul class="pagination">
                <li class="page-item">
                <a class="page-link" href="/manage" aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                </a>
                </li>
                <li class="page-item active"><a class="page-link" href="?page=2">1</a></li>
                <li class="page-item"><a class="page-link" href="/manage">2</a></li>
                <li class="page-item"><a class="page-link" href="/manage">3</a></li>
                <li class="page-item">
                <a class="page-link" href="/manage" aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                </a>
                </li>
            </ul>
        </nav>
    );
}

function AuctionManage(){
    const {createAuction} = useContext(RequestContext);
    const [searchParams, setSearchParams] = useSearchParams({"items":5,"page":1});

    useEffect(() => {

    },[searchParams])

    return(
        <>
            <CreationButton/>
            <NavigatePages pages={searchParams.page}/>
        </>
    );
}

export default AuctionManage;