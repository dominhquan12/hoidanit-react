import { useContext } from "react";
import { Alert } from "react-bootstrap";
import { UserContext } from "../context/UserContext";

function PrivateRoute(props) {
    const { user } = useContext(UserContext)
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