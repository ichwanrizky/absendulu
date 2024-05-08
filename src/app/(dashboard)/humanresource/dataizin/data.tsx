"use client";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import ModalFilter from "./modalFilter";

type PengajuanIzin = {
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
type SubDepartment = {
  id: number;
  nama_sub_department: string;
  department_id: number;
  department: Department;
};
interface isLoadingProps {
  [key: number]: boolean;
}

const IzinData = ({
  accessToken,
  departments,
}: {
  accessToken: string;
  departments: Department[];
}) => {
  // loading state
  const [isLoadingFilter, setIsLoadingFilter] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState<isLoadingProps>({});

  // modal state
  const [isModalFilterOpen, setIsModalFilterOpen] = useState(false);

  // data state
  const [subDepartments, setSubDepartments] = useState([] as SubDepartment[]);

  // filter state
  const [filter, setFilter] = useState({
    filter: false,
    department: departments[0].id.toString(),
    subDepartment: "",
  });

  //search state
  const [typingTimeout, setTypingTimeout] = useState<any>();
  const [search, setSearch] = useState("");

  const handleDelete = async (id: number) => {
    if (confirm("Delete this data?")) {
      setIsLoadingDelete((prev) => ({ ...prev, [id]: true }));
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_API_URL +
            "/api/web/humanresource/dataizin/" +
            id,
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
            process.env.NEXT_PUBLIC_API_URL +
              "/api/web/humanresource/dataizin?&filter=" +
              JSON.stringify(filter)
          );
        }
      } catch (error) {
        alert("something went wrong");
      }
      setIsLoadingDelete((prev) => ({ ...prev, [id]: false }));
    }
  };

  const closeModal = () => {
    setIsModalFilterOpen(false);
    mutate(
      process.env.NEXT_PUBLIC_API_URL +
        "/api/web/humanresource/dataizin?filter=" +
        JSON.stringify(filter)
    );
  };

  const handleFilter = async () => {
    setIsLoadingFilter(true);
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL +
          "/api/web/masterdata/subdepartment?filter=" +
          JSON.stringify({ department: departments[0].id }),
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const res = await response.json();

      if (!response.ok) {
        alert(res.message);
      } else {
        setSubDepartments(res.data);
        setIsModalFilterOpen(true);
      }
    } catch (error) {
      alert("something went wrong");
    }
    setIsLoadingFilter(false);
  };

  const handleFilterData = (department: any, subDepartment: any) => {
    setIsModalFilterOpen(false);
    setFilter({
      filter: true,
      department: department,
      subDepartment: subDepartment,
    });
  };

  const handleSearch = (search: any) => {
    if (typingTimeout) clearTimeout(typingTimeout);
    const newTimeout = setTimeout(() => {
      setSearch(search);
    }, 1000);

    // Update the timeout ID in state
    setTypingTimeout(newTimeout);
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
      ? process.env.NEXT_PUBLIC_API_URL +
          "/api/web/humanresource/dataizin?&filter=" +
          JSON.stringify(filter)
      : process.env.NEXT_PUBLIC_API_URL +
          "/api/web/humanresource/dataizin?&filter=" +
          JSON.stringify(filter) +
          "&search=" +
          search,
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
              onChange={(e) => handleSearch(e.target.value)}
              className="form-control-sm ms-2"
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
      <div className="card-body text-center">
        something went wrong, please refresh the page
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
            {/* button */}
            <div>
              {isLoadingFilter ? (
                <button
                  type="button"
                  className="btn btn-dark btn-sm fw-bold ms-2"
                  disabled
                >
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  />{" "}
                  Loading...
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-dark btn-sm fw-bold ms-1"
                  onClick={() => handleFilter()}
                >
                  Filter Data
                </button>
              )}

              {filter.filter && (
                <button
                  type="button"
                  className="btn btn-outline-dark btn-sm fw-bold ms-1"
                  onClick={() => {
                    setFilter({
                      filter: false,
                      department: departments[0].id.toString(),
                      subDepartment: "",
                    });
                  }}
                >
                  Reset
                </button>
              )}
            </div>

            <input
              type="text"
              placeholder="Search..."
              aria-label="Search"
              onChange={(e) => handleSearch(e.target.value)}
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
                  No
                </th>
                <th className="fw-semibold fs-6" style={{ width: "15%" }}>
                  Nama
                </th>
                <th className="fw-semibold fs-6" style={{ width: "10%" }}>
                  Jenis Izin
                </th>
                <th className="fw-semibold fs-6" style={{ width: "15%" }}>
                  Tanggal
                </th>
                <th className="fw-semibold fs-6" style={{ width: "5%" }}>
                  Jumlah Hari
                </th>
                <th className="fw-semibold fs-6" style={{ width: "5%" }}>
                  Jumlah Jam
                </th>
                <th className="fw-semibold fs-6" style={{ width: "5%" }}>
                  MC
                </th>
                <th className="fw-semibold fs-6" style={{ width: "15%" }}>
                  Keterangan
                </th>
                <th className="fw-semibold fs-6" style={{ width: "10%" }}>
                  Status
                </th>
                <th className="fw-semibold fs-6" style={{ width: "5%" }}>
                  Action
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
                  <tr key={index} style={{ verticalAlign: "middle" }}>
                    <td align="center">{index + 1}</td>
                    <td align="left">{item.pegawai.nama}</td>
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

      {/* modal filter */}
      {isModalFilterOpen && (
        <ModalFilter
          isModalOpen={isModalFilterOpen}
          onClose={closeModal}
          accessToken={accessToken}
          dataDepartment={departments}
          dataSubDepartment={subDepartments}
          onFilter={handleFilterData}
          filterData={filter}
        />
      )}
    </>
  );
};
export default IzinData;

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
