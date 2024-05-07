"use client";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import ModalCreate from "./modalCreate";
import ModalEdit from "./modalEdit";
import { usePathname } from "next/navigation";

type Access = {
  id: number;
  menu_id: number;
  action: string[];
  role_id: number;
  roles: Roles;
};

type Roles = {
  id: number;
  role_name: string;
};

type MenuGroup = {
  id: number;
  menu_group: string;
  urut: number;
  group: number;
  parent_id: string;
  menu: Menu[];
};

type Menu = {
  id: number;
  menu: string;
};

type Department = {
  id: number;
  nama_department: string;
  lot: string;
  latitude: string;
  longitude: string;
  radius: string;
};

type AccessDepartment = {
  id: number;
  role_id: number;
  department_id: number;
  department: Department;
};

interface isLoadingProps {
  [key: number]: boolean;
}

const Data = ({ accessToken }: { accessToken: string }) => {
  const pathname = usePathname();
  const lastSlashIndex = pathname.lastIndexOf("/");
  const menu_url = pathname.substring(lastSlashIndex + 1);

  // loading state
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState<isLoadingProps>({});
  const [isLoadingEdit, setIsLoadingEdit] = useState<isLoadingProps>({});

  // modal state
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);

  // data state
  const [dataRoles, setDataRoles] = useState({} as Roles[]);
  const [dataMenuGroup, setdataMenuGroup] = useState({} as MenuGroup[]);
  const [dataAccess, setDataAccess] = useState({} as Access[]);
  const [dataDepartment, setDataDepartment] = useState({} as Department[]);
  const [dataAccessDepartment, setDataAccessDepartment] = useState(
    {} as AccessDepartment[]
  );

  const handleCreate = async () => {
    setIsLoadingCreate(true);
    try {
      // get roles
      const responseRoles = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/lib/listroles`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const resRoles = await responseRoles.json();

      // get menu
      const responseMenu = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/lib/menugroup_menu`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const resMenu = await responseMenu.json();

      // get department
      const responseDepartment = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/lib/listdepartment`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const resDepartment = await responseDepartment.json();

      if (!responseRoles.ok || !responseMenu.ok || !responseDepartment.ok) {
        alert(
          !responseRoles.ok
            ? resRoles.message
            : !responseMenu.ok
            ? resMenu.message
            : resDepartment.message
        );
      } else {
        setDataRoles(resRoles.data);
        setdataMenuGroup(resMenu.data);
        setDataDepartment(resDepartment.data);
        setIsModalCreateOpen(true);
      }
    } catch (error) {
      alert("something went wrong");
    }
    setIsLoadingCreate(false);
  };

  const handleEdit = async (id: number) => {
    setIsLoadingEdit((prev) => ({ ...prev, [id]: true }));
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/web/access/${id}?menu_url=${menu_url}`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const res = await response.json();

      // get menu
      const responseMenu = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/lib/menugroup_menu`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const resMenu = await responseMenu.json();

      // get department
      const responseDepartment = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/lib/listdepartment`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const resDepartment = await responseDepartment.json();

      // get akses department
      const responseAccessDepartment = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/lib/access_department/${id}`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const resAccessDepartment = await responseAccessDepartment.json();

      if (
        !response.ok ||
        !responseMenu.ok ||
        !responseDepartment.ok ||
        !responseAccessDepartment.ok
      ) {
        alert(
          !response.ok
            ? res.message
            : !responseMenu.ok
            ? resMenu.message
            : !responseDepartment.ok
            ? resDepartment.message
            : resAccessDepartment.message
        );
      } else {
        setDataAccess(res.data);
        setdataMenuGroup(resMenu.data);
        setDataDepartment(resDepartment.data);
        setDataAccessDepartment(resAccessDepartment.data);
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
          `${process.env.NEXT_PUBLIC_API_URL}/api/web/access/${id}?menu_url=${menu_url}`,
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
            `${process.env.NEXT_PUBLIC_API_URL}/api/web/access?menu_url=${menu_url}`
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/web/access?menu_url=${menu_url}`
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
    `${process.env.NEXT_PUBLIC_API_URL}/api/web/access?menu_url=${menu_url}`,
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
  const access = data?.data;
  const actions = data?.actions;

  return (
    <>
      <div className="card-body">
        <div className="row">
          <div className="col-sm-12">
            {actions?.includes("insert") &&
              (isLoadingCreate ? (
                <button
                  type="button"
                  className="btn btn-primary btn-sm fw-bold"
                  disabled
                >
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  />{" "}
                  LOADING...
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary btn-sm fw-bold"
                  onClick={() => handleCreate()}
                >
                  ADD DATA
                </button>
              ))}
          </div>
        </div>

        <div className="table-responsive mt-3">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th className="fw-semibold fs-6" style={{ width: "1%" }}>
                  NO
                </th>
                <th className="fw-semibold fs-6">ROLES</th>
                <th className="fw-semibold fs-6" style={{ width: "10%" }}>
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody>
              {access?.length === 0 ? (
                <tr>
                  <td colSpan={3}>
                    <div className="text-center">Tidak ada data</div>
                  </td>
                </tr>
              ) : (
                access?.map((item: Roles, index: number) => (
                  <tr key={index}>
                    <td align="center">{index + 1}</td>
                    <td>{item.role_name.toUpperCase()}</td>
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
          dataRoles={dataRoles}
          dataMenuGroup={dataMenuGroup}
          dataDepartment={dataDepartment}
        />
      )}

      {/* modal edit */}
      {isModalEditOpen && (
        <ModalEdit
          isModalOpen={isModalEditOpen}
          onClose={closeModal}
          accessToken={accessToken}
          dataAccess={dataAccess}
          dataMenuGroup={dataMenuGroup}
          dataDepartment={dataDepartment}
          dataAccessDepartment={dataAccessDepartment}
        />
      )}
    </>
  );
};
export default Data;
