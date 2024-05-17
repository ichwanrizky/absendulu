"use client";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import { usePathname } from "next/navigation";

type PengajuanIzin = {
  number: number;
  id: number;
  jenis_izin: string;
  tanggal: Date;
  pegawai_id: number;
  status: number;
  bulan: number;
  tahun: number;
  keterangan: string;
  jumlah_hari: string;
  jumlah_jam: string;
  mc: null;
  approve_by: null;
  approve_date: null;
  pegawai: Pegawai;
  user: User;
};

type Pegawai = {
  nama: string;
};

type User = {
  name: string;
};

type Department = {
  id: number;
  nama_department: string;
  lot: string;
  latitude: string;
  longitude: string;
  radius: string;
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

  // pagination
  const [currentPage, setCurrentPage] = useState(1);

  // loading state
  const [isLoadingDelete, setIsLoadingDelete] = useState<isLoadingProps>({});

  // filter state
  const [selectDept, setSelectDept] = useState(departments[0].id.toString());

  //search state
  const [search, setSearch] = useState("");

  const [bulan, setBulan] = useState((new Date().getMonth() + 1).toString());
  const [tahun, setTahun] = useState(new Date().getFullYear().toString());

  const handleDelete = async (id: number) => {
    if (confirm("Delete this data?")) {
      setIsLoadingDelete((prev) => ({ ...prev, [id]: true }));
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/web/riwayatizin/${id}?menu_url=${menu_url}`,
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
            `${process.env.NEXT_PUBLIC_API_URL}/api/web/riwayatizin?menu_url=${menu_url}&page=${currentPage}&select_dept=${selectDept}&bulan=${bulan}&tahun=${tahun}`
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
    search === ""
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/web/riwayatizin?menu_url=${menu_url}&page=${currentPage}&select_dept=${selectDept}&bulan=${bulan}&tahun=${tahun}`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/web/riwayatizin?menu_url=${menu_url}&page=${currentPage}&select_dept=${selectDept}&bulan=${bulan}&tahun=${tahun}&search=${search}`,
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

  const permits = data?.data;
  const actions = data?.actions;

  const ITEMS_PER_PAGE = data?.itemsPerPage;
  const MAX_PAGINATION = 5;
  const TOTAL_PAGES = Math.ceil(data?.total / ITEMS_PER_PAGE);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const startPage = Math.max(1, currentPage - Math.floor(MAX_PAGINATION / 2));

    for (
      let i = startPage;
      i <= Math.min(TOTAL_PAGES, startPage + MAX_PAGINATION - 1);
      i++
    ) {
      pageNumbers.push(
        <li
          key={i}
          className={`page-item ${currentPage === i ? "active" : ""}`}
        >
          <button className="page-link" onClick={() => setCurrentPage(i)}>
            {i}
          </button>
        </li>
      );
    }

    if (TOTAL_PAGES > MAX_PAGINATION) {
      // Add an ellipsis for additional pages
      if (startPage > 1) {
        pageNumbers.unshift(
          <li key={1} className="page-item disabled">
            <span className="page-link">...</span>
          </li>
        );
      }
      if (startPage + MAX_PAGINATION - 1 < TOTAL_PAGES) {
        pageNumbers.push(
          <li key={TOTAL_PAGES} className="page-item disabled">
            <span className="page-link">...</span>
          </li>
        );
      }
    }

    return pageNumbers;
  };

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
                  STATUS KNOWN
                </th>
                <th className="fw-semibold fs-6" style={{ width: "10%" }}>
                  STATUS APPROVE
                </th>
                <th className="fw-semibold fs-6" style={{ width: "5%" }}>
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody>
              {permits?.length === 0 ? (
                <tr>
                  <td colSpan={11}>
                    <div className="text-center">Tidak ada data</div>
                  </td>
                </tr>
              ) : (
                permits?.map((item: PengajuanIzin, index: number) => (
                  <tr key={index} style={{ verticalAlign: "middle" }}>
                    <td align="center">{item.number}</td>
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
                    <td align="center"></td>
                    <td align="left">{item.keterangan}</td>
                    <td align="center">
                      {item.status === 1 ? (
                        <>
                          <span className="badge bg-success">Approved By</span>
                          <strong>{item.user.name}</strong>
                        </>
                      ) : (
                        <>
                          <span className="badge bg-danger">Rejected By</span>
                          <strong>{item.user.name}</strong>
                        </>
                      )}
                    </td>
                    <td align="center">
                      {item.status === 1 ? (
                        <>
                          <span className="badge bg-success">Approved By</span>
                          <strong>{item.user.name}</strong>
                        </>
                      ) : (
                        <>
                          <span className="badge bg-danger">Rejected By</span>
                          <strong>{item.user.name}</strong>
                        </>
                      )}
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
                            DELETE
                          </button>
                        ))}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {TOTAL_PAGES > 0 && (
            <nav>
              <ul className="pagination">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(1)}
                  >
                    First
                  </button>
                </li>
                {renderPageNumbers()}
                <li
                  className={`page-item ${
                    currentPage === TOTAL_PAGES ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(TOTAL_PAGES)}
                  >
                    Last
                  </button>
                </li>
              </ul>
            </nav>
          )}
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
