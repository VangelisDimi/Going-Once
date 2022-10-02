function ErrorModal({children,id="ErrorModal"}){
    return(
        <div className="modal fade" id={id} tabIndex="-1" role="dialog" aria-labelledby="ModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Error</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
                <div className="alert alert-danger">
                    <i className="bi bi-exclamation-triangle-fill"></i> {children}
                </div>
            </div>
            </div>
        </div>
        </div>
    );
}

export {ErrorModal}