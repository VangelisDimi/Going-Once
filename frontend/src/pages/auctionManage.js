import { useEffect,useContext,useState } from 'react';
import {useNavigate,useSearchParams} from 'react-router-dom';
import RequestContext from '../requests';
import {Images,AuctionPrice,AuctionCategories,AuctionDate,AuctionStatus} from '../components/auctions'
import {NavigatePages} from '../components/pagination'

function CreationButton(){
    const navigate = useNavigate();

    return(
        <button className="btn btn-outline-secondary" type="button" onClick={() => navigate("/manage/create")}>Create</button>
    );
}

function AuctionList({auctions}){
    const [elements,setElements] = useState([]);

    useEffect(() => {
        const elements_temp=[]
        for (let auction of auctions){
            elements_temp.push(
                <div class="card">
                    {auction.images.length !== 0 ? <Images image_list={auction.images}/> : null}
                    <div class="card-body">
                        <h5 class="card-title">{auction.name} <AuctionStatus status={auction.status}/></h5>
                        <p class="card-text"><small class="text-muted">{auction.seller_username}</small></p>
                        <p class="card-text"> <i class="bi bi-geo-alt-fill"></i> {auction.location},{auction.country}</p>
                        <p class="card-text"> <AuctionPrice start={auction.first_bid} current={auction.current_bid} num_bids={auction.bids.length} /></p>
                        <p class="card-text"><AuctionCategories categories={auction.categories}/></p>
                        <a href={`/auction/${auction.pk}`} class="link-primary">View more</a>
                    </div>
                    <div class="card-footer">
                        <small class="text-muted"><AuctionDate starts={auction.started} ends={auction.ends} status={auction.status}/></small>
                    </div>
                </div>
            );
        }

        setElements(elements_temp);
    },[auctions])

    return(
        <>
            {elements}
        </>
    )
}

function AuctionManage(){
    const {getAuctionList} = useContext(RequestContext);
    const [searchParams, setSearchParams] = useSearchParams({"items":5,"page":1});
    const [page,setPage] = useState();

    useEffect(() => {
        getAuctionList(searchParams.get("page"),searchParams.get("items"))
        .then(res => {
            setPage(JSON.parse(JSON.stringify(res.data)));
        });
    },[searchParams,getAuctionList,setSearchParams])

    return(
        <>
            <CreationButton/>
            {page ? <AuctionList auctions={page.results}/> : null}
            {page ? <NavigatePages pages={page.total_pages} current={page.current} params={searchParams} setParams={setSearchParams}/> : null}
        </>
    );
}

export default AuctionManage;