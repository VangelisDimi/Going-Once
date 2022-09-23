import {useContext,useRef} from 'react';
import RequestContext from '../requests';
import './auctionCreate.css'

import {BackButton,TagForm,MapForm} from '../components/forms';

function CreateAuctionForm(){
    const {createAuction} = useContext(RequestContext);
    const position = useRef();
    const tagsRef = useRef();

    return(
        <form onSubmit={handleSubmit}>
            <h3>Create Auction</h3>
            <label htmlFor="auction-name"> Name </label>
            <input type="text" className="form-control" name="name" id="auction-name"/>
            <TagForm ref={tagsRef}/>
            <div className="col-sm-5">
                <label htmlFor="auction-start_bid"> Starting Bid </label>
                <div className="input-group" name="geo-location" id="auction-start_bid">
                    <div className="input-group-text">$</div>
                    <input type="number" placeholder="0.00" className="form-control no-spinbox" name="start_bid" />
                </div>
            </div>
            <label htmlFor="auction-location"> Location </label>
            <input type="text" className="form-control" name="location" id="auction-location"/>
            <label htmlFor="auction-country"> Country </label>
            <input type="text" className="form-control" name="country" id="auction-country"/>
            <label htmlFor="auction-start_date"> Start date </label>
            <input type="datetime-local" className="form-control" name="start_date" id="auction-start_date"/>
            <label htmlFor="auction-end_date"> End date </label>
            <input type="datetime-local" className="form-control" name="end_date" id="auction-end_date"/>
            <label htmlFor="auction-description"> Description </label>
            <textarea className="form-control" name="description" id="auction-description"/>
            <MapForm ref={position}/>

            <label htmlFor="auction-images"> Images </label>
            <input type="file" className="form-control" name="images" id="auction-images" accept="image/png,image/jpeg" multiple/>

            <button type="submit" className="btn btn-primary"> 
                <i class="bi bi-upload"></i> Create
            </button>
        </form>
    );

    function handleSubmit(event){
        event.preventDefault();

        const tags = [];
        const tags_obj=tagsRef.current.tags;
        for(const tag in tags_obj) {
            tags.push(tags_obj[tag].name);
        }

        createAuction(event,tags)
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

function CreateAuction(){
    return(
        <>
            <BackButton/>
            <CreateAuctionForm/>
        </>
    );
}

export default CreateAuction;