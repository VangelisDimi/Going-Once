import { useEffect,useContext,useState } from 'react';
import {useSearchParams} from 'react-router-dom';
import RequestContext from '../requests';
import {AuctionList} from '../components/auctions'
import {NavigatePages} from '../components/pagination'

function AuctionNavigate(){
    const {getAuctionNavigateList} = useContext(RequestContext);
    const [searchParams, setSearchParams] = useSearchParams({});
    const [page,setPage] = useState();

    useEffect(() => {
        const page = (searchParams.get("page") ? searchParams.get("page") : 1);
        const items =  (searchParams.get("items") ? searchParams.get("items") : 5);
        
        getAuctionNavigateList(page,items)
        .then(res => {
            setPage(JSON.parse(JSON.stringify(res.data)));
            window.scrollTo(0, 0);
        });
    },[searchParams,getAuctionNavigateList,setSearchParams])

    return(
        <>
            {page ? <NavigatePages pages={page.total_pages} current={page.current} params={searchParams} setParams={setSearchParams}/> : null}
            {page ? <AuctionList auctions={page.results}/> : null}
            {page ? <NavigatePages pages={page.total_pages} current={page.current} params={searchParams} setParams={setSearchParams}/> : null}
        </>
    );
}

export default AuctionNavigate;