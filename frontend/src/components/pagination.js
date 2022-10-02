import { useEffect,useState,useCallback } from 'react';

//Pagination controls
function NavigatePages({pages,current,params,setParams}){
    const [elements,setElements] = useState([]);

    const changePage = useCallback((page) => {
        params.set("page",page);
        if (page === 1) params.delete("page");
        setParams(params);
    },[params,setParams]);

    useEffect(() => {
        const elements_temp=[];

        for(let item=1;item<=pages;item++){
            elements_temp.push(
                <li className={"page-item" + (item===current ? " active" : "")} key={item}>
                    <button type="button" className="page-link" onClick={() => changePage((item))}>
                        {item}
                    </button>
                </li>
            );
        }

        setElements(elements_temp);
    },[current,pages,changePage])

    return(
        <nav aria-label="Page navigation example">
            <ul className="pagination">
                <li className={"page-item" + (current===1 ? " disabled" : "" )}>
                    <button type="button" className="page-link" onClick={()=>changePage(1)} aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                    </button>
                </li>
                <li className={"page-item" + (current===1 ? " disabled" : "" )}>
                    <button type="button" className="page-link" onClick={()=>changePage((current-1))} aria-label="Next">
                        <span aria-hidden="true">&lsaquo;</span>
                    </button>
                </li>
                {elements}
                <li className={"page-item" + (current===pages ? " disabled" : "" )}>
                    <button type="button" className="page-link" onClick={()=>changePage((current+1))} aria-label="Next">
                        <span aria-hidden="true">&rsaquo;</span>
                    </button>
                </li>
                <li className={"page-item" + (current===pages ? " disabled" : "" )}>
                    <button type="button" className="page-link" onClick={()=>changePage("last")} aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                    </button>
                </li>
            </ul>
        </nav>
    );
}

export {NavigatePages}