"use client";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import { usePathname } from "next/navigation";

type Department = {
  id: number;
  nama_department: string;
  lot: string;
  latitude: string;
  longitude: string;
  radius: string;
};

type Pegawai = {
  id: number;
  nama: string;
};

type OvertimePegawai = {
  id: number;
  tanggal: string;
  jam: string;
  total: string;
  is_holiday: boolean;
  pegawai: Pegawai;
};

interface isLoadingProps {
  [key: number]: boolean;
}

const Data = ({
  accessToken,
  departments,
  listPegawai,
}: {
  accessToken: string;
  departments: Department[];
  listPegawai: Pegawai[];
}) => {
  const pathname = usePathname();
  const lastSlashIndex = pathname.lastIndexOf("/");
  const menu_url = pathname.substring(lastSlashIndex + 1);

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  currentDate.setHours(currentDate.getHours() + 7);

  // loading state
  const [isLoadingDelete, setIsLoadingDelete] = useState<isLoadingProps>({});

  // filter
  const [selectDept, setSelectDept] = useState(departments[0].id.toString());
  const [bulan, setBulan] = useState((new Date().getMonth() + 1).toString());
  const [tahun, setTahun] = useState(new Date().getFullYear().toString());

  const [listPegawaiOvertime, setListPegawaiOvertime] = useState(
    listPegawai as Pegawai[]
  );
  const [pegawai, setPegawai] = useState(listPegawai[0]?.id.toString());

  const handleChangeDept = async (id: number) => {
    try {
      const body = new FormData();
      body.append("department", id.toString());

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/lib/listkaryawan_overtime`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
          method: "POST",
          body: body,
          next: {
            revalidate: 60,
          },
        }
      );
      const res = await response.json();

      if (response.ok) {
        setListPegawaiOvertime(res.data);
        setPegawai(res.data[0].id.toString());
      } else {
        setListPegawaiOvertime([]);
        setPegawai("");
      }
    } catch (error) {
      alert("something went wrong");
      setListPegawaiOvertime([]);
      setPegawai("");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Delete this data?")) {
      setIsLoadingDelete((prev) => ({ ...prev, [id]: true }));
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/web/overtimeperpegawai/${id}?menu_url=${menu_url}`,
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
          mutate(
            `${process.env.NEXT_PUBLIC_API_URL}/api/web/overtimeperpegawai?menu_url=${menu_url}&select_dept=${selectDept}&bulan=${bulan}&tahun=${tahun}&pegawai=${pegawai}`
          );
        }
      } catch (error) {
        alert("something went wrong");
      }
      setIsLoadingDelete((prev) => ({ ...prev, [id]: false }));
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
    `${process.env.NEXT_PUBLIC_API_URL}/api/web/overtimeperpegawai?menu_url=${menu_url}&select_dept=${selectDept}&bulan=${bulan}&tahun=${tahun}&pegawai=${pegawai}`,
    fetcher
  );

  if (isLoading) {
    return (
      <div className="card-body">
        <div className="row">
          <div className="col-sm-12 d-flex justify-content-between align-items-center">
            <div></div>
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

  const otPegawai = data?.data;
  const actions = data?.actions;

  let jamOtPegawai: number = 0;
  let totalOtPegawai: number = 0;

  return (
    <>
      <div className="card-body">
        <div className="row">
          <div className="col-sm-12 d-flex justify-content-between align-items-center">
            <div style={{ display: "flex" }}>
              <div
                className="date-picker-container"
                style={{
                  position: "relative",
                  zIndex: "2",
                }}
              ></div>

              <select
                className="form-select-sm ms-2"
                value={selectDept}
                onChange={(e) => {
                  setSelectDept(e.target.value);
                  handleChangeDept(Number(e.target.value));
                }}
              >
                {departments?.map((item: Department, index: number) => (
                  <option value={item.id} key={index}>
                    {item.nama_department?.toUpperCase()}
                  </option>
                ))}
              </select>

              <select
                className="form-select-sm ms-2"
                value={bulan}
                onChange={(e) => setBulan(e.target.value)}
              >
                {Array.from({ length: 12 }, (_, i) => {
                  const monthNames = [
                    "Januari",
                    "Februari",
                    "Maret",
                    "April",
                    "Mei",
                    "Juni",
                    "Juli",
                    "Augustus",
                    "September",
                    "Oktober",
                    "November",
                    "Desember",
                  ];
                  return (
                    <option value={i + 1} key={i}>
                      {monthNames[i]}
                    </option>
                  );
                })}
              </select>

              <select
                className="form-select-sm ms-2"
                required
                value={tahun}
                onChange={(e) => setTahun(e.target.value)}
              >
                {Array.from({ length: 2 }, (_, i) => (
                  <option value={new Date().getFullYear() + i} key={i}>
                    {new Date().getFullYear() + i}
                  </option>
                ))}
              </select>

              <select
                className="form-select-sm ms-2"
                value={pegawai}
                onChange={(e) => setPegawai(e.target.value)}
              >
                {listPegawaiOvertime?.map((item: Pegawai, index: number) => (
                  <option value={item.id} key={index}>
                    {item.nama?.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="table-responsive mt-3" style={{ maxHeight: "500px" }}>
          <table
            className="table table-bordered"
            style={{ position: "relative" }}
          >
            <thead
              style={{
                position: "sticky",
                top: 0,
                backgroundColor: "white",
                zIndex: 1,
              }}
            >
              <tr>
                <th className="fw-semibold fs-6" style={{ width: "1%" }}>
                  NO
                </th>
                <th className="fw-semibold fs-6">NAMA</th>
                <th className="fw-semibold fs-6" style={{ width: "15%" }}>
                  TANGGAL
                </th>
                <th className="fw-semibold fs-6" style={{ width: "15%" }}>
                  HARI
                </th>
                <th className="fw-semibold fs-6" style={{ width: "10%" }}>
                  OT
                </th>
                <th className="fw-semibold fs-6" style={{ width: "10%" }}>
                  TOTAL OT
                </th>
                <th className="fw-semibold fs-6" style={{ width: "1%" }}></th>
              </tr>
            </thead>
            <tbody>
              {otPegawai?.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="text-center">Tidak ada data</div>
                  </td>
                </tr>
              ) : (
                otPegawai?.map((item: OvertimePegawai, index: number) => {
                  jamOtPegawai += Number(item.jam);
                  totalOtPegawai += Number(item.total);

                  return (
                    <tr key={index}>
                      <td align="center">{index + 1}</td>
                      <td align="left">{item.pegawai.nama?.toUpperCase()}</td>
                      <td
                        align="center"
                        style={{
                          color: item.is_holiday ? "red" : "",
                        }}
                      >
                        {item.tanggal.substring(0, 10)}
                      </td>
                      <td
                        align="center"
                        style={{
                          color: item.is_holiday ? "red" : "",
                        }}
                      >
                        {getDayInIndonesian(item.tanggal)}
                      </td>
                      <td align="center">{item.jam}</td>
                      <td align="center">{item.total}</td>
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
                  );
                })
              )}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4}>&nbsp;</td>
                <td align="center" className="fw-semibold">
                  {jamOtPegawai}
                </td>
                <td align="center" className="fw-semibold">
                  {totalOtPegawai}
                </td>
                <td>&nbsp;</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </>
  );
};

const getDayInIndonesian = (dateString: any) => {
  const date = new Date(dateString);
  const options: any = { weekday: "long" };
  return new Intl.DateTimeFormat("id-ID", options).format(date);
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

const jumlahJam = (jumlah_jam: string | null) => {
  switch (jumlah_jam) {
    case "0.5":
      return 30;
    case "1":
      return 60;
    case "1.5":
      return 90;
    case "2":
      return 120;
    case "2.5":
      return 150;
    case "3":
      return 180;
    case "3.5":
      return 210;
  }
};

export default Data;
