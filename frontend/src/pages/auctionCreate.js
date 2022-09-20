import {useState,useContext,useRef,useImperativeHandle,forwardRef} from 'react';
import {CreationMap} from '../components/leaflet'
import RequestContext from '../requests';
import './auctionCreate.css'
import Collapse from 'react-bootstrap/Collapse';

import {BackButton,TagForm} from '../components/forms';

const MapForm = forwardRef((props, ref) => {
    const [position,setPosition] = useState({lat:'',lng:''});
    const [mapShow,setMapShow] = useState(false);
    const collapseElem = useRef();

    function RemoveMarkerButton(){
        function removeMarker(){
            setPosition({lat:'',lng:''});
        }

        return (
            <button onClick={removeMarker} className="btn btn-secondary" disabled={!(position.lat && position.lng)}>
                Remove position
            </button>
        );
    }


    function ShowMapButton(){
        function toggleMap(){
            setMapShow(!mapShow);
        }

        return (
            <button onClick={toggleMap} className="btn btn-success dropdown-toggle dropdown-change" aria-expanded={mapShow}>
                Map
            </button>
        );
    }

    function handleExpand(event){
        collapseElem.current.scrollIntoView({
            behavior: "auto",
            block: "end",
            inline: "nearest",
        });
    }

    useImperativeHandle(ref, () => ({
        position: position
    }), [position]);

    return(
        <>
            <div className="col-sm-5">
                <label htmlFor="geo_location"> Geographic Location </label>
                <div className="input-group" name="geo_location">
                    <div className="input-group-text">N-S</div>
                    <input type="text" className="form-control" placeholder="Latitude" name="lat" disabled readOnly value={position.lat}/>
                    <div className="input-group-text">E-W</div>
                    <input type="text" className="form-control" placeholder="Longtitude" name="lng" disabled readOnly value={position.lng}/>
                    <RemoveMarkerButton/>
                    <ShowMapButton/>
                </div>
            </div>

            <Collapse in={mapShow} onEntered={handleExpand}>
                <div className='container' ref={collapseElem}>
                    <CreationMap position={position} setPosition={setPosition}/>
                </div>
            </Collapse>
        </>
    );
});

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

            <button type="submit" className="btn btn-primary">Create</button>
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