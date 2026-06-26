import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const Navbar = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className='navbar navbar-expand-lg navbar-dark bg-primary'>
      <div className='container-fluid'>
        <Link to='/' className='navbar-brand fw-bold'>
          📚 Online Learning
        </Link>
        <button
          className='navbar-toggler'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target='#navbarContent'
          aria-controls='navbarContent'
          aria-expanded='false'
          aria-label='Toggle navigation'
        >
          <span className='navbar-toggler-icon'></span>
        </button>
        <div className='collapse navbar-collapse' id='navbarContent'>
          <ul className='navbar-nav me-auto mb-2 mb-lg-0'>
            <li className='nav-item'>
              <Link to='/' className='nav-link'>
                Home
              </Link>
            </li>
            <li className='nav-item'>
              <Link to='/courses' className='nav-link'>
                Courses
              </Link>
            </li>
            {user && (
              <>
                <li className='nav-item'>
                  <Link to='/dashboard' className='nav-link'>
                    Dashboard
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link to='/my-courses' className='nav-link'>
                    My Courses
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link to='/certificates' className='nav-link'>
                    Certificates
                  </Link>
                </li>
                {user.role === "ADMIN" && (
                  <li className='nav-item'>
                    <Link to='/admin' className='nav-link'>
                      Admin Panel
                    </Link>
                  </li>
                )}
                {(user.role === "INSTRUCTOR" || user.role === "ADMIN") && (
                  <li className='nav-item'>
                    <Link to='/instructor' className='nav-link'>
                      Instructor
                    </Link>
                  </li>
                )}
              </>
            )}
          </ul>

          <div className='d-flex align-items-center'>
            {user ? (
              <div className='dropdown'>
                <button
                  className='btn btn-light dropdown-toggle'
                  type='button'
                  id='userDropdown'
                  data-bs-toggle='dropdown'
                  aria-expanded='false'
                >
                  👤 {user.name}
                </button>
                <ul className='dropdown-menu dropdown-menu-end' aria-labelledby='userDropdown'>
                  <li>
                    <span className='dropdown-item-text'>
                      <small className='text-muted'>
                        Role: <span className='badge bg-primary'>{user.role}</span>
                      </small>
                    </span>
                  </li>
                  <li><hr className='dropdown-divider' /></li>
                  <li>
                    <Link to='/profile' className='dropdown-item'>
                      Profile
                    </Link>
                  </li>
                  <li>
                    <button className='dropdown-item' onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <Link to='/login' className='btn btn-light me-2'>
                  Login
                </Link>
                <Link to='/register' className='btn btn-outline-light'>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
