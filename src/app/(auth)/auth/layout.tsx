// "use client";
import Script from "next/script";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />

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
