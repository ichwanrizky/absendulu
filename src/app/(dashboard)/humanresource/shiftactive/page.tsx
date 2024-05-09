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

const getDepartments = async (token: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/lib/listdepartment_access`,
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

const getShift = async (token: string, department: number) => {
  try {
    const body = new FormData();
    body.append("department", department.toString());
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/lib/listshift`,
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
        },
        body: body,
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

const Page = async () => {
  const session = (await getServerSession(authOptions)) as Session | null;

  if (!session) {
    return null;
  }

  const departments = await getDepartments(session.user.accessToken);

  let shifts: any = [];

  if (departments.length > 0) {
    shifts = await getShift(session.user.accessToken, departments[0].id);
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
                  <span style={{ fontSize: "1.8rem" }}>SHIFT ACTIVE</span>
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container-xl px-4 mt-n10">
        <div className="card mb-4">
          <div className="card-header">DATA SHIFT ACTIVE</div>
          <Data
            accessToken={session.user.accessToken}
            departments={departments}
            shifts={shifts}
          />
        </div>
      </div>
    </main>
  );
};

export default Page;
