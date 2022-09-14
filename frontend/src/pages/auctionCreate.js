import {useState,useContext,useEffect,useRef,useImperativeHandle,forwardRef} from 'react';
import {CreationMap} from '../components/leaflet'
import {useNavigate} from 'react-router-dom';
import RequestContext from '../requests';
import './auctionCreate.css'

import Collapse from 'react-bootstrap/Collapse';

const TagForm = forwardRef((props, ref) => {
    const [tags,setTags] = useState({});
    const [elements,setElements] = useState([]);

    function removeTag(event){
        const tag_id = event.target.parentNode.getAttribute("tag_id");
        delete tags[tag_id];
        setTags({...tags});
    }

    function keyPress(event){
        if(event.keyCode === 13 || event.keyCode === 188){
            event.preventDefault();
            const value = event.target.value
            if(value) 
            {
                tags[' ' + value] = {name:value};
                setTags({...tags});
            }
            event.target.value='';
        }
    }

    function Tag({tag,tag_id}){
        return(
            <span className="badge rounded-pill bg-primary" tag_id={tag_id}>
                {tag}
                <button type="button" className="btn-close btn-close-sm btn-close-white shadow-none" aria-label="Close" onClick={removeTag}/>
            </span>
        );
    }

    useImperativeHandle(ref, () => ({
        tags: tags
    }), [tags]);

    useEffect(() => {
        const elements_temp=[];

        for(let tag in tags){
            elements_temp.push(
                <Tag tag={tags[tag].name} tag_id={tag} key={tag}/>
            );
        }

        setElements(elements_temp);
    },[tags]);

    return (
        <>
            <label htmlFor="auction-categories"> Categories </label>
            {elements}
            <input autoComplete="off" type="text" className="form-control" name="categories" id="auction-categories" placeholder="Enter or comma to add a new category" onKeyDown={keyPress}/>
        </>
    );
});

const MapForm = forwardRef((props, ref) => {
    const [position,setPosition] = useState({lat:'',lng:''});
    const [mapShow,setMapShow] = useState(false);

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
            <button onClick={toggleMap} className="btn btn-success dropdown-toggle" aria-expanded={mapShow}>
                Map
            </button>
        );
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

            <Collapse in={mapShow}>
                <div className='container'>
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

function BackButton(){
    const navigate = useNavigate();

    return(
        <button type="button" onClick={()=>navigate('/manage')} className="btn-close" aria-label="Close">
        </button>
    );
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