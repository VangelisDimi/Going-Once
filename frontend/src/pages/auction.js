import { useEffect,useContext,useState} from 'react';
import {useParams,useNavigate,useLocation} from 'react-router-dom';
import RequestContext from '../requests';
import {NotFound,NoPermission} from './errors';
import {Images,AuctionPrice,AuctionCategories,AuctionDate,AuctionMap,AuctionStatus,AuctionUsername,ExportAuction} from '../components/auctions'
import UpdateAuction from './auctionUpdate';
import AuthContext from '../auth';

//Auction information page

function EditButtons({status,num_bids}){
    const navigate = useNavigate();

    if(num_bids===0 && status!=='closed')
    {
        return(
            <>  
                <button type="button" className="btn btn-secondary btn-margin" onClick={()=>navigate('edit')}> 
                    <i className="bi bi-pencil-fill"></i> Edit
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
                    <i className="bi bi-pencil-fill"></i> Edit
                </button>

                {status==='closed'  ?
                    <p className="card-text text-muted"> Auction is closed</p> :
                    <p className="card-text text-muted"> Bids have been submitted </p>
                }
            </>
        );
    }
}

function SubmitBid({auction_id,status,own_bid,current}){
    const {submitBid} = useContext(RequestContext);
    const [errors,setErrors] = useState({
        bid:'',
    });

    if(status==='closed') return null;

    function handleSubmit(event){
        event.preventDefault();
        event.target.amount.className = "form-control no-spinbox"

        if(own_bid){
            event.target.amount.className = "form-control no-spinbox is-invalid"
            errors.bid = "You can't bid two times in a row."
            setErrors({...errors});
            return;
        }
        else if(event.target.amount.value <= current){
            event.target.amount.className = "form-control no-spinbox is-invalid"
            errors.bid = "Bid must be higher than current bid."
            setErrors({...errors});
            return;
        }

        submitBid(event,auction_id)
        .then(res => {
            window.location.reload();
        })
        .catch(function (error) {
            event.target.amount.className = "form-control no-spinbox is-invalid";
            errors.bid = "There was an uncexpected error while trying to submit the bid.";
            setErrors({...errors});
        });
    }

    function Modal(){
        return(
            <div className="modal fade" id="Modal" tabIndex="-1" aria-labelledby="ModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Confirm bid sumbmission</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        Once you submit a bid you can't undo
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" className="btn btn-success" data-bs-dismiss="modal">Submit</button>
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
                <div className="input-group has-validation" name="bid" id="auction-start_bid">
                    <div className="input-group-text">$</div>
                    <input type="number" placeholder="0.00" step="0.01" min="0" className="form-control no-spinbox" name="amount" required/>
                    <button type="button" className="btn btn-success" data-bs-toggle="modal" data-bs-target="#Modal" disabled={status!=='active'}>
                        Submit
                    </button>
                    <div className="invalid-feedback" id="invalid-bid">
                        {errors.bid}
                    </div>
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
    const {authorized,userInfo} = useContext(AuthContext);

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
        if(auction.own_auction){
            return(
                <>
                    <UpdateAuction auction={auction}/>
                </>
            );
        }
        else
        { 
            return <NoPermission/>
        }
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
                    {authorized && !auction.own_auction && !userInfo.is_staff && userInfo.is_approved ? <SubmitBid auction_id={auction.pk} status={auction.status} own_bid={auction.own_bid} current={auction.current_bid}/> : null}
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