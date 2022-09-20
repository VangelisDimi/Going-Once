import {useState,useEffect,useImperativeHandle,forwardRef} from 'react';
import {useNavigate} from 'react-router-dom';
import './forms.css'

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


function BackButton(){
    const navigate = useNavigate();

    return(
        <button type="button" onClick={()=>navigate('../')} className="btn-close" aria-label="Close">
        </button>
    );
}

export {BackButton,TagForm}