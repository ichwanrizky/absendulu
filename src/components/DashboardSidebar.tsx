import MenuSidebar from "./MenuSidebar";

const getMenuSidebar = async (token: string) => {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/api/web/menusidebar",
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return [];
    }

    const res = await response.json();

    return res.data;
  } catch (error) {
    return [];
  }
};

const DashboardSidebar = async ({ session }: { session: any }) => {
  const menu = await getMenuSidebar(session.accessToken);

  return (
    <div id="layoutSidenav_nav">
      <nav className="sidenav shadow-right sidenav-dark">
        <div className="sidenav-menu">
          <MenuSidebar menu={menu} />
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
