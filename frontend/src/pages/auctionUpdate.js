import {useContext,useRef,useEffect} from 'react';
import RequestContext from '../requests';
import {BackButton,TagForm,MapForm} from '../components/forms';
import moment from 'moment'

function UpdateAuctionForm({auction}){
    const position = useRef();
    const tagsRef = useRef();
    const {updateAuction,deleteAuction} = useContext(RequestContext);
    const start_date =  moment(auction.started).format("YYYY-MM-DDTHH:mm")
    const end_date =  moment(auction.ends).format("YYYY-MM-DDTHH:mm")

    function handleDelete(event){
        deleteAuction(auction.pk);
    }

    function Modal(){
        return(
            <div class="modal fade" id="Modal" tabindex="-1" aria-labelledby="ModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Delete</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        Confirm auction deletion.
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-danger" onClick={handleDelete}>Delete</button>
                    </div>
                    </div>
                </div>
            </div>
        );
    }

    function EditButtons(){
        const status = auction.status;
        const num_bids = auction.bids.length;

        if(num_bids===0 && status!=='closed')
        {
            return(
                <>  
                    <button type="submit" className="btn btn-primary">
                        <i class="bi bi-upload"></i> Save
                    </button>
                    <button type="button" className="btn btn-danger btn-margin" data-bs-toggle="modal" data-bs-target="#Modal"> 
                        <i class="bi bi-x-lg"></i> Delete
                    </button>
                    <Modal/>

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
                    <button type="button" className="btn btn-primary" disabled>
                        <i class="bi bi-upload"></i> Save
                    </button>
                    <button type="button" className="btn btn-danger btn-margin" disabled> 
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

    return(
        <form onSubmit={handleSubmit}>
            <h3>Create Auction</h3>
            <label htmlFor="auction-name"> Name </label>
            <input type="text" className="form-control" name="name" id="auction-name" defaultValue={auction.name}/>
            <TagForm ref={tagsRef} tags={auction.categories}/>
            <div className="col-sm-5">
                <label htmlFor="auction-start_bid"> Starting Bid </label>
                <div className="input-group" name="geo-location" id="auction-start_bid">
                    <div className="input-group-text">$</div>
                    <input type="number" placeholder="0.00" className="form-control no-spinbox" name="start_bid" defaultValue={auction.first_bid}/>
                </div>
            </div>
            <label htmlFor="auction-location"> Location </label>
            <input type="text" className="form-control" name="location" id="auction-location" defaultValue={auction.location}/>
            <label htmlFor="auction-country"> Country </label>
            <input type="text" className="form-control" name="country" id="auction-country" defaultValue={auction.country}/>
            <label htmlFor="auction-start_date"> Start date </label>
            <input type="datetime-local" className="form-control" name="start_date" id="auction-start_date" defaultValue={start_date}/>
            <label htmlFor="auction-end_date"> End date </label>
            <input type="datetime-local" className="form-control" name="end_date" id="auction-end_date" defaultValue={end_date}/>
            <label htmlFor="auction-description"> Description </label>
            <textarea className="form-control" name="description" id="auction-description" defaultValue={auction.description}/>
            <MapForm ref={position} position={{"lat": auction.latitude,"lng" : auction.longitude}}/>

           {/* To-do: Add option to update auction images */}
           <EditButtons/>
        </form>
    );

    function handleSubmit(event){
        event.preventDefault();

        const tags = [];
        const tags_obj=tagsRef.current.tags;
        for(const tag in tags_obj) {
            tags.push(tags_obj[tag].name);
        }

        updateAuction(event,tags,auction.pk)
        .catch(function (error) {
            if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
            } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
            } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
            }
            console.log(error.config);
        });
    };
}

function UpdateAuction({auction}){
    return(
        <>
            <BackButton/>
            <UpdateAuctionForm auction={auction}/>
        </>
    );
}

export default UpdateAuction;