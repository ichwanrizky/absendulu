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

type ReportAttendance = {
  pegawai_id: number;
  nama: string;
  workdate_count: number;
  attend_count: number;
  notattend_count: number;
  late_count: number;
  cuti_count: number;
  cuti_s_count: number;
  izin_count: number;
  izin_s_count: number;
  sakit_count: number;
  g1_count: number;
  g2_count: number;
  g3_count: number;
  pm_count: number;
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

  const [search, setSearch] = useState("");
  const [bulan, setBulan] = useState((new Date().getMonth() + 1).toString());
  const [tahun, setTahun] = useState(new Date().getFullYear().toString());
  const [selectDept, setSelectDept] = useState(departments[0].id.toString());

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
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/web/attendancereport?menu_url=${menu_url}&select_dept=${selectDept}&bulan=${bulan}&tahun=${tahun}`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/web/attendancereport?menu_url=${menu_url}&select_dept=${selectDept}&bulan=${bulan}&tahun=${tahun}&search=${search}`,
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
              value={search}
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

  const reports = data?.data;

  return (
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
          </div>

          <input
            type="text"
            placeholder="Search..."
            aria-label="Search"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
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

      <div className="table-responsive mt-3" style={{ maxHeight: "500px" }}>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th
                className="fw-semibold fs-6"
                style={{ width: "1%", textAlign: "center" }}
              >
                NO
              </th>
              <th className="fw-semibold fs-6">NAMA</th>
              <th
                className="fw-semibold fs-6"
                style={{ width: "1%", whiteSpace: "nowrap" }}
              >
                HARI KERJA
              </th>
              <th
                className="fw-semibold fs-6"
                style={{ width: "1%", whiteSpace: "nowrap" }}
              >
                HADIR
              </th>
              <th
                className="fw-semibold fs-6"
                style={{ width: "1%", whiteSpace: "nowrap" }}
              >
                A
              </th>
              <th
                className="fw-semibold fs-6"
                style={{ width: "1%", whiteSpace: "nowrap" }}
              >
                C
              </th>
              <th
                className="fw-semibold fs-6"
                style={{ width: "1%", whiteSpace: "nowrap" }}
              >
                UL
              </th>
              <th
                className="fw-semibold fs-6"
                style={{ width: "1%", whiteSpace: "nowrap" }}
              >
                S
              </th>
              <th
                className="fw-semibold fs-6"
                style={{ width: "1%", whiteSpace: "nowrap" }}
              >
                GATEPASS
              </th>
              <th
                className="fw-semibold fs-6"
                style={{ width: "1%", whiteSpace: "nowrap" }}
              >
                LUPA ABSEN
              </th>
              <th
                className="fw-semibold fs-6"
                style={{ width: "1%", whiteSpace: "nowrap" }}
              >
                TELAT
              </th>
            </tr>
          </thead>
          <tbody>
            {reports?.length === 0 ? (
              <tr>
                <td colSpan={11}>
                  <div className="text-center">Tidak ada data</div>
                </td>
              </tr>
            ) : (
              reports?.map((item: ReportAttendance, index: number) => (
                <tr key={index} style={{ verticalAlign: "middle" }}>
                  <td align="center">{index + 1}</td>
                  <td align="left">{item.nama?.toUpperCase()}</td>
                  <td align="center">{item.workdate_count}</td>
                  <td align="center">{item.attend_count}</td>
                  <td align="center">{item.notattend_count}</td>
                  <td align="center">
                    {item.cuti_count + item.cuti_s_count / 2}
                  </td>
                  <td align="center">
                    {item.izin_count + item.izin_s_count / 2}
                  </td>
                  <td align="center">{item.sakit_count}</td>
                  <td align="center">
                    {item.g1_count + item.g2_count + item.g3_count}
                  </td>
                  <td align="center">{item.pm_count}</td>
                  <td align="center">{item.late_count}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const monthNames = (month: number) => {
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

  return monthNames[month - 1];
};

export default Data;
