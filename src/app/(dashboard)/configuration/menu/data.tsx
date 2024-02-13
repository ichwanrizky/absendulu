"use client";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import ModalCreate from "./modalCreate";
import ModalEdit from "./modalEdit";

type Menu = {
  id: number;
  menu: string;
  path: string;
  urut: number;
  menu_group_id: number;
  menu_group: MenuGroup;
};

type MenuGroup = {
  menu_group: string;
};

type MenuGroups = {
  id: number;
  menu_group: string;
  urut: number;
  group: number;
  parent_id: string;
};

interface isLoadingProps {
  [key: number]: boolean;
}

const MenuData = ({ accessToken }: { accessToken: string }) => {
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState<isLoadingProps>({});
  const [isLoadingEdit, setIsLoadingEdit] = useState<isLoadingProps>({});

  const [isModalCreateOpen, setModalCreateOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);

  const [menuGroups, setMenuGroups] = useState({} as MenuGroups[]);
  const [dataEdit, setDataEdit] = useState({} as Menu);

  const closeModal = () => {
    setModalCreateOpen(false);
    setIsModalEditOpen(false);
    mutate(process.env.NEXT_PUBLIC_API_URL + "/api/web/configuration/menu");
  };

  const handleCreate = async () => {
    setIsLoadingCreate(true);
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/api/web/configuration/menugroup",
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
        setMenuGroups(res.data);
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
        process.env.NEXT_PUBLIC_API_URL + "/api/web/configuration/menugroup",
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const response2 = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/api/web/configuration/menu/" + id,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const res = await response.json();
      const res2 = await response2.json();
      if (!response.ok || !response2.ok) {
        alert(!response.ok ? res.message : res2.message);
      } else {
        setMenuGroups(res.data);
        setDataEdit(res2.data);
        setIsModalEditOpen(true);
      }
    } catch (error) {
      console.log(error);

      alert("something went wrong");
    }
    setIsLoadingEdit((prev) => ({ ...prev, [id]: false }));
  };

  const handleDelete = async (id: number) => {
    if (confirm("Delete this data?")) {
      setIsLoadingDelete((prev) => ({ ...prev, [id]: true }));
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_API_URL + "/api/web/configuration/menu/" + id,
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
            process.env.NEXT_PUBLIC_API_URL + "/api/web/configuration/menu"
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
    process.env.NEXT_PUBLIC_API_URL + "/api/web/configuration/menu",
    fetcher
  );

  if (isLoading) {
    return <></>;
  }

  if (error) {
    return <>something went wrong</>;
  }

  const menus = data?.data;
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
                <th className="fw-semibold fs-6">Menu</th>
                <th className="fw-semibold fs-6" style={{ width: "15%" }}>
                  Path
                </th>
                <th className="fw-semibold fs-6" style={{ width: "15%" }}>
                  Group
                </th>
                <th className="fw-semibold fs-6" style={{ width: "10%" }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {menus?.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="text-center">Tidak ada data</div>
                  </td>
                </tr>
              ) : (
                menus?.map((item: Menu, index: number) => (
                  <tr key={index}>
                    <td align="center">{index + 1}</td>
                    <td>{item.menu}</td>
                    <td>{item.path}</td>
                    <td>{item.menu_group.menu_group}</td>
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
          menuGroups={menuGroups}
        />
      )}

      {/* modal edit */}
      {isModalEditOpen && (
        <ModalEdit
          isModalOpen={isModalEditOpen}
          onClose={closeModal}
          accessToken={accessToken}
          menuGroups={menuGroups}
          dataEdit={dataEdit}
        />
      )}
    </>
  );
};
export default MenuData;
