

interface ErrorAlertProps {
    errorMsg: string ;
    onRetry: () => void;
    }




const  ErrorAlert  = ({errorMsg, onRetry}: ErrorAlertProps ) => {
    
    return  (<div
            className="alert alert-danger"
            style={{ display: errorMsg ? "block" : "none" }}
            >
            {errorMsg}
            <button className="btn btn-primary"
            onClick={() => {
                onRetry();
            }}>Retry</button>
            </div>
        );
}


export default ErrorAlert;
