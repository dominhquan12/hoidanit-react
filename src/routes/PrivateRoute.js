import { Alert } from "react-bootstrap";
import { useSelector } from "react-redux";

function PrivateRoute(props) {
    const user = useSelector(state => state.user.account)
    if (user && !user.auth) {
        return (
            <>
                <Alert variant="danger">
                    <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
                    <p>
                        You don't have permission
                    </p>
                </Alert>
            </>
        )
    }
    return (
        <>
            {props.children}
        </>
    );
}

export default PrivateRoute;