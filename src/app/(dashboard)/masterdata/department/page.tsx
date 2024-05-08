import { authOptions } from "@/libs/authOptions";
import { getServerSession } from "next-auth";
import Data from "./data";

type Session = {
  user: UserSession;
};
type UserSession = {
  id: number;
  username: string;
  roleId: number;
  roleName: string;
  path: string;
  accessToken: string;
};

const Page = async () => {
  const session = (await getServerSession(authOptions)) as Session | null;

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
                  <span style={{ fontSize: "1.8rem" }}>DEPARTMENTS</span>
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container-xl px-4 mt-n10">
        <div className="card mb-4">
          <div className="card-header">DATA DEPARTMENT</div>
          <Data accessToken={session.user.accessToken} />
        </div>
      </div>
    </main>
  );
};

export default Page;
