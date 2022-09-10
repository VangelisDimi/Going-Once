import { useState} from 'react';
import {CreationMap} from '../components/leaflet'


function CreateAuctionForm(){
    const [position,setPosition] = useState({lat:'',lng:''});

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

    return(
        <form onSubmit={handleSubmit}>
            <div className="col-sm-5">
                <div className="input-group">
                    <div className="input-group-text">N-S</div>
                    <input type="text" className="form-control" placeholder="Latitude" name="lat" disabled readOnly value={position.lat}/>
                    <div className="input-group-text">E-W</div>
                    <input type="text" className="form-control" placeholder="Longtitude" name="lng" disabled readOnly value={position.lng}/>
                    <RemoveMarkerButton/>
                </div>
            </div>
            <CreationMap position={position} setPosition={setPosition}/>
            <button type="submit" className="btn btn-primary">Create</button>
        </form>
    );

    function handleSubmit(event){
        event.preventDefault();
    };
}

export default CreateAuctionForm;