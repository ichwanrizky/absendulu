"use client";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import { usePathname } from "next/navigation";

type PengajuanIzin = {
  id: number;
  uuid: string;
  jenis_izin: string;
  tanggal: Date;
  pegawai_id: number;
  status: number;
  bulan: number;
  tahun: number;
  keterangan: string;
  jumlah_hari: string;
  jumlah_jam: string;
  approve_by: null;
  approve_date: null;
  pegawai: Pegawai;
};

type Pegawai = {
  nama: string;
};

type Department = {
  id: number;
  nama_department: string;
  lot: string;
  latitude: string;
  longitude: string;
  radius: string;
};
type SubDepartment = {
  id: number;
  nama_sub_department: string;
  department_id: number;
  department: Department;
};
interface isLoadingProps {
  [key: number]: boolean;
}

const Data = ({
  accessToken,
  departments,
}: {
  accessToken: string;
  departments: Department[];
}) => {
  const pathname = usePathname();
  const lastSlashIndex = pathname.lastIndexOf("/");
  const menu_url = pathname.substring(lastSlashIndex + 1);

  // loading state
  const [isLoadingDelete, setIsLoadingDelete] = useState<isLoadingProps>({});
  const [isLoadingApprove, setIsLoadingApprove] = useState<isLoadingProps>({});

  // filter
  const [selectDept, setSelectDept] = useState(departments[0].id.toString());

  //search state
  const [search, setSearch] = useState("");

  const handleDelete = async (id: number) => {
    if (confirm("Delete this data?")) {
      setIsLoadingDelete((prev) => ({ ...prev, [id]: true }));
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/web/pengajuanizin/${id}?menu_url=${menu_url}`,
          {
            method: "DELETE",
            headers: {
              authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const res = await response.json();
        alert(res.message);
        if (response.ok) {
          setSearch("");
          mutate(
            `${process.env.NEXT_PUBLIC_API_URL}/api/web/pengajuanizin?menu_url=${menu_url}&select_dept=${selectDept}`
          );
        }
      } catch (error) {
        alert("something went wrong");
      }
      setIsLoadingDelete((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleApprove = async (id: number) => {
    if (confirm("Approve this data?")) {
      setIsLoadingApprove((prev) => ({ ...prev, [id]: true }));
      try {
        const body = new FormData();
        body.append("status", "1");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/web/pengajuanizin/${id}?menu_url=${menu_url}`,
          {
            method: "POST",
            body: body,
            headers: {
              authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const res = await response.json();
        if (!response.ok) {
          alert(res.message);
        } else {
          alert(res.message);
          setSearch("");
          mutate(
            `${process.env.NEXT_PUBLIC_API_URL}/api/web/pengajuanizin?menu_url=${menu_url}&select_dept=${selectDept}`
          );
        }
      } catch (error) {
        alert("something went wrong");
      }
      setIsLoadingApprove((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleReject = async (id: number) => {
    if (confirm("Reject this data?")) {
      setIsLoadingApprove((prev) => ({ ...prev, [id]: true }));
      try {
        const body = new FormData();
        body.append("status", "2");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/web/pengajuanizin/${id}?menu_url=${menu_url}`,
          {
            method: "POST",
            body: body,
            headers: {
              authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const res = await response.json();
        if (!response.ok) {
          alert(res.message);
        } else {
          alert(res.message);
          setSearch("");
          mutate(
            `${process.env.NEXT_PUBLIC_API_URL}/api/web/pengajuanizin?menu_url=${menu_url}&select_dept=${selectDept}`
          );
        }
      } catch (error) {
        alert("something went wrong");
      }
      setIsLoadingApprove((prev) => ({ ...prev, [id]: false }));
    }
  };

  const fetcher = (url: RequestInfo) => {
    return fetch(url, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      next: {
        revalidate: 60,
      },
    }).then((res) => res.json());
  };
  const { data, error, isLoading } = useSWR(
    search === ""
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/web/pengajuanizin?menu_url=${menu_url}&select_dept=${selectDept}`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/web/pengajuanizin?menu_url=${menu_url}&select_dept=${selectDept}&search=${search}`,
    fetcher
  );

  if (isLoading) {
    return (
      <div className="card-body">
        <div className="row">
          <div className="col-sm-12 d-flex justify-content-between align-items-center">
            <div></div>

            <input
              type="text"
              placeholder="Search..."
              aria-label="Search"
              onChange={(e) => setSearch(e.target.value)}
              className="form-control-sm ms-2"
              id="search"
              style={{
                width: "200px",
                float: "right",
                border: "1px solid #ced4da",
              }}
            />
          </div>
        </div>
        <div className="text-center">
          <span
            className="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true"
          />{" "}
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-body">
        <div className="text-center">
          {data?.message && `Err: ${data?.message} - `} please refresh the page
        </div>
      </div>
    );
  }

  if (!data.status) {
    return (
      <div className="card-body">
        <div className="text-center">
          {data?.message} please refresh the page
        </div>
      </div>
    );
  }
  const permits = data?.data;
  const actions = data?.actions;

  return (
    <>
      <div className="card-body">
        <div className="row">
          <div className="col-sm-12 d-flex justify-content-between align-items-center">
            <div>
              <select
                className="form-select-sm"
                value={selectDept}
                onChange={(e) => setSelectDept(e.target.value)}
              >
                {departments?.map((item: Department, index: number) => (
                  <option value={item.id} key={index}>
                    {item.nama_department?.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <input
              type="text"
              placeholder="Search..."
              aria-label="Search"
              onChange={(e) => setSearch(e.target.value)}
              className="form-control-sm ms-2"
              id="search"
              style={{
                width: "200px",
                float: "right",
                border: "1px solid #ced4da",
              }}
            />
          </div>
        </div>

        <div className="table-responsive mt-3">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th className="fw-semibold fs-6" style={{ width: "1%" }}>
                  NO
                </th>
                <th className="fw-semibold fs-6" style={{ width: "15%" }}>
                  NAMA
                </th>
                <th className="fw-semibold fs-6" style={{ width: "10%" }}>
                  JENIS IZIN
                </th>
                <th className="fw-semibold fs-6" style={{ width: "15%" }}>
                  TANGGAL
                </th>
                <th className="fw-semibold fs-6" style={{ width: "5%" }}>
                  JUMLAH HARI
                </th>
                <th className="fw-semibold fs-6" style={{ width: "5%" }}>
                  JUMLAH JAM
                </th>
                <th className="fw-semibold fs-6" style={{ width: "5%" }}>
                  MC
                </th>
                <th className="fw-semibold fs-6" style={{ width: "15%" }}>
                  KETERANGAN
                </th>
                <th className="fw-semibold fs-6" style={{ width: "10%" }}>
                  PERSETUJUAN
                </th>
                <th className="fw-semibold fs-6" style={{ width: "5%" }}>
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody>
              {permits?.length === 0 ? (
                <tr>
                  <td colSpan={10}>
                    <div className="text-center">Tidak ada data</div>
                  </td>
                </tr>
              ) : (
                permits?.map((item: PengajuanIzin, index: number) => (
                  <tr key={index}>
                    <td align="center">{index + 1}</td>
                    <td align="left">{item.pegawai.nama?.toUpperCase()}</td>
                    <td align="left">{jenisPengajuan(item.jenis_izin)}</td>
                    <td align="left">
                      {new Date(item.tanggal as Date).toLocaleString(
                        "id-ID",
                        optionsDate
                      )}
                    </td>
                    <td align="center">{item.jumlah_hari}</td>
                    <td align="center">{item.jumlah_jam}</td>
                    <td align="center">
                      {item.jenis_izin === "S" && (
                        <a href={`/izin/${item.uuid}.png`} target="_blank">
                          MC
                        </a>
                      )}
                    </td>
                    <td align="left">{item.keterangan}</td>
                    <td>
                      <div className="d-flex gap-2 justify-content-center">
                        {actions?.includes("update") && (
                          <>
                            {isLoadingApprove[item.id] ? (
                              <button
                                className="btn btn-danger btn-sm"
                                disabled
                                type="button"
                              >
                                <span
                                  className="spinner-border spinner-border-sm"
                                  role="status"
                                  aria-hidden="true"
                                />
                              </button>
                            ) : (
                              <button
                                className="btn btn-danger btn-sm"
                                type="button"
                                onClick={() => handleReject(item.id)}
                              >
                                TIDAK
                              </button>
                            )}

                            {isLoadingApprove[item.id] ? (
                              <button
                                className="btn btn-success btn-sm"
                                disabled
                              >
                                <span
                                  className="spinner-border spinner-border-sm"
                                  role="status"
                                  aria-hidden="true"
                                />
                              </button>
                            ) : (
                              <button
                                className="btn btn-success btn-sm"
                                onClick={() => handleApprove(item.id)}
                              >
                                YA
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                    <td align="center">
                      {actions?.includes("delete") &&
                        (isLoadingDelete[item.id] ? (
                          <button className="btn btn-danger btn-sm" disabled>
                            <span
                              className="spinner-border spinner-border-sm"
                              role="status"
                              aria-hidden="true"
                            />
                          </button>
                        ) : (
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(item.id)}
                          >
                            Delete
                          </button>
                        ))}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

const jenisPengajuan = (jenis: string) => {
  switch (jenis) {
    case "C":
      return "Cuti";

    case "CS":
      return "Cuti Setengah Hari";

    case "I":
      return "Izin";

    case "IS":
      return "Izin Setengah Hari";

    case "S":
      return "Sakit";

    case "G1":
      return "Gatepass";

    case "G2":
      return "Datang Terlambat";

    case "G3":
      return "Pulang Awal";

    case "P/M":
      return "Lupa Absen";
  }
};

const optionsDate: any = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
};

export default Data;
