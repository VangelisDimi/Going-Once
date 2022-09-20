import { useEffect,useState} from 'react';
import {DisplayMap} from '../components/leaflet'
import './auctions.css'

function Images({image_list}){
    const [element,setElement] = useState([]);
    const IMG_URL = 'http://localhost:8000/media';

    useEffect(() => {
        let element_temp = null;
        
        if(image_list.length===1)
        {
            element_temp=( 
                <img src={IMG_URL + "/" + image_list[0].image} class="card-img-top" alt="Auction Image"></img>
            );
        }
        else if(image_list.length>1){
            let indicators = []
            let images=[]
            
            let i=0;
            for(let image of image_list){
                indicators.push(
                    <button type="button" data-bs-target="#carouselIndicators" data-bs-slide-to={i.toString()} class={(i===0 ? "active" : "")} aria-current={(i===0 ? "true" : "")} aria-label={"Slide" + (i+1).toString()}>
                    </button>
                );
                images.push(
                    <div class={"carousel-item" +  (i===0 ? " active" : "")}>
                        <img src={IMG_URL + "/" + image_list[i].image} class="card-img-top" alt={"Image" + (i+1).toString()}/>
                    </div>
                )
                i++;
            }

            element_temp=(
                <div id="carouselIndicators" class="carousel slide" data-bs-ride="true">
                    <div class="carousel-indicators">
                        {indicators}
                    </div>
                    <div class="carousel-inner">
                        {images}
                    </div>
                    <button class="carousel-control-prev" type="button" data-bs-target="#carouselIndicators" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Previous</span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#carouselIndicators" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Next</span>
                    </button>
                </div>
            );
        }
        setElement(element_temp);
    },[])

    return(
        <>
            {element}
        </>
    );
}

function AuctionDate({starts,ends,status}){
    const [today,setToday] = useState();
    const [date,setDate] = useState();

    useEffect(() => {
        const today = new Date();
        const start_date = new Date(starts);
        const end_date =new Date(ends);
        const options = { day: 'numeric', month: 'numeric', year: 'numeric',hour: '2-digit', minute:'2-digit' };
        

        if (status==="pending"){
            setDate(
                <>
                    Starts at {start_date.toLocaleString([],options)} &#8226; Ends at {end_date.toLocaleString([],options)}
                </>
            );
        }
        else if (status==="active"){
            setDate(
                <>
                    Started at {start_date.toLocaleString([],options)} &#8226; Ends at {end_date.toLocaleString([],options)}
                </>
            );
        }
        else if(status==="closed"){
            setDate(
                <>
                     Started at {start_date.toLocaleString([],options)} &#8226; Ended at {end_date.toLocaleString([],options)}
                </>
            );
        }
        
    },[starts,ends])

    return(<>{date}</>);
}

function AuctionPrice({start,current,num_bids}){
    if(num_bids === 0){
        return(
            <>
                Starts at: {start}$ <small class="text-muted" style={{margin:"1em"}}> {num_bids} bids</small>
            </>
        );
    }
    else{
        return(
            <>
                Currently: {current} $ <small class="text-muted" style={{margin:"1em"}}> {num_bids} bids</small>
            </>
        );
    }
}

function AuctionCategories({categories}){
    const [elements,setElements] = useState([]);

    useEffect(() => {
        const elements_temp=[]

        for (let category of categories){
            elements_temp.push(
                <span className="badge bg-primary" key={category.name}>{category.name}</span>
            );
        }

        setElements(elements_temp);
    },[categories])

    return(
        <>
            {elements}
        </>
    )

}

function AuctionMap({position}){
    return(
        <div>
            {position.lat && position.lng ? <DisplayMap position={position}/> : null}
        </div>
    );
}

function AuctionStatus({status}){
    if(status==="pending"){
        return(
            <span className="badge bg-secondary">Not started</span>
        );
    }
    else if(status==="active"){
        return(
            <span className="badge bg-success">Active</span>
        );
    }
    else if(status==="closed"){
        return(
            <span className="badge bg-danger">Closed</span>
        );
    }
}

export {Images,AuctionDate,AuctionPrice,AuctionCategories,AuctionMap,AuctionStatus}