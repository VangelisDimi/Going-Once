function NotFound(){
    return(
        <div>
            <div>Page not found.</div>
        </div>
    );
}

function NoPermission(){
    return(
        <div>
            You can't access this page.
        </div>
    );
}

function NotApproved(){
    return(
        <div className="alert alert-danger" role="alert">
            <i className="bi bi-exclamation-triangle-fill"></i> You haven't been approved by an admin yet.
        </div>
    );
}

export {NotFound,NoPermission,NotApproved};