import MenuSidebar from "./MenuSidebar";

const DashboardSidebar = ({ session }: { session: any }) => {
  return (
    <div id="layoutSidenav_nav">
      <nav className="sidenav shadow-right sidenav-dark">
        <div className="sidenav-menu">
          <MenuSidebar accessToken={session.accessToken} />
        </div>

        {/* sidebar footer */}
        <div className="sidenav-footer">
          <div className="sidenav-footer-content">
            <div className="sidenav-footer-subtitle">Logged in as:</div>
            <div className="sidenav-footer-title ">
              {session.roleName.toUpperCase()}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default DashboardSidebar;
