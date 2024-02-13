const DashboardFooter = () => {
  return (
    <footer className="footer-admin mt-auto footer-light">
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
  );
};

export default DashboardFooter;
