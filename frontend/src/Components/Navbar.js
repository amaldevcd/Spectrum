import { NavLink } from "react-router-dom";
import "./Navbar.css";
import { GiHamburgerMenu } from "react-icons/gi";
import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [showNavbar, setShowNavbar] = useState(false);

  const navbarHandler = () => {
    if (showNavbar === false) {
      setShowNavbar(true);
    } else {
      setShowNavbar(false);
    }
  };
  const logoutHandler = () => {
    localStorage.removeItem("token");
  };

  return (
    <div>
      <div className="navbar">
        <img
          src="/images/Logo.png"
          alt="Logo"
          border="0"
          className="logo_image"
        />
        <div className="navbar_list">
          <ul>
            <li>
              {" "}
              <NavLink
                to="/blogs"
                className={({ isActive }) => (isActive ? "active" : undefined)}
                end
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/qna"
                className={({ isActive }) => (isActive ? "active" : undefined)}
              >
                QnA
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/jobs"
                className={({ isActive }) => (isActive ? "active" : undefined)}
              >
                Job
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/housing"
                className={({ isActive }) => (isActive ? "active" : undefined)}
              >
                Housing
              </NavLink>
            </li>
            {/* <li><NavLink to="/therapy" className={({isActive}) => 
                    isActive ? 'active':undefined
                }>Therapy</NavLink></li> */}
            <li>
              <NavLink
                to="/profile"
                className={({ isActive }) => (isActive ? "active" : undefined)}
              >
                Profile
              </NavLink>
            </li>

            <li>
              <Link to="/">
                <a className="logout__button" onClick={logoutHandler}>
                  Logout
                </a>
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="mobile_navbar">
        <div className="hamburger-menu">
          <GiHamburgerMenu onClick={navbarHandler} className="" />
        </div>
        <div className="navbar_list_mobile">
          {showNavbar && (
            <ul>
              <li>
                {" "}
                <NavLink
                  to="/blogs"
                  className={({ isActive }) =>
                    isActive ? "active" : undefined
                  }
                  end
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/qna"
                  className={({ isActive }) =>
                    isActive ? "active" : undefined
                  }
                >
                  QnA
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/jobs"
                  className={({ isActive }) =>
                    isActive ? "active" : undefined
                  }
                >
                  Job
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/housing"
                  className={({ isActive }) =>
                    isActive ? "active" : undefined
                  }
                >
                  Housing
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/therapy"
                  className={({ isActive }) =>
                    isActive ? "active" : undefined
                  }
                >
                  Therapy
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    isActive ? "active" : undefined
                  }
                >
                  Profile
                </NavLink>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
