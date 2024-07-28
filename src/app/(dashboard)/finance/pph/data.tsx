"use client";
import { useState } from "react";
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

type Pph = {
  id: number;
  gaji: number;
  pph21: number;
  pegawai: {
    id: number;
    nama: string;
  };
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

  // filter
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
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/web/pph?menu_url=${menu_url}&select_dept=${selectDept}&bulan=${bulan}&tahun=${tahun}`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/web/pph?menu_url=${menu_url}&select_dept=${selectDept}&bulan=${bulan}&tahun=${tahun}&search=${search}`,
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

  const dataPph = data?.data;
  const actions = data?.actions;

  let totalPph = 0;

  return (
    <>
      <div className="card-body">
        <div className="row">
          <div className="col-sm-12 d-flex justify-content-between align-items-center">
            <div>
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
                <th className="fw-semibold fs-6" style={{ width: "1%" }}>
                  NO
                </th>
                <th className="fw-semibold fs-6">NAMA</th>
                <th className="fw-semibold fs-6" style={{ width: "15%" }}>
                  GAJI
                </th>
                <th className="fw-semibold fs-6" style={{ width: "15%" }}>
                  PPH21
                </th>
              </tr>
            </thead>
            <tbody>
              {dataPph?.length === 0 ? (
                <tr>
                  <td colSpan={3}>
                    <div className="text-center">Tidak ada data</div>
                  </td>
                </tr>
              ) : (
                dataPph?.map((item: Pph, index: number) => {
                  totalPph += item.pph21;
                  return (
                    <tr key={index}>
                      <td align="center">{index + 1}</td>
                      <td align="left">{item.pegawai?.nama?.toUpperCase()}</td>
                      <td align="right">
                        {Number(item.gaji).toLocaleString("id-ID")}
                      </td>
                      <td align="right">
                        {Number(item.pph21).toLocaleString("id-ID")}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            <tfoot>
              <tr>
                <th colSpan={3} style={{ textAlign: "right" }}>
                  TOTAL
                </th>
                <th style={{ textAlign: "right" }}>
                  {Number(totalPph).toLocaleString("id-ID")}
                </th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </>
  );
};

export default Data;
