import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import logo from '../assets/images/logo192.png'
import { useContext } from 'react';
import { UserContext } from '../context/UserContext'
function Header(props) {
  const { logoutContext, user } = useContext(UserContext)

  // const [hideHeader, setHideHeader] = useState(false)

  // useEffect(() => {
  //   if (window.location.pathname === '/login') {
  //     setHideHeader(true)
  //   }
  //   return () => {
  //   };
  // }, []);

  const navigate = useNavigate()
  let location = useLocation();
  const handleLogout = () => {
    logoutContext()
    navigate("/")
    toast("Logout successful!")
  }
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/">
          <img
            alt=""
            src={logo}
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{' '}
          App
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {
           ((user && user.auth)|| window.location.pathname === '/') &&
            <>
              <Nav className="me-auto" activeKey={location.pathname}>
                <NavLink className="nav-link" to="/">Home</NavLink>
                <NavLink className="nav-link" to="/users">Manage users</NavLink>
              </Nav>
              <Nav>
                {user && user.email && <span className='nav-link' >Welcome <strong>{user.email.slice(0, 3)}</strong></span>}
                <NavDropdown title="Setting" id="basic-nav-dropdown" style={{ left: '-20px', marginLeft:'20px'}}>
                  {
                    user && user.auth === true
                      ? <NavDropdown.Item className="nav-link ps-4" onClick={handleLogout}>Logout</NavDropdown.Item>
                      : <NavLink className="nav-link ps-4" to="/login">Login</NavLink>
                  }
                </NavDropdown>
              </Nav>
            </>
          }
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;