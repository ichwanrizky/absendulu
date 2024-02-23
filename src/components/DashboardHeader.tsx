"use client";

import { signOut } from "next-auth/react";

const logout = () => {
  if (confirm("Are you sure you want to logout?")) {
    signOut();
  }
};

const DashboardHeader = ({ session }: { session: any }) => {
  return (
    <nav
      className="topnav navbar navbar-expand shadow justify-content-between justify-content-sm-start navbar-dark bg-dark"
      id="sidenavAccordion"
    >
      <button
        className="btn btn-icon btn-transparent-white order-1 order-lg-0 me-2 ms-lg-2 me-lg-0"
        id="sidebarToggle"
      >
        <i data-feather="menu" />
      </button>
      <a className="navbar-brand pe-3 ps-4 ps-lg-2" href="index.html">
        title here
      </a>

      <ul className="navbar-nav align-items-center ms-auto">
        <li className="nav-item dropdown no-caret dropdown-user me-3 me-lg-4">
          <a
            className="btn btn-icon btn-transparent-dark dropdown-toggle"
            id="navbarDropdownUserImage"
            role="button"
            data-bs-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <img
              className="img-fluid"
              src="/themes/assets/img/illustrations/profiles/profile-1.png"
            />
          </a>
          <div
            className="dropdown-menu dropdown-menu-end border-0 shadow animated--fade-in-up"
            aria-labelledby="navbarDropdownUserImage"
          >
            <h6 className="dropdown-header d-flex align-items-center">
              <img
                className="dropdown-user-img"
                src="/themes/assets/img/illustrations/profiles/profile-1.png"
              />
              <div className="dropdown-user-details">
                <div className="dropdown-user-details-name">
                  {session.pegawaiName.toUpperCase()}
                </div>
                <div className="dropdown-user-details-email">
                  {session.roleName.toUpperCase()}
                </div>
              </div>
            </h6>
            <div className="dropdown-divider" />
            <a className="dropdown-item" href="#!">
              <div className="dropdown-item-icon">
                <i data-feather="settings" />
              </div>
              Account
            </a>
            <button className="dropdown-item" type="button" onClick={logout}>
              <div className="dropdown-item-icon">
                <i data-feather="log-out" />
              </div>
              Logout
            </button>
          </div>
        </li>
      </ul>
    </nav>
  );
};
export default DashboardHeader;
