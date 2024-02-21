"use client";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import ModalCreate from "./modalCreate";
import ModalEdit from "./modalEdit";
import ModalFilter from "./modalFilter";

type Karyawan = {
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
  const [isLoadingFilter, setIsLoadingFilter] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState<isLoadingProps>({});
  const [isLoadingEdit, setIsLoadingEdit] = useState<isLoadingProps>({});

  const [isModalCreateOpen, setModalCreateOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [isModalFilterOpen, setIsModalFilterOpen] = useState(false);

  const [dataEdit, setDataEdit] = useState({} as Karyawan);
  const [subDepartments, setSubDepartments] = useState([] as SubDepartment[]);

  // filter
  const [filter, setFilter] = useState({
    filter: false,
    department: departments[0].id.toString(),
    subDepartment: "",
  });

  const closeModal = () => {
    setModalCreateOpen(false);
    setIsModalEditOpen(false);
    setIsModalFilterOpen(false);
    mutate(
      process.env.NEXT_PUBLIC_API_URL +
        "/api/web/masterdata/datakaryawan?filter=" +
        JSON.stringify(filter)
    );
  };

  const handleFilterData = (department: any, subDepartment: any) => {
    setIsModalFilterOpen(false);
    setFilter({
      filter: true,
      department: department,
      subDepartment: subDepartment,
    });
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

  const handleCreate = () => {
    setModalCreateOpen(true);
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
              "/api/web/masterdata/datakaryawan?filter=" +
              JSON.stringify(filter)
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
    process.env.NEXT_PUBLIC_API_URL +
      "/api/web/masterdata/datakaryawan?filter=" +
      JSON.stringify(filter),
    fetcher
  );

  if (isLoading) {
    return <></>;
  }

  if (error) {
    return <>something went wrong</>;
  }

  const employees = data?.data;
  const actions = data?.actions;

  return (
    <>
      <div className="card-body">
        <div className="row">
          <div className="col-sm-12">
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
                className="btn btn-dark btn-sm fw-bold ms-2"
                onClick={() => handleFilter()}
              >
                Filter Data
              </button>
            )}

            {filter.filter && (
              <button
                type="button"
                className="btn btn-outline-dark btn-sm fw-bold ms-1"
                onClick={() =>
                  setFilter({
                    filter: false,
                    department: departments[0].id.toString(),
                    subDepartment: "",
                  })
                }
              >
                Reset
              </button>
            )}
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
                    <td align="center">{index + 1}</td>
                    <td align="left">{item.panji_id.toUpperCase()}</td>
                    <td align="left">{item.nama.toUpperCase()}</td>
                    <td align="left">
                      {item.department.nama_department.toUpperCase()}
                    </td>
                    <td align="left">
                      {item.sub_department.nama_sub_department.toUpperCase()}
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
        </div>
      </div>

      {/* modal create */}
      {isModalCreateOpen && (
        <ModalCreate
          isModalOpen={isModalCreateOpen}
          onClose={closeModal}
          accessToken={accessToken}
          departments={departments}
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
