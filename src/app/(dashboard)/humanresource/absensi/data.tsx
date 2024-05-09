"use client";
import { useState } from "react";
import useSWR from "swr";
import { usePathname } from "next/navigation";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Absensi = {
  id: string | number;
  pegawaiId: number;
  nama: string;
  tanggal: string;
  absenMasuk: string;
  absenPulang: string;
  late: number;
  early: number;
};

type Department = {
  id: number;
  nama_department: string;
  lot: string;
  latitude: string;
  longitude: string;
  radius: string;
};

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

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  currentDate.setHours(currentDate.getHours() + 7);

  // filter
  const [selectDept, setSelectDept] = useState(departments[0].id.toString());
  const [tanggalAbsen, setTanggalAbsen] = useState(currentDate as Date);

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
    `${
      process.env.NEXT_PUBLIC_API_URL
    }/api/web/absensi?menu_url=${menu_url}&select_dept=${selectDept}&tanggal_absen=${tanggalAbsen.toISOString()}`,
    fetcher
  );

  if (isLoading) {
    return (
      <div className="card-body">
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

  return (
    <>
      <div className="card-body">
        <div className="row">
          <div className="col-sm-12" style={{ display: "flex" }}>
            <div
              className="date-picker-container"
              style={{
                position: "relative",
                zIndex: "2",
              }}
            >
              <DatePicker
                className="form-select-sm"
                selected={tanggalAbsen}
                onChange={(e: Date) => setTanggalAbsen(e)}
                dateFormat={"yyyy-MM-dd"}
                showMonthDropdown
                showYearDropdown
                scrollableYearDropdown
                dropdownMode="select"
                required
              />
            </div>

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
          </div>
        </div>

        <div className="table-responsive mt-3">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th className="fw-semibold fs-6" style={{ width: "1%" }}>
                  NO
                </th>
                <th className="fw-semibold fs-6">NAMA</th>
                <th className="fw-semibold fs-6" style={{ width: "20%" }}>
                  TANGGAL
                </th>
                <th className="fw-semibold fs-6" style={{ width: "10%" }}>
                  ABSEN MASUK
                </th>
                <th className="fw-semibold fs-6" style={{ width: "10%" }}>
                  ABSEN PULANG
                </th>
                <th className="fw-semibold fs-6" style={{ width: "1%" }}>
                  TERLAMBAT
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
                    style={item.id ? {} : { backgroundColor: "yellow" }}
                  >
                    <td align="center">{index + 1}</td>
                    <td align="left">{item.nama}</td>
                    <td align="center">{item.tanggal}</td>
                    <td align="center">{item.absenMasuk}</td>
                    <td align="center">{item.absenPulang}</td>
                    <td align="center">{item.late}</td>
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
export default Data;
