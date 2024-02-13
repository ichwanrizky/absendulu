import DashboardFooter from "@/components/DashboardFooter";
import DashboardHeader from "@/components/DashboardHeader";
import DashboardSidebar from "@/components/DashboardSidebar";
import { authOptions } from "@/libs/authOptions";
import { getServerSession } from "next-auth";
import Script from "next/script";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const session: any = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  return (
    <>
      <head>
        <link href="/themes/css/styles.css" rel="stylesheet" />
        <link
          href="/themes/css/datepicker.min.css"
          rel="stylesheet"
          type="text/css"
        />
        <Script src="/themes/js/all.min.js"></Script>
        <Script src="/themes/js/feather.min.js"></Script>
      </head>

      <body className="nav-fixed bg-dark">
        {/* header */}
        <DashboardHeader />
        <div id="layoutSidenav">
          {/* sidebar */}
          <DashboardSidebar session={session.user} />

          <div id="layoutSidenav_content">
            {children}
            {/* footer */}
            <DashboardFooter />
          </div>
        </div>
        <Script src="/themes/js/bootstrap.bundle.min.js"></Script>
        <Script src="/themes/js/scripts.js"></Script>
      </body>
    </>
  );
};

export default DashboardLayout;
