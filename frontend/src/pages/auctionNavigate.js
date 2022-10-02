import { useEffect,useContext,useState,useRef } from 'react';
import {useSearchParams,useParams} from 'react-router-dom';
import RequestContext from '../requests';
import {AuctionList,NoAuctions} from '../components/auctions'
import {NavigatePages} from '../components/pagination'
import {TagForm} from '../components/forms'

//Auction navigation main page

function PriceForm({min,max}){
    return(
        <>
            <div className="col-sm-5">
                <label htmlFor="search-price_range" className="form-label"> Price range </label>
                <div className="input-group" id="search-price_range">
                    <div className="input-group-text">Min</div>
                    <input type="number" className="form-control" name='min_price' defaultValue={min}></input>
                    <div className="input-group-text">Max</div>
                    <input type="number" className="form-control" name='max_price' defaultValue={max}></input>
                </div>
            </div>
        </>
    );
}

function DescriptionForm({value}){
    return(
        <>
            <label htmlFor="search-description"> Description </label>
            <textarea className="form-control" name="description" id="search-description" placeholder='Search based on description' defaultValue={value}/>
        </>
    );
}

function LocationForm({value}){
    return(
        <>
            <label htmlFor="search-location"> Location </label>
            <input type="text" className="form-control" name="location" id="search-location" placeholder='Search based on location' defaultValue={value}/>
        </>
    );
}

function SideBar({params,setParams}){
    const tagsRef = useRef();

    function handleSubmit(event){
        event.preventDefault();
        const tags = [];
        const tags_obj=tagsRef.current.tags;
        for(const tag in tags_obj) {
            tags.push(tags_obj[tag].name);
        }

        params.delete("category");
        for(const tag of tags){
            params.append("category",tag);
        }
        params.set("location",event.target.location.value);
        params.set("description",event.target.description.value);
        params.set("min_price",event.target.min_price.value);
        params.set("max_price",event.target.max_price.value);
        
        if (tags.length===0) params.delete("category");
        if (event.target.location.value === '') params.delete("location");
        if (event.target.description.value === '') params.delete("description");
        if (parseInt(event.target.min_price.value) === 0) params.delete("min_price");
        if (parseInt(event.target.max_price.value) === 9999) params.delete("max_price");
        setParams(params);
    }

    const tags = []
    for(var tag of params.getAll('category')){
        tags.push({"name":tag})
    }

    return(
        <form onSubmit={handleSubmit}>
            <TagForm ref={tagsRef} tags={tags}/>
            <LocationForm value={params.get('location')}/>
            <DescriptionForm value={params.get('description')}/>
            <PriceForm min={params.get('min_price') ? params.get('min_price') :0} max={params.get('max_price') ? params.get('max_price') :9999}/>
            <button type="submit" className="btn btn-primary">
                Apply
            </button>
        </form>
    );
}

function AuctionNavigate(){
    const {getAuctionNavigateList} = useContext(RequestContext);
    const [searchParams, setSearchParams] = useSearchParams({});
    const [page,setPage] = useState();
    const {parent_category} = useParams();

    useEffect(() => {
        const page = (searchParams.get("page") ? searchParams.get("page") : 1);
        const items =  (searchParams.get("items") ? searchParams.get("items") : 5);
        const categories = searchParams.getAll("category");
        const location =  searchParams.get("location");
        const description =  searchParams.get("description");
        const min_price =  (searchParams.get("min_price") ? searchParams.get("min_price") : 0);
        const max_price =  (searchParams.get("max_price") ? searchParams.get("max_price") : 9999);

        getAuctionNavigateList(page,items,categories,location,description,min_price,max_price,parent_category)
        .then(res => {
            setPage(JSON.parse(JSON.stringify(res.data)));
            window.scrollTo(0, 0);
        });
    },[searchParams,getAuctionNavigateList,setSearchParams])

    return(
        <>
            {parent_category ? <h3>{parent_category}</h3> : <h3>Browsing all auctions</h3>}
            <SideBar params={searchParams} setParams={setSearchParams}/>
            {page ? <NavigatePages pages={page.total_pages} current={page.current} params={searchParams} setParams={setSearchParams}/> : null}
            {page && page.results.length>0 ? <AuctionList auctions={page.results}/> : <NoAuctions/>}
            {page ? <NavigatePages pages={page.total_pages} current={page.current} params={searchParams} setParams={setSearchParams}/> : null}
        </>
    );
}

export default AuctionNavigate;