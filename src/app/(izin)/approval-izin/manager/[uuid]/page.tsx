import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/authOptions";
import Data from "./data";

const getDataIzin = async (uuid: string, token: string) => {
  try {
    const body = new FormData();
    body.append("metode", "manager");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/lib/getapprovalizin/${uuid}`,
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${token}`,
        },
        body: body,
      }
    );
    if (!response.ok) {
      return null;
    }

    const res = await response.json();

    return res.data;
  } catch (error) {
    return null;
  }
};

const Page = async ({ params }: any) => {
  const session: any = await getServerSession(authOptions);

  if (!session) {
    return null;
  }

  const dataIzin = await getDataIzin(params.uuid, session.user.accessToken);

  return (
    <div className="container-xl px-4">
      <div className="row justify-content-center">
        {dataIzin === null ? (
          <div className="col-lg-5">
            <div className="card shadow-lg border-0 rounded-lg mt-5">
              <div
                className={`alert alert-danger alert-solid mx-4 mt-4`}
                role="alert"
              >
                <strong>Unauthorized</strong>
                <p className="mb-0">
                  You are not authorized to access this page.
                </p>
              </div>
              <div className="card-header justify-content-center text-center">
                <h3 className="fw-semibold my-4">FORM PENGAJUAN IZIN</h3>
              </div>
              <div className="card-body"></div>
            </div>
          </div>
        ) : (
          <Data dataIzin={dataIzin} accessToken={session.user.accessToken} />
        )}
      </div>
    </div>
  );
};

export default Page;
