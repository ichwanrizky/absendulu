import { authOptions } from "@/libs/authOptions";
import { getServerSession } from "next-auth";
import SubDepartmentData from "./data";

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

const getDepartments = async (token: string) => {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/api/web/masterdata/department",
      {
        headers: {
          authorization: `Bearer ${token}`,
        },
        next: {
          revalidate: 60,
        },
      }
    );

    const res = await response.json();

    if (response.ok) {
      return res.data;
    }
    return [];
  } catch (error) {
    return [];
  }
};

const SubDepartmentPage = async () => {
  const session = (await getServerSession(authOptions)) as Session | null;

  if (!session) {
    return null;
  }

  const departments = await getDepartments(session.user.accessToken);

  return (
    <main>
      <header className="page-header page-header-dark bg-gradient-primary-to-secondary pb-10">
        <div className="container-xl px-4">
          <div className="page-header-content pt-4">
            <div className="row align-items-center justify-content-between">
              <div className="col-auto mt-4">
                <h1 className="page-header-title">
                  <div className="page-header-icon"></div>
                  <span style={{ fontSize: "1.8rem" }}>SUB DEPARTMENTS</span>
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container-xl px-4 mt-n10">
        <div className="card mb-4">
          <div className="card-header">Data Sub Department</div>
          <SubDepartmentData
            accessToken={session.user.accessToken}
            departments={departments}
          />
        </div>
      </div>
    </main>
  );
};

export default SubDepartmentPage;
