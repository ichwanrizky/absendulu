import Data from "./data";

const checkSession = async (uuid: string) => {
  try {
    const body = new FormData();
    body.append("uuid", uuid);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/lib/checksessionizin`,
      {
        method: "POST",
        body,
        cache: "no-store",
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

const getTanggalMerah = async (uuid: string, department: string) => {
  try {
    const body = new FormData();
    body.append("uuid", uuid);
    body.append("department", department);

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/lib/listtanggal_merah`,
      {
        method: "POST",
        body,
      }
    );

    const res = await response.json();

    if (!response.ok) {
      return [];
    }

    return res.data;
  } catch (error) {
    return [];
  }
};

const Page = async ({ params }: any) => {
  const uuid = params.uuid;
  const session = await checkSession(uuid.toString());

  var tanggalmerah: any = [];

  if (session) {
    tanggalmerah = await getTanggalMerah(
      uuid.toString(),
      session.pegawai.department.id.toString()
    );
  }

  return (
    <div className="container-xl px-4">
      <div className="row justify-content-center">
        <Data session={session} tanggalMerah={tanggalmerah} />
      </div>
    </div>
  );
};

export default Page;
