import {useContext,useRef,useState} from 'react';
import { useNavigate } from 'react-router-dom';
import RequestContext from '../requests';
import moment from 'moment'

import {BackButton,TagForm,MapForm} from '../components/forms';

function CreateAuctionForm(){
    const {createAuction} = useContext(RequestContext);
    const position = useRef();
    const tagsRef = useRef();
    const navigate = useNavigate();
    const [errors,setErrors] = useState({
        categories:'Auction must have at least one category.',
        start_date:'',
        end_date:'',
    });

    return(
        <form onSubmit={handleSubmit}>
            <h3>Create Auction</h3>
            <label htmlFor="auction-name" className='required'> Name </label>
            <input type="text" className="form-control" name="name" id="auction-name" required/>
            <div>
                <TagForm ref={tagsRef} required={true}/>
                <div className="invalid-feedback" id="invalid-categories">
                    {errors.categories}
                </div>
            </div>
            <div className="col-sm-5">
                <label htmlFor="auction-start_bid" className='required'> Starting Bid </label>
                <div className="input-group" id="auction-start_bid">
                    <div className="input-group-text">$</div>
                    <input type="number" placeholder="0.00" step="0.01" min="0" className="form-control no-spinbox" name="start_bid" required/>
                </div>
            </div>
            <label htmlFor="auction-location" className='required'> Location </label>
            <input type="text" className="form-control" name="location" id="auction-location" required/>
            <label htmlFor="auction-country" className='required'> Country </label>
            <input type="text" className="form-control" name="country" id="auction-country" required/>
            <div>
                <label htmlFor="auction-start_date" className='required'> Start date </label>
                <input type="datetime-local" className="form-control" name="start_date" id="auction-start_date" required/>
                <div className="invalid-feedback" id="invalid-categories">
                    {errors.start_date}
                </div>
            </div>
            <div>
                <label htmlFor="auction-end_date" className='required'> End date </label>
                <input type="datetime-local" className="form-control" name="end_date" id="auction-end_date" required/>
                <div className="invalid-feedback" id="invalid-categories">
                    {errors.end_date}
                </div>
            </div>
            <label htmlFor="auction-description"> Description </label>
            <textarea className="form-control" name="description" id="auction-description" />
            <MapForm ref={position}/>

            <label htmlFor="auction-images"> Images </label>
            <input type="file" className="form-control" name="images" id="auction-images" accept="image/png,image/jpeg" multiple/>

            <div className="alert alert-danger hide" role="alert" id="alert">
                <i className="bi bi-exclamation-triangle-fill"></i> There was an unexpected error in the submission
            </div>
            <button type="submit" className="btn btn-primary"> 
                <i class="bi bi-upload"></i> Create
            </button>
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

        createAuction(event,tags)
        .then(res => {
            navigate('/manage',{replace:true});
        })
        .catch(function (error) {
            document.getElementById('alert').className = "alert alert-danger fade show";
        });
    };
}

function CreateAuction(){
    return(
        <>
            <BackButton/>
            <CreateAuctionForm/>
        </>
    );
}

export default CreateAuction;