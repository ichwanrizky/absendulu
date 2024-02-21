"use client";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import ModalFilter from "./modalFilter";
import ModalEdit from "./modalEdit";
import ModalCreate from "./modalCreate";

type Karyawan = {
  number: number;
  id: number;
  panji_id: string;
  nama: string;
  nik_ktp: string;
  tmp_lahir: string;
  tgl_lahir: Date;
  jk: string;
  agama: string;
  kebangsaan: string;
  alamat: string;
  rt: string;
  rw: string;
  kel: string;
  kec: string;
  kota: string;
  telp: string;
  status_nikah: string;
  tgl_join: null;
  tgl_selesai: null;
  tgl_reset: null;
  email: string;
  position: string;
  npwp: string;
  jenis_bank: string;
  no_rek: string;
  bpjs_tk: string;
  bpjs_kes: string;
  department_id: number;
  sub_department_id: number;
  is_active: boolean;
  is_overtime: boolean;
  department: Department;
  sub_department: SubDepartment;
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

const KaryawanData = ({
  accessToken,
  departments,
}: {
  accessToken: string;
  departments: Department[];
}) => {
  // pagination
  const [currentPage, setCurrentPage] = useState(1);

  // loading state
  const [isLoadingFilter, setIsLoadingFilter] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState<isLoadingProps>({});
  const [isLoadingEdit, setIsLoadingEdit] = useState<isLoadingProps>({});

  // modal state
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [isModalFilterOpen, setIsModalFilterOpen] = useState(false);

  // data state
  const [dataEdit, setDataEdit] = useState({} as Karyawan);
  const [subDepartments, setSubDepartments] = useState([] as SubDepartment[]);

  // filter state
  const [filter, setFilter] = useState({
    filter: false,
    department: departments[0].id.toString(),
    subDepartment: "",
    active: "1",
  });

  //search state
  const [typingTimeout, setTypingTimeout] = useState<any>();
  const [search, setSearch] = useState("");

  const handleCreate = () => {
    setIsModalCreateOpen(true);
  };

  const handleEdit = async (id: number, department: number) => {
    setIsLoadingEdit((prev) => ({ ...prev, [id]: true }));
    try {
      // data edit
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL +
          "/api/web/masterdata/datakaryawan/" +
          id,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const res = await response.json();

      // sub department
      const responseSubDepartment = await fetch(
        process.env.NEXT_PUBLIC_API_URL +
          "/api/web/masterdata/subdepartment?filter=" +
          JSON.stringify({ department: department }),
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const resSubDepartment = await responseSubDepartment.json();

      if (!response.ok || !responseSubDepartment.ok) {
        alert(!response.ok ? res.message : resSubDepartment.message);
      } else {
        setDataEdit(res.data);
        setSubDepartments(resSubDepartment.data);
        setIsModalEditOpen(true);
      }
    } catch (error) {
      alert("something went wrong");
    }
    setIsLoadingEdit((prev) => ({ ...prev, [id]: false }));
  };

  const handleDelete = async (id: number) => {
    if (confirm("Delete this data?")) {
      setIsLoadingDelete((prev) => ({ ...prev, [id]: true }));
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_API_URL +
            "/api/web/masterdata/datakaryawan/" +
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
              "/api/web/masterdata/datakaryawan?page=" +
              currentPage +
              "&filter=" +
              JSON.stringify(filter)
          );
        }
      } catch (error) {
        alert("something went wrong");
      }
      setIsLoadingDelete((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleSearch = (search: any) => {
    if (typingTimeout) clearTimeout(typingTimeout);
    const newTimeout = setTimeout(() => {
      setSearch(search);
      setCurrentPage(1);
    }, 1000);

    // Update the timeout ID in state
    setTypingTimeout(newTimeout);
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

  const closeModal = () => {
    setIsModalCreateOpen(false);
    setIsModalEditOpen(false);
    setIsModalFilterOpen(false);
    mutate(
      process.env.NEXT_PUBLIC_API_URL +
        "/api/web/masterdata/datakaryawan?page=" +
        currentPage +
        "&filter=" +
        JSON.stringify(filter)
    );
  };

  const handleFilterData = (
    department: any,
    subDepartment: any,
    active: any
  ) => {
    setIsModalFilterOpen(false);
    setFilter({
      filter: true,
      department: department,
      subDepartment: subDepartment,
      active: active,
    });
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
          "/api/web/masterdata/datakaryawan?page=" +
          currentPage +
          "&filter=" +
          JSON.stringify(filter)
      : process.env.NEXT_PUBLIC_API_URL +
          "/api/web/masterdata/datakaryawan?page=" +
          1 +
          "&filter=" +
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

  const employees = data?.data;
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
            {/* button */}
            <div>
              {actions?.includes("insert") && (
                <button
                  type="button"
                  className="btn btn-primary btn-sm fw-bold"
                  onClick={() => handleCreate()}
                >
                  Add Data
                </button>
              )}
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
                      active: "1",
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
                <th className="fw-semibold fs-6" style={{ width: "8%" }}>
                  ID
                </th>
                <th className="fw-semibold fs-6" style={{ width: "25%" }}>
                  Nama
                </th>
                <th className="fw-semibold fs-6">Department</th>
                <th className="fw-semibold fs-6">Sub Department</th>
                <th className="fw-semibold fs-6">Posisi</th>
                <th className="fw-semibold fs-6" style={{ width: "10%" }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {employees?.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="text-center">Tidak ada data</div>
                  </td>
                </tr>
              ) : (
                employees?.map((item: Karyawan, index: number) => (
                  <tr key={index}>
                    <td align="center">{item.number}</td>
                    <td align="left">{item.panji_id?.toUpperCase()}</td>
                    <td align="left">{item.nama.toUpperCase()}</td>
                    <td align="left">
                      {item.department?.nama_department.toUpperCase()}
                    </td>
                    <td align="left">
                      {item.sub_department?.nama_sub_department.toUpperCase()}
                    </td>
                    <td align="left">{item.position.toUpperCase()}</td>
                    <td>
                      <div className="d-flex gap-2">
                        {actions?.includes("update") &&
                          (isLoadingEdit[item.id] ? (
                            <button className="btn btn-success btn-sm" disabled>
                              <span
                                className="spinner-border spinner-border-sm"
                                role="status"
                                aria-hidden="true"
                              />
                            </button>
                          ) : (
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() =>
                                handleEdit(item.id, item.department_id)
                              }
                            >
                              Edit
                            </button>
                          ))}

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
                      </div>
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

      {/* modal create */}
      {isModalCreateOpen && (
        <ModalCreate
          isModalOpen={isModalCreateOpen}
          onClose={closeModal}
          accessToken={accessToken}
          dataDepartment={departments}
        />
      )}

      {/* modal edit */}
      {isModalEditOpen && (
        <ModalEdit
          isModalOpen={isModalEditOpen}
          onClose={closeModal}
          accessToken={accessToken}
          data={dataEdit}
          dataDepartment={departments}
          dataSubDepartment={subDepartments}
        />
      )}

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
export default KaryawanData;
