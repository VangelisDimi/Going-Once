import { useEffect,useContext,useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import RequestContext from '../requests';
import {NavigatePages} from '../components/pagination'

function CategoryList({categories}){
    const [elements,setElements] = useState([]);

    useEffect(() => {
        const elements_temp=[]
        for (let category of categories){
            elements_temp.push(
                <div className="card" key={category.name}>
                    <a href={`/navigate/categories/${category.name}`} className="list-group-item list-group-item-action">{category.name}</a>
                </div>
            );
        }

        setElements(elements_temp);
    },[categories])

    return(
        <ul className="list-group">
            {elements}
        </ul>
    )
}

function CategoryNavigate(){
    const {getCategoryList} = useContext(RequestContext);
    const [searchParams, setSearchParams] = useSearchParams({});
    const [page,setPage] = useState();

    useEffect(() => {
        const page = (searchParams.get("page") ? searchParams.get("page") : 1);
        const items =  (searchParams.get("items") ? searchParams.get("items") : 5);

        getCategoryList(page,items)
        .then(res => {
            setPage(JSON.parse(JSON.stringify(res.data)));
            window.scrollTo(0, 0);
        });
    },[searchParams,getCategoryList,setSearchParams])


    return(
        <div>
        <ul className="list-group">
             <a href='/navigate/all' className="list-group-item list-group-item-action">Browse all auctions</a>
        </ul>

        <h4>Browse by category:</h4>
        {page && page.results.length>0 ? <CategoryList categories={page.results}/> : <>No categories found.</>}
        {page ? <NavigatePages pages={page.total_pages} current={page.current} params={searchParams} setParams={setSearchParams}/> : null}
        </div>
    );
}

export default CategoryNavigate