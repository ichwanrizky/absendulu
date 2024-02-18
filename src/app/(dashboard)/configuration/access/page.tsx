import { authOptions } from "@/libs/authOptions";
import { getServerSession } from "next-auth";
import AccessData from "./data";

const AccessPage = async () => {
  const session: any = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  return (
    <main>
      <header className="page-header page-header-dark bg-gradient-primary-to-secondary pb-10">
        <div className="container-xl px-4">
          <div className="page-header-content pt-4">
            <div className="row align-items-center justify-content-between">
              <div className="col-auto mt-4">
                <h1 className="page-header-title">
                  <div className="page-header-icon"></div>
                  <span style={{ fontSize: "1.8rem" }}>ACCESS</span>
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container-xl px-4 mt-n10">
        <div className="card mb-4">
          <div className="card-header">Data Access</div>
          <AccessData accessToken={session.user.accessToken} />
        </div>
      </div>
    </main>
  );
};

export default AccessPage;
