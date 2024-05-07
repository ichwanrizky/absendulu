// "use client";
import Script from "next/script";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <head>
        <link href="/themes/css/styles.css" rel="stylesheet" />
        <Script
          data-search-pseudo-elements
          defer
          src="/themes/js/all.min.js"
        ></Script>
        <Script src="/themes/js/feather.min.js"></Script>
        <Script
          src="/themes/js/scripts.js"
          strategy="afterInteractive"
        ></Script>
      </head>

      <body className="bg-dark">
        <div id="layoutAuthentication">
          <div id="layoutAuthentication_content">
            <main>{children}</main>
          </div>
          <div id="layoutAuthentication_footer">
            <footer className="footer-admin mt-auto footer-dark">
              <div className="container-xl px-4">
                <div className="row">
                  <div className="col-md-6 small">
                    Copyright © Panji Jaya {new Date().getFullYear()}
                  </div>
                  <div className="col-md-6 text-md-end small">
                    <a href="#!">Privacy Policy</a>·
                    <a href="#!">Terms &amp; Conditions</a>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </div>
        <Script src="/themes/js/bootstrap.bundle.min.js"></Script>
      </body>
    </>
  );
};

export default AuthLayout;
