import { useEffect,useContext,useState} from 'react';
import {useParams,useNavigate,useLocation} from 'react-router-dom';
import RequestContext from '../requests';
import {NotFound} from './errors';
import {Images,AuctionPrice,AuctionCategories,AuctionDate,AuctionMap,AuctionStatus,AuctionUsername,ExportAuction} from '../components/auctions'
import UpdateAuction from './auctionUpdate';
import AuthContext from '../auth';

function EditButtons({status,num_bids}){
    const navigate = useNavigate();

    if(num_bids===0 && status!=='closed')
    {
        return(
            <>  
                <button type="button" className="btn btn-secondary btn-margin" onClick={()=>navigate('edit')}> 
                    <i class="bi bi-pencil-fill"></i> Edit
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
                <button type="button" className="btn btn-secondary btn-margin" disabled> 
                    <i class="bi bi-pencil-fill"></i> Edit
                </button>

                {status==='closed'  ?
                    <p className="card-text text-muted"> Auction is closed</p> :
                    <p className="card-text text-muted"> Bids have been submitted </p>
                }
            </>
        );
    }
}

function SubmitBid({auction_id,status}){
    const {submitBid} = useContext(RequestContext);

    if(status==='closed') return null;

    function handleSubmit(event){
        event.preventDefault();
        submitBid(event,auction_id)
        .then(res => {
            
        });
    }

    function Modal(){
        return(
            <div class="modal fade" id="Modal" tabindex="-1" aria-labelledby="ModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Confirm bid sumbmission</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        Once you submit a bid you can't undo
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-success">Submit</button>
                    </div>
                    </div>
                </div>
            </div>
        );
    }

    return(
        <form onSubmit={handleSubmit}>
            <div className="col-sm-5">
                <label htmlFor="auction-start_bid"> Bid </label>
                <div className="input-group" name="geo-location" id="auction-start_bid">
                    <div className="input-group-text">$</div>
                    <input type="number" placeholder="0.00" className="form-control no-spinbox" name="amount"/>
                    <button type="button" className="btn btn-success" data-bs-toggle="modal" data-bs-target="#Modal" disabled={status!=='active'}>
                        Submit
                    </button>
                </div>
                {status==='pending'  ?
                    <p className="card-text text-muted"> Auction has not started yet</p> :
                    null
                }
                <Modal/>   
            </div>
        </form>
    );
}

function BidList({bids}){
    const[listItems,setListItems] = useState();

    useEffect(() => {
        const options = { day: 'numeric', month: 'numeric', year: 'numeric',hour: '2-digit', minute:'2-digit' };

        let listItems_temp = bids.map((bid) =>
            <tr key={bid.amount}>
                    <td>{bid.bidder_username}</td>
                    <td>{new Date(bid.time).toLocaleString([],options)}</td>
                <th scope="row">{bid.amount} $</th>
            </tr>
        );
        
        setListItems(listItems_temp);
    },[bids]);

    return (
        <table className="table table-striped">
            <thead>
                <tr>
                <th scope="col">Username</th>
                <th scope="col">Date</th>
                <th scope="col">Amount</th>
                </tr>
            </thead>
            <tbody>
                {listItems}
            </tbody>
        </table>
    );
}


function Auction(){
    const {getAuction} = useContext(RequestContext);
    const { id } = useParams(); 
    const [auction,setAuction] = useState();
    const [loading,setLoading] = useState(true);
    const location = useLocation().pathname;
    const {userInfo} = useContext(AuthContext);

    useEffect(() => {
        setLoading(true);
        getAuction(id)
        .then(res => {
            setAuction(JSON.parse(JSON.stringify(res.data)));
        });
        setLoading(false);
    },[id,getAuction])

    if(loading) return(null);
    if(!auction) return(<NotFound/>);


    if(location.endsWith('/edit')){
        return(
            <>
                <UpdateAuction auction={auction}/>
            </>
        );
    }
    return(
        <>
            <div className="card">
                {auction.images.length !== 0 ? <Images image_list={auction.images}/> : null}
                <ExportAuction auction_id={auction.pk}/>
                <div className="card-body">
                    <h5 className="card-title">{auction.name} <AuctionStatus status={auction.status}/></h5>
                    <AuctionUsername username={auction.seller_username} own_auction={auction.own_auction}/>
                    <p className="card-text"> <i className="bi bi-geo-alt-fill"></i> {auction.location},{auction.country}</p>
                    <AuctionMap position={{"lat": auction.latitude,"lng" : auction.longitude}}/>
                    <p className="card-text">{auction.description}</p>
                    <p className="card-text"><AuctionCategories categories={auction.categories}/></p>
                    {auction.own_auction ? <EditButtons status={auction.status} num_bids={auction.num_bids}/> : null}
                    <h6 className="card-text"> <AuctionPrice start={auction.first_bid} current={auction.current_bid} num_bids={auction.num_bids} own_bid={auction.own_bid} status={auction.status}/></h6>
                    {!auction.own_auction && !userInfo.is_staff ? <SubmitBid auction_id={auction.pk} status={auction.status}/> : null}
                    {(auction.own_auction || userInfo.is_staff) && auction.bids.length>0 ? <BidList bids={auction.bids}/> : null}
                </div> 
                <div className="card-footer">
                    <small className="text-muted"><AuctionDate starts={auction.started} ends={auction.ends} status={auction.status}/></small>
                </div>
            </div>
        </>
    );
}

export default Auction