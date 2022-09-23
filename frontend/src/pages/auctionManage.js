import { useEffect,useContext,useState } from 'react';
import {useNavigate,useSearchParams} from 'react-router-dom';
import RequestContext from '../requests';
import {AuctionList} from '../components/auctions'
import {NavigatePages} from '../components/pagination'

function CreationButton(){
    const navigate = useNavigate();

    return(
        <button className="btn btn-outline-secondary" type="button" onClick={() => navigate("/manage/create")}>Create</button>
    );
}

function AuctionManage(){
    const {getAuctionManageList} = useContext(RequestContext);
    const [searchParams, setSearchParams] = useSearchParams({});
    const [page,setPage] = useState();

    useEffect(() => {
        const page = (searchParams.get("page") ? searchParams.get("page") : 1);
        const items =  (searchParams.get("items") ? searchParams.get("items") : 5);
        
        getAuctionManageList(page,items)
        .then(res => {
            setPage(JSON.parse(JSON.stringify(res.data)));
            window.scrollTo(0, 0);
        });
    },[searchParams,getAuctionManageList,setSearchParams])

    return(
        <>
            <CreationButton/>
            {page ? <NavigatePages pages={page.total_pages} current={page.current} params={searchParams} setParams={setSearchParams}/> : null}
            {page ? <AuctionList auctions={page.results}/> : null}
            {page ? <NavigatePages pages={page.total_pages} current={page.current} params={searchParams} setParams={setSearchParams}/> : null}
        </>
    );
}

export default AuctionManage;