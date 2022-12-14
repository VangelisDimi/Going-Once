import {useContext,useRef,useState} from 'react';
import { useNavigate } from 'react-router-dom';
import RequestContext from '../requests';
import {BackButton,TagForm,MapForm} from '../components/forms';
import moment from 'moment'

//Form to change auction info

function UpdateAuctionForm({auction}){
    const position = useRef();
    const tagsRef = useRef();
    const {updateAuction,deleteAuction} = useContext(RequestContext);
    const start_date =  moment(auction.started).format("YYYY-MM-DDTHH:mm")
    const end_date =  moment(auction.ends).format("YYYY-MM-DDTHH:mm")
    const navigate = useNavigate();
    const [errors,setErrors] = useState({
        categories:'Auction must have at least one category.',
        start_date:'',
        end_date:'',
    });

    function handleDelete(event){
        document.getElementById('alert').className = "alert alert-danger hide";
        deleteAuction(auction.pk)
        .then(res => {
            navigate('/manage',{replace:true});
        })
        .catch((error) => {
            document.getElementById('alert').className = "alert alert-danger fade show";
        });
    }

    function Modal(){
        return(
            <div className="modal fade" id="Modal" tabIndex="-1" aria-labelledby="ModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Delete</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        Confirm auction deletion.
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" className="btn btn-danger" onClick={handleDelete} data-bs-dismiss="modal">Delete</button>
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
                    <div className="alert alert-danger hide" role="alert" id="alert">
                        <i className="bi bi-exclamation-triangle-fill"></i> There was an unexpected error in the submission
                    </div>

                    <button type="submit" className="btn btn-primary">
                        <i className="bi bi-upload"></i> Save
                    </button>
                    <button type="button" className="btn btn-danger btn-margin" data-bs-toggle="modal" data-bs-target="#Modal"> 
                        <i className="bi bi-x-lg"></i> Delete
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
                        <i className="bi bi-upload"></i> Save
                    </button>
                    <button type="button" className="btn btn-danger btn-margin" disabled> 
                        <i className="bi bi-x-lg"></i> Delete
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
            <h3>Update Auction</h3>
            <label htmlFor="auction-name" className='required'> Name </label>
            <input type="text" className="form-control" name="name" id="auction-name" defaultValue={auction.name} required/>
            <div>
                <TagForm ref={tagsRef} tags={auction.categories} required={true}/>
                <div className="invalid-feedback" id="invalid-categories">
                    {errors.categories}
                </div>
            </div>
            <div className="col-sm-5">
                <label htmlFor="auction-start_bid" className='required'> Starting Bid </label>
                <div className="input-group" id="auction-start_bid">
                    <div className="input-group-text">$</div>
                    <input type="number" placeholder="0.00" step="0.01" min="0" className="form-control no-spinbox" name="start_bid" defaultValue={auction.first_bid} required/>
                </div>
            </div>
            <label htmlFor="auction-location" className='required'> Location </label>
            <input type="text" className="form-control" name="location" id="auction-location" defaultValue={auction.location} required/>
            <label htmlFor="auction-country" className='required'> Country </label>
            <input type="text" className="form-control" name="country" id="auction-country" defaultValue={auction.country} required/>
            <div>
                <label htmlFor="auction-start_date" className='required'> Start date </label>
                <input type="datetime-local" className="form-control" name="start_date" id="auction-start_date" defaultValue={start_date} required/>
                <div className="invalid-feedback" id="invalid-categories">
                    {errors.start_date}
                </div>
            </div>
            <div>
                <label htmlFor="auction-end_date" className='required'> End date </label>
                <input type="datetime-local" className="form-control" name="end_date" id="auction-end_date" defaultValue={end_date} required/>
                <div className="invalid-feedback" id="invalid-categories">
                    {errors.end_date}
                </div>
            </div>
            <label htmlFor="auction-description"> Description </label>
            <textarea className="form-control" name="description" id="auction-description" defaultValue={auction.description}/>
            <MapForm ref={position} position={{"lat": auction.latitude,"lng" : auction.longitude}}/>

           {/* To-do: Add option to update auction images */}
           <EditButtons/>
        </form>
    );

    function handleSubmit(event){
        event.preventDefault();
        document.getElementById('alert').className = "alert alert-danger hide";
        event.target.categories.className = "form-control"
        event.target.start_date.className = "form-control"
        event.target.end_date.className = "form-control"
        
        const tags = [];
        const tags_obj=tagsRef.current.tags;
        for(const tag in tags_obj) {
            tags.push(tags_obj[tag].name);
        }

        //Clientside validation
        if (tags.length ===0)  {
            event.target.categories.className = "form-control is-invalid"
            return;
        }

        const start_date=moment(event.target.start_date.value)
        const end_date=moment(event.target.end_date.value)
        const now = moment();
        if  (start_date.diff(now, 'minutes') < -5){
            event.target.start_date.className = "form-control is-invalid"
            errors.start_date = "Auction can't start before now"
            setErrors({...errors});
            return;
        }
        else if(end_date<start_date){
            event.target.end_date.className = "form-control is-invalid"
            errors.end_date = "End date can't be before start date."
            setErrors({...errors});
            return;
        }
        else if(end_date.diff(start_date, 'hours')<1){
            event.target.end_date.className = "form-control is-invalid"
            errors.end_date = "Auction can't last less than one hour."
            setErrors({...errors});
            return;
        }

        updateAuction(event,tags,auction.pk)
        .then(res => {
            navigate('../',{replace:true});
        })
        .catch(function (error) {
            document.getElementById('alert').className = "alert alert-danger fade show";
        });
    };
}

function UpdateAuction({auction}){
    if(auction.status==="closed"){
        return(
            <>Auction is closed</>
        );
    }

    return(
        <>
            <BackButton/>
            <UpdateAuctionForm auction={auction}/>
        </>
    );
}

export default UpdateAuction;