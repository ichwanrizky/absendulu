"use client";
import { useState } from "react";
import useSWR from "swr";
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

interface Absensi {
  id: number;
  nama: string;
  tanggal: string;
  tanggal_libur: string | null;
  tanggal_absen: string | null;
  absen_masuk: string;
  absen_pulang: string;
  late: number | null;
  tanggal_izin: string | null;
  jenis_izin: string | null;
  jumlah_hari: number | null;
  jumlah_jam: string | null;
  tanggal_ot: string | null;
  total_ot: number | null;
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

  // filter
  const [selectDept, setSelectDept] = useState(departments[0].id.toString());
  const [bulan, setBulan] = useState((new Date().getMonth() + 1).toString());
  const [tahun, setTahun] = useState(new Date().getFullYear().toString());
  const [pegawai, setPegawai] = useState(listPegawai[0]?.id.toString());

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
    `${process.env.NEXT_PUBLIC_API_URL}/api/web/absensiperpegawai?menu_url=${menu_url}&select_dept=${selectDept}&bulan=${bulan}&tahun=${tahun}&pegawai=${pegawai}`,
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

  const attendance = data?.data;
  let latePegawai: number = 0;

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
                onChange={(e) => setSelectDept(e.target.value)}
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
                {listPegawai?.map((item: Pegawai, index: number) => (
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
                <th className="fw-semibold fs-6" style={{ width: "5%" }}>
                  HARI
                </th>
                <th className="fw-semibold fs-6" style={{ width: "10%" }}>
                  ABSEN MASUK
                </th>
                <th className="fw-semibold fs-6" style={{ width: "10%" }}>
                  ABSEN PULANG
                </th>
                <th className="fw-semibold fs-6" style={{ width: "5%" }}>
                  LATE
                </th>
                <th className="fw-semibold fs-6" style={{ width: "5%" }}>
                  IZIN
                </th>
              </tr>
            </thead>
            <tbody>
              {attendance?.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="text-center">Tidak ada data</div>
                  </td>
                </tr>
              ) : (
                attendance?.map((item: Absensi, index: number) => (
                  <tr
                    key={index}
                    style={
                      item.tanggal_libur === null &&
                      item.tanggal_absen === null &&
                      item.tanggal_izin === null
                        ? { backgroundColor: "yellow" }
                        : {}
                    }
                  >
                    <td align="center">{index + 1}</td>
                    <td align="left">{item.nama}</td>
                    <td
                      align="center"
                      style={{
                        border: "1px solid #dee2e6",
                        color: item.tanggal_libur !== null ? "red" : "",
                      }}
                    >
                      {item.tanggal}
                    </td>
                    <td
                      align="center"
                      style={{
                        border: "1px solid #dee2e6",
                        color: item.tanggal_libur !== null ? "red" : "",
                      }}
                    >
                      {getDayInIndonesian(item.tanggal)}
                    </td>
                    <td align="center">{item.absen_masuk}</td>
                    <td align="center">{item.absen_pulang}</td>
                    <td align="center">
                      {item.tanggal_libur === null &&
                        item.tanggal_absen !== null &&
                        item.late !== 0 &&
                        (item.jenis_izin !== null
                          ? ["G2", "CS", "IS"].includes(item.jenis_izin)
                            ? ""
                            : (() => {
                                latePegawai += Number(item.late);
                                return `${item.late} Menit`;
                              })()
                          : (() => {
                              latePegawai += Number(item.late);
                              return `${item.late} Menit`;
                            })())}
                    </td>
                    <td align="center">
                      {item.jenis_izin !== null && (
                        <>
                          {jenisPengajuan(item.jenis_izin)}
                          <br />
                          {["G1", "G2", "G3"].includes(item.jenis_izin) &&
                            (item.jenis_izin === "G2"
                              ? Number(jumlahJam(item.jumlah_jam)) >
                                Number(item.late)
                                ? `${jumlahJam(item.jumlah_jam)} Menit`
                                : `${item.late} Menit`
                              : `${jumlahJam(item.jumlah_jam)} Menit`)}
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={6}></td>
                <td align="center">{latePegawai}</td>
                <td></td>
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
