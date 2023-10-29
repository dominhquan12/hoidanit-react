import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { handleLoginRedux } from "../redux/actions/userAction";
import { useDispatch, useSelector } from "react-redux";
function Login() {
    let navigate = useNavigate();
    const dispath = useDispatch()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isShowPassword, setIsShowPassword] = useState(false)
    const isShowLoading = useSelector(state => state.user.isLoading)
    const account = useSelector(state => state.user.account)
    const handleSubmit = async (event) => {
        event.preventDefault()
        if (!email || !password) {
            toast.error("Email or password is required")
            return
        }
        dispath(handleLoginRedux(email, password))
    }

    useEffect(() => {
        if (account && account.auth === true) {
            navigate("/")
        }
        return () => {

        };
    }, [account]);
    return (
        <div className="mx-auto mt-4 col-lg-6 col-12 ">
            <h1 className="text-center">Login</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group my-3">
                    <label htmlFor="email">Email address eve.holt@reqres.in</label>
                    <input value={email} type="text" className="form-control"
                        id="email" placeholder="Enter email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="form-group my-3 position-relative">
                    <label htmlFor="password">Password</label>
                    <input value={password} type={isShowPassword === true ? "text" : "password"}
                        id="password" className="form-control"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <i className={isShowPassword ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}
                        onClick={() => setIsShowPassword(!isShowPassword)}>
                    </i>
                </div>
                <div className="form-group mt-4 text-center">
                    <button type="submit" disabled={email && password ? false : true}
                        className="btn btn-primary w-100">
                        {isShowLoading && <i className="fa-solid fa-sync fa-spin me-2"></i>}
                        Login
                    </button>
                </div>

            </form>
            <div className="form-group my-3 text-center">
                <Link to="/" className="btn">
                    <i className="fa-solid fa-angles-left me-2"></i>
                    Go back
                </Link>
            </div>
        </div>
    );
}

export default Login;