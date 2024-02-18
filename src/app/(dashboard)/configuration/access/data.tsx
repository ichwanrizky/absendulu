"use client";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import ModalCreate from "./modalCreate";
import ModalEdit from "./modalEdit";

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

interface isLoadingProps {
  [key: number]: boolean;
}

const MenuGroupData = ({ accessToken }: { accessToken: string }) => {
  const [isLoadingDelete, setIsLoadingDelete] = useState<isLoadingProps>({});
  const [isLoadingEdit, setIsLoadingEdit] = useState<isLoadingProps>({});

  const [isLoadingCreate, setIsLoadingCreate] = useState(false);
  const [isModalCreateOpen, setModalCreateOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);

  const [dataRoles, setDataRoles] = useState({} as Roles[]);
  const [dataMenuGroup, setdataMenuGroup] = useState({} as MenuGroup[]);
  const [dataAccess, setDataAccess] = useState({} as Access[]);

  const closeModal = () => {
    setModalCreateOpen(false);
    setIsModalEditOpen(false);
    mutate(
      process.env.NEXT_PUBLIC_API_URL + "/api/web/configuration/menugroup"
    );
  };

  const handleCreate = async () => {
    setIsLoadingCreate(true);
    try {
      // get roles
      const responseRoles = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/api/web/getrolesaccess",
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const resRoles = await responseRoles.json();

      // get menu
      const responseMenu = await fetch(
        process.env.NEXT_PUBLIC_API_URL +
          "/api/web/configuration/menugroup_menu",
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const resMenu = await responseMenu.json();

      if (!responseRoles.ok || !responseMenu.ok) {
        alert(!responseRoles.ok ? resRoles.message : resMenu.message);
      } else {
        setDataRoles(resRoles.data);
        setdataMenuGroup(resMenu.data);
        setModalCreateOpen(true);
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
        process.env.NEXT_PUBLIC_API_URL + "/api/web/configuration/access/" + id,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const res = await response.json();

      // get menu
      const responseMenu = await fetch(
        process.env.NEXT_PUBLIC_API_URL +
          "/api/web/configuration/menugroup_menu",
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const resMenu = await responseMenu.json();

      if (!response.ok || !responseMenu.ok) {
        alert(!response.ok ? res.message : resMenu.message);
      } else {
        setDataAccess(res.data);
        setdataMenuGroup(resMenu.data);
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
            "/api/web/configuration/access/" +
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
            process.env.NEXT_PUBLIC_API_URL + "/api/web/configuration/access"
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
    process.env.NEXT_PUBLIC_API_URL + "/api/web/configuration/access",
    fetcher
  );

  if (isLoading) {
    return <></>;
  }

  if (error) {
    return <>something went wrong</>;
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
                  Loading...
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary btn-sm fw-bold"
                  onClick={() => handleCreate()}
                >
                  Add Data
                </button>
              ))}
          </div>
        </div>

        <div className="table-responsive mt-3">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th className="fw-semibold fs-6" style={{ width: "1%" }}>
                  No
                </th>
                <th className="fw-semibold fs-6">Roles</th>
                <th className="fw-semibold fs-6" style={{ width: "10%" }}>
                  Action
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
          dataRoles={dataRoles}
          dataMenuGroup={dataMenuGroup}
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
        />
      )}
    </>
  );
};
export default MenuGroupData;
