import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginAPI } from "../services/UserService"
import { useContext } from 'react';
import { UserContext } from '../context/UserContext'
function Login() {
    let navigate = useNavigate();
    const { loginContext } = useContext(UserContext)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isShowPassword, setIsShowPassword] = useState(false)
    const [isShowLoading, setIsShowLoading] = useState(false)
    const handleSubmit = async (event) => {
        event.preventDefault()
        if (!email || !password) {
            toast.error("Email or password is required")
            return
        }
        let res = await loginAPI({email: email.trim(), password });
        console.log(">>>>>>>>res", res);
        if (res && res.token) {
            loginContext(email, res.token)
            navigate("/")
        }
        else if (res && res.status === 400) {
            toast(res.data.error)
        }
        setIsShowLoading(false)
    }
    useEffect(() => {
        let token = localStorage.getItem("token")
        if (token) {
            navigate("/")
        }
        return () => {

        };
    }, []);
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