import { useEffect,useContext,useState} from 'react';
import {useParams} from 'react-router-dom';
import RequestContext from '../requests';
import {NotFound} from './errors';
import {Images,AuctionPrice,AuctionCategories,AuctionDate,AuctionMap,AuctionStatus} from '../components/auctions'

function EditButtons({status,num_bids}){
    if(num_bids===0 && status!=='closed')
    {
        return(
            <>  
                <button className="btn btn-secondary btn-margin"> 
                    <i class="bi bi-pencil-fill"></i> Edit
                </button>
                <button className="btn btn-danger btn-margin"> 
                    <i class="bi bi-x-lg"></i> Delete
                </button>

                {status==='active'  ?
                    <p className="card-text text-success"> No bids submitted</p> :
                    <p className="card-text text-success"> Auction hasn't started yet</p>
                }
            </>
        );
    }
    else if(num_bids>0 || status==='closed')
    {
        return(
            <>  
                <button className="btn btn-secondary btn-margin" disabled> 
                    <i class="bi bi-pencil-fill"></i> Edit
                </button>
                <button className="btn btn-danger btn-margin" disabled> 
                    <i class="bi bi-x-lg"></i> Delete
                </button>

                {status==='closed'  ?
                    <p className="card-text text-muted"> Auction is closed</p> :
                    <p className="card-text text-muted"> Bids have been submitted </p>
                }
            </>
        );
    }
}

function Auction(){
    const {getAuction} = useContext(RequestContext);
    const { id } = useParams(); 
    const [auction,setAuction] = useState();
    const [loading,setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getAuction(id)
        .then(res => {
            setAuction(JSON.parse(JSON.stringify(res.data)));
        });
        setLoading(false);
    },[id])

    if(loading) return(null);
    if(!auction) return(<NotFound/>);

    return(
        <>
            <div className="card">
                {auction.images.length !== 0 ? <Images image_list={auction.images}/> : null}
                <div className="card-body">
                    <h5 className="card-title">{auction.name} <AuctionStatus status={auction.status}/></h5>
                    <p className="card-text"><small className="text-muted">{auction.seller_username}</small></p>
                    <p className="card-text"> <i className="bi bi-geo-alt-fill"></i> {auction.location},{auction.country}</p>
                    <AuctionMap position={{"lat": auction.latitude,"lng" : auction.longitude}}/>
                    <p className="card-text"> <AuctionPrice start={auction.first_bid} current={auction.current_bid} num_bids={auction.bids.length} /></p>
                    <p className="card-text">{auction.description}</p>
                    <p className="card-text"><AuctionCategories categories={auction.categories}/></p>
                    <EditButtons status={auction.status} num_bids={auction.bids.length}/>
                    {/* bids */}
                </div> 
                <div className="card-footer">
                    <small className="text-muted"><AuctionDate starts={auction.started} ends={auction.ends} status={auction.status}/></small>
                </div>
            </div>
        </>
    );
}

export default Auction