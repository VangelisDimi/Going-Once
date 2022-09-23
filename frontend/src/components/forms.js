import {useState,useEffect,useImperativeHandle,forwardRef,useRef} from 'react';
import {CreationMap} from './leaflet'
import {useNavigate} from 'react-router-dom';
import Collapse from 'react-bootstrap/Collapse';
import './forms.css'

const TagForm = forwardRef((props, ref) => {
    const [tags,setTags] = useState(props.tags ? props.tags : {});
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
            <span className="badge bg-primary" tag_id={tag_id}>
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
    const [position,setPosition] = useState(props.position ? props.position : {lat:'',lng:''});
    const [mapShow,setMapShow] = useState(false);
    const collapseElem = useRef();

    function RemoveMarkerButton(){
        function removeMarker(){
            setPosition({lat:'',lng:''});
        }

        return (
            <button type="button" onClick={removeMarker} className="btn btn-secondary" disabled={!(position.lat && position.lng)}>
                Remove position
            </button>
        );
    }


    function ShowMapButton(){
        function toggleMap(){
            setMapShow(!mapShow);
        }

        return (
            <button type="button" onClick={toggleMap} className="btn btn-success dropdown-toggle dropdown-change" aria-expanded={mapShow}>
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


function BackButton(){
    const navigate = useNavigate();

    return(
        <button type="button" onClick={()=>navigate('../')} className="btn-close" aria-label="Close">
        </button>
    );
}

export {BackButton,TagForm,MapForm}