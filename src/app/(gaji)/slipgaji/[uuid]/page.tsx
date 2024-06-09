import Data from "./data";

const getGajiPegawai = async (uuid: string) => {
  try {
    const body = new FormData();
    body.append("uuid", uuid);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/lib/gaji_pegawai`,
      {
        method: "POST",
        body,
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
  const uuid = params.uuid;

  const gajiPegawai = await getGajiPegawai(uuid.toString());
  if (!gajiPegawai) {
    return (
      <div className="container-xl px-4">
        <div className="row justify-content-center">
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
              <div className="card-body"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-xl px-4">
      <div className="row justify-content-center">
        <Data gajiPegawai={gajiPegawai} />
      </div>
    </div>
  );
};

export default Page;
