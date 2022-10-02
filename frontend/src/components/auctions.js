import { useEffect,useState,useContext} from 'react';
import {DisplayMap} from '../components/leaflet'
import AuthContext from '../auth';
import RequestContext from '../requests'
import './auctions.css'

function Images({image_list}){
    const [element,setElement] = useState([]);
    const IMG_URL = 'https://localhost:8000/media';

    useEffect(() => {
        let element_temp = null;
        
        if(image_list.length===1)
        {
            element_temp=( 
                <img src={IMG_URL + "/" + image_list[0].image} className="card-img-top" alt="Auction"></img>
            );
        }
        else if(image_list.length>1){
            let indicators = []
            let images=[]
            
            let i=0;
            for(let image of image_list){
                indicators.push(
                    <button type="button" data-bs-target="#carouselIndicators" data-bs-slide-to={i.toString()} className={(i===0 ? "active" : "")} aria-current={(i===0 ? "true" : "")} aria-label={"Slide" + (i+1).toString()} key={image.image}>
                    </button>
                );
                images.push(
                    <div className={"carousel-item" +  (i===0 ? " active" : "")} key={image.image}>
                        <img src={IMG_URL + "/" + image.image} className="card-img-top" alt={"Image" + (i+1).toString()}/>
                    </div>
                )
                i++;
            }

            element_temp=(
                <div id="carouselIndicators" className="carousel slide" data-bs-ride="true">
                    <div className="carousel-indicators">
                        {indicators}
                    </div>
                    <div className="carousel-inner">
                        {images}
                    </div>
                    <button className="carousel-control-prev" type="button" data-bs-target="#carouselIndicators" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#carouselIndicators" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            );
        }
        setElement(element_temp);
    },[image_list])

    return(
        <>
            {element}
        </>
    );
}

function AuctionDate({starts,ends,status}){
    const [date,setDate] = useState();

    useEffect(() => {
        const start_date = new Date(starts);
        const end_date = new Date(ends);
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
        
    },[starts,ends,status])

    return(<>{date}</>);
}

function AuctionPrice({start,current,num_bids,own_bid,status}){
    if(num_bids === 0){
        return(
            <>
                Starts at: {start}$ <small className="text-muted" style={{margin:"1em"}}> {num_bids} bids</small>
            </>
        );
    }
    else{
        if (status==='closed'){
            return(
                <>
                    Sold at: {current} $ {own_bid ? <span className="badge rounded-pill text-bg-success">Your bid</span> : null}
                    <small className="text-muted" style={{margin:"1em"}}> {num_bids} bids</small>
                </>
            );
        }

        return(
            <>
                Currently: {current} $ {own_bid ? <span className="badge rounded-pill text-bg-success">Your bid</span> : null}
                <small className="text-muted" style={{margin:"1em"}}> {num_bids} bids</small>
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

function ExportAuction({auction_id}){
    const {exportJSON,exportXML} = useContext(RequestContext);
    const {authorized,userInfo} = useContext(AuthContext);

    function handleExportJSON(){
        exportJSON(auction_id)
        .then(res => {
            //Download .json file
            //https://stackoverflow.com/questions/55613438/reactwrite-to-json-file-or-export-download-no-server
            // create file in browser
            const fileName = `auction_${auction_id}`;
            const data = JSON.stringify(res.data,null,4)
            const blob = new Blob([data], {type: 'application/json;charset=utf-8;'});
            const href = URL.createObjectURL(blob);

            // create "a" HTLM element with href to file
            const link = document.createElement("a");
            link.href = href;
            link.download = fileName + ".json";
            document.body.appendChild(link);
            link.click();

            // clean up "a" element & remove ObjectURL
            document.body.removeChild(link);
            URL.revokeObjectURL(href);
        });
    }

    function handleExportXML(){
        exportXML(auction_id)
        .then(res => {
            //Download .json file
            //https://stackoverflow.com/questions/55613438/reactwrite-to-json-file-or-export-download-no-server
            // create file in browser
            const fileName = `auction_${auction_id}`;
            const data = res.data
            const blob = new Blob([data], {type: 'application/xml;charset=utf-8;'});
            const href = URL.createObjectURL(blob);

            // create "a" HTLM element with href to file
            const link = document.createElement("a");
            link.href = href;
            link.download = fileName + ".xml";
            document.body.appendChild(link);
            link.click();

            // clean up "a" element & remove ObjectURL
            document.body.removeChild(link);
            URL.revokeObjectURL(href);
        });
    }

    if(authorized===false || userInfo.is_staff===false || userInfo.is_approved===false) return null;

    return(
        <div className="card-header">
            <button type="button" className="btn btn-success btn-margin" onClick={handleExportJSON}>
                <i className="bi bi-braces"></i> .json
            </button>
            <button type="button" className="btn btn-warning btn-margin" onClick={handleExportXML}> 
                <i className="bi bi-code-slash"></i> .xml
            </button>
        </div>
    );
}

function AuctionUsername({username}){
    const {userInfo} = useContext(AuthContext);

    return(
        <p className="card-text">
            <small className="text-muted">
                    <i className="bi bi-person-fill bi-margin"/>
                    {username} 
                    {username===userInfo.username ? <span className="badge rounded-pill bg-secondary bg-small">You</span> : null}
            </small>
        </p>
    );
}

function NoAuctions(){
    return(
        <>
            No auctions found.
        </>
    )
}

function AuctionList({auctions}){
    const [elements,setElements] = useState([]);

    useEffect(() => {
        const elements_temp=[]
        for (let auction of auctions){
            elements_temp.push(
                <div className="card" key={auction.pk}>
                    {auction.images.length !== 0 ? <Images image_list={auction.images}/> : null}
                    <ExportAuction auction_id={auction.pk}/>
                    <div className="card-body">
                        <h5 className="card-title">{auction.name} <AuctionStatus status={auction.status}/></h5>
                        <AuctionUsername username={auction.seller_username}/>
                        <p className="card-text"> <i className="bi bi-geo-alt-fill"></i> {auction.location},{auction.country}</p>
                        <p className="card-text"> <AuctionPrice start={auction.first_bid} current={auction.current_bid} num_bids={auction.num_bids} own_bid={auction.own_bid} status={auction.status}/></p>
                        <p className="card-text"><AuctionCategories categories={auction.categories}/></p>
                        <a href={`/auction/${auction.pk}`} className="link-primary">View more</a>
                    </div>
                    <div className="card-footer">
                        <small className="text-muted"><AuctionDate starts={auction.started} ends={auction.ends} status={auction.status}/></small>
                    </div>
                </div>
            );
        }

        setElements(elements_temp);
    },[auctions])

    return(
        <>
            {elements}
        </>
    )
}

export {Images,AuctionDate,AuctionPrice,AuctionCategories,AuctionMap,AuctionStatus,AuctionList,AuctionUsername,ExportAuction,NoAuctions}