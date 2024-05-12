"use client";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import ModalCreate from "./modalCreate";
import ModalEdit from "./modalEdit";
import { usePathname } from "next/navigation";

type SubDepartment = {
  id: number;
  nama_sub_department: string;
  department_id: number;
  department: Department;
  akses_izin: string;
  manager_id: number;
  manager: {
    pegawai: Karyawan;
  };
};
type Department = {
  id: number;
  nama_department: string;
  lot: string;
  latitude: string;
  longitude: string;
  radius: string;
};

type Karyawan = {
  id: number;
  nama: string;
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

  // loading state
  const [isLoadingDelete, setIsLoadingDelete] = useState<isLoadingProps>({});
  const [isLoadingEdit, setIsLoadingEdit] = useState<isLoadingProps>({});

  // modal state
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);

  // data state
  const [dataEdit, setDataEdit] = useState({} as SubDepartment);
  const [listManager, setListManager] = useState([] as Karyawan[]);

  // filter
  const [selectDept, setSelectDept] = useState(departments[0].id.toString());

  const handleCreate = async () => {
    setIsModalCreateOpen(true);
  };

  const handleEdit = async (id: number) => {
    setIsLoadingEdit((prev) => ({ ...prev, [id]: true }));
    try {
      // get edit data
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/web/subdepartment/${id}?menu_url=${menu_url}`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const res = await response.json();

      // list karyawan
      const body = new FormData();
      body.append("department", selectDept);
      const responseKaryawan = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/lib/listmanager`,
        {
          method: "POST",
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
          body: body,
        }
      );
      const resKaryawan = await responseKaryawan.json();

      if (!response.ok || !responseKaryawan.ok) {
        alert(!response.ok ? res.message : resKaryawan.message);
      } else {
        setDataEdit(res.data);
        setListManager(resKaryawan.data);
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
          `${process.env.NEXT_PUBLIC_API_URL}/api/web/subdepartment/${id}?menu_url=${menu_url}`,

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
            `${process.env.NEXT_PUBLIC_API_URL}/api/web/subdepartment?menu_url=${menu_url}&select_dept=${selectDept}`
          );
        }
      } catch (error) {
        alert("something went wrong");
      }
      setIsLoadingDelete((prev) => ({ ...prev, [id]: false }));
    }
  };

  const closeModal = () => {
    setIsModalCreateOpen(false);
    setIsModalEditOpen(false);
    mutate(
      `${process.env.NEXT_PUBLIC_API_URL}/api/web/subdepartment?menu_url=${menu_url}&select_dept=${selectDept}`
    );
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
    `${process.env.NEXT_PUBLIC_API_URL}/api/web/subdepartment?menu_url=${menu_url}&select_dept=${selectDept}`,
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

  const subDepartments = data?.data;
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
                ADD DATA
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
          </div>
        </div>

        <div className="table-responsive mt-3">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th className="fw-semibold fs-6" style={{ width: "1%" }}>
                  NO
                </th>
                <th className="fw-semibold fs-6">SUB DEPARTMENT</th>
                <th className="fw-semibold fs-6" style={{ width: "15%" }}>
                  DEPARTMENT
                </th>
                <th className="fw-semibold fs-6" style={{ width: "15%" }}>
                  PENANGGUNG JAWAB
                </th>
                <th className="fw-semibold fs-6" style={{ width: "10%" }}>
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody>
              {subDepartments?.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="text-center">Tidak ada data</div>
                  </td>
                </tr>
              ) : (
                subDepartments?.map((item: SubDepartment, index: number) => (
                  <tr key={index}>
                    <td align="center">{index + 1}</td>
                    <td align="left">
                      {item.nama_sub_department.toUpperCase()}
                    </td>
                    <td align="left">
                      {item.department.nama_department.toUpperCase()}
                    </td>
                    <td align="left">
                      {item.manager?.pegawai.nama?.toUpperCase()}
                    </td>
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
                              onClick={() => handleEdit(item.id)}
                            >
                              EDIT
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
                              DELETE
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
          dataDepartment={departments}
        />
      )}

      {/* modal edit */}
      {isModalEditOpen && (
        <ModalEdit
          isModalOpen={isModalEditOpen}
          onClose={closeModal}
          accessToken={accessToken}
          dataDepartment={departments}
          data={dataEdit}
          dataManager={listManager}
        />
      )}
    </>
  );
};
export default Data;
