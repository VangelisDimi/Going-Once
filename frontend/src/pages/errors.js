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
        <div class="alert alert-danger" role="alert">
            <i class="bi bi-exclamation-triangle-fill"></i> You haven't been approved by an admin yet.
        </div>
    );
}

export {NotFound,NoPermission,NotApproved};