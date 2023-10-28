import { useState } from "react";
import { createContext } from "react";

const UserContext = createContext({ email: 'quan', auth: false })

const UserProvider = ({ children }) => {
    const [user, setUser] = useState({ email: '', auth: false })

    const loginContext = (email, token) => {
        setUser(user => ({ email: email, auth: true }))
        localStorage.setItem("token", token)
        localStorage.setItem("email", email)
    }

    const logoutContext = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("email")
        setUser(user => ({ email: '', auth: false }))
    }
    return (
        <UserContext.Provider value={{ user, loginContext, logoutContext }}>
            {children}
        </UserContext.Provider>
    )
}

export { UserContext, UserProvider }