import PengajuanIzinPegawaiData from "./data";

const checkSession = async (uuid: string) => {
  try {
    const body = new FormData();
    body.append("uuid", uuid);

    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/api/web/checksessionizin",
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

const PengajuanIzinPegawaiPage = async ({ params }: any) => {
  const uuid = params.uuid;
  const session = await checkSession(uuid.toString());

  return (
    <div className="container-xl px-4">
      <div className="row justify-content-center">
        <PengajuanIzinPegawaiData session={session} />
      </div>
    </div>
  );
};

export default PengajuanIzinPegawaiPage;
