"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { isErrored } from "stream";
import useSWR from "swr";

type Department = {
  id: number;
  nama_department: string;
  lot: string;
  latitude: string;
  longitude: string;
  radius: string;
};

type KomponenGaji = {
  id: number;
  komponen: string;
};

type Pegawai = {
  id: number;
  nama: string;
  status_nikah: string;
  master_gaji_pegawai: MasterGajiPegawai[];
};

type MasterGajiPegawai = {
  id: number;
  nominal: number;
  komponen_id: number;
  komponen: KomponenGaji;
};

const Data = ({
  accessToken,
  departments,
  listKomponenGaji,
}: {
  accessToken: string;
  departments: Department[];
  listKomponenGaji: KomponenGaji[];
}) => {
  const pathname = usePathname();
  const lastSlashIndex = pathname.lastIndexOf("/");
  const menu_url = pathname.substring(lastSlashIndex + 1);

  const [newListKomponenGaji, setNewListKomponenGaji] = useState(
    listKomponenGaji as KomponenGaji[]
  );

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
    `${process.env.NEXT_PUBLIC_API_URL}/api/web/mastergaji?menu_url=${menu_url}`,
    fetcher
  );

  if (isLoading) return <div></div>;
  if (error) return <div></div>;

  const masterGaji = data?.data;

  return (
    <>
      <div className="card-body">
        <div className="row">
          {/* <div className="col-sm-12">
            {actions?.includes("insert") && (
              <button
                type="button"
                className="btn btn-primary btn-sm fw-bold"
                onClick={() => handleCreate()}
              >
                ADD DATA
              </button>
            )}

            <button
              type="button"
              className="btn btn-dark btn-sm fw-bold ms-2"
              onClick={() => handleFilter()}
            >
              FILTER DATA
            </button>
            {filter.filter && (
              <button
                type="button"
                className="btn btn-outline-dark btn-sm fw-bold ms-1"
                onClick={() =>
                  setFilter({
                    filter: false,
                    tahun: new Date().getFullYear(),
                  })
                }
              >
                RESET
              </button>
            )}
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
          </div> */}
        </div>

        <div className="table-responsive mt-3">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th
                  className="fw-semibold fs-6 sticky-col"
                  style={{ width: "50px" }}
                >
                  NO
                </th>
                <th
                  className="fw-semibold fs-6 sticky-col"
                  style={{ width: "50px" }}
                >
                  <input type="checkbox" />
                </th>
                <th
                  className="fw-semibold fs-6 sticky-col"
                  style={{ width: "200px" }}
                >
                  NAMA
                </th>
                <th className="fw-semibold fs-6" style={{ width: "10%" }}>
                  PTKP
                </th>
                {newListKomponenGaji?.map((item, index) => (
                  <th className="fs-10" style={{ width: "15%" }} key={index}>
                    {item.komponen?.toUpperCase()}
                  </th>
                ))}
                <th className="fw-semibold fs-6" style={{ width: "10%" }}>
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody>
              {masterGaji?.length === 0 ? (
                <tr>
                  <td colSpan={2}>
                    <div className="text-center">Tidak ada data</div>
                  </td>
                </tr>
              ) : (
                masterGaji?.map((item: Pegawai, index: number) => (
                  <tr key={index}>
                    <td
                      className="sticky-col"
                      align="center"
                      style={{ width: "50px" }}
                    >
                      {index + 1}
                    </td>
                    <td
                      className="sticky-col"
                      align="center"
                      style={{ width: "50px" }}
                    >
                      <input type="checkbox" />
                    </td>
                    <td
                      className="sticky-col"
                      align="left"
                      style={{ whiteSpace: "nowrap", width: "200px" }}
                    >
                      {item.nama.toUpperCase()}
                    </td>
                    <td align="left">{item.status_nikah.toUpperCase()}</td>
                    {newListKomponenGaji?.map(
                      (item2: KomponenGaji, index: number) => (
                        <td align="left" key={index}>
                          <input type="text" />
                        </td>
                      )
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        .sticky-col {
          position: -webkit-sticky; /* For Safari */
          position: sticky;
          background-color: white; /* Optional: to avoid overlap issues */
          z-index: 2; /* Ensure it stays on top */
        }

        /* Adjust left position for each sticky column */
        .sticky-col:nth-child(1) {
          left: 0;
        }

        .sticky-col:nth-child(2) {
          left: 50px; /* Width of the first column */
        }

        .sticky-col:nth-child(3) {
          left: 100px; /* Width of the first two columns combined */
        }

        /* Optional: Add some styles for a better visual distinction */
        .table-bordered th,
        .table-bordered td {
          border: 1px solid #dee2e6;
          background-clip: padding-box;
        }

        .table-bordered {
          border-collapse: separate;
          border-spacing: 0;
        }
      `}</style>
    </>
  );
};

export default Data;
