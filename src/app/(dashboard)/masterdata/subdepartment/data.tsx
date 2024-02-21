"use client";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import ModalCreate from "./modalCreate";
import ModalEdit from "./modalEdit";
import ModalFilter from "./modalFilter";

type SubDepartment = {
  id: number;
  nama_sub_department: string;
  department_id: number;
  department: Department;
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

const SubDepartmentData = ({
  accessToken,
  departments,
}: {
  accessToken: string;
  departments: Department[];
}) => {
  const [isLoadingDelete, setIsLoadingDelete] = useState<isLoadingProps>({});
  const [isLoadingEdit, setIsLoadingEdit] = useState<isLoadingProps>({});

  const [isLoadingCreate, setIsLoadingCreate] = useState(false);
  const [isLoadingFilter, setIsLoadingFilter] = useState(false);
  const [isModalCreateOpen, setModalCreateOpen] = useState(false);
  const [isModalFilterOpen, setIsModalFilterOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);

  const [dataEdit, setDataEdit] = useState({} as SubDepartment);

  // filter
  const [filter, setFilter] = useState<any>("");

  const closeModal = () => {
    setModalCreateOpen(false);
    setIsModalEditOpen(false);
    setIsModalFilterOpen(false);
    mutate(
      process.env.NEXT_PUBLIC_API_URL + "/api/web/masterdata/subdepartment"
    );
  };

  const handleFilterData = (department: any) => {
    setIsModalFilterOpen(false);
    department ? setFilter({ department: department }) : setFilter("");
  };

  const handleCreate = async () => {
    setModalCreateOpen(true);
  };

  const handleEdit = async (id: number) => {
    setIsLoadingEdit((prev) => ({ ...prev, [id]: true }));
    try {
      // get edit data
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL +
          "/api/web/masterdata/subdepartment/" +
          id,
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
        setDataEdit(res.data);
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
            "/api/web/masterdata/subdepartment/" +
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
            filter === ""
              ? process.env.NEXT_PUBLIC_API_URL +
                  "/api/web/masterdata/subdepartment"
              : process.env.NEXT_PUBLIC_API_URL +
                  "/api/web/masterdata/subdepartment?filter=" +
                  JSON.stringify(filter)
          );
        }
      } catch (error) {
        alert("something went wrong");
      }
      setIsLoadingDelete((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleFilter = async () => {
    setIsModalFilterOpen(true);
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
    filter === ""
      ? process.env.NEXT_PUBLIC_API_URL + "/api/web/masterdata/subdepartment"
      : process.env.NEXT_PUBLIC_API_URL +
          "/api/web/masterdata/subdepartment?filter=" +
          JSON.stringify(filter),
    fetcher
  );

  if (isLoading) {
    return <></>;
  }

  if (error) {
    return <>something went wrong</>;
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
                Add Data
              </button>
            )}

            <button
              type="button"
              className="btn btn-dark btn-sm fw-bold ms-2"
              onClick={() => handleFilter()}
            >
              Filter Data
            </button>
            {filter !== "" && (
              <button
                type="button"
                className="btn btn-outline-dark btn-sm fw-bold ms-1"
                onClick={() => setFilter("")}
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
                <th className="fw-semibold fs-6">Sub Department</th>
                <th className="fw-semibold fs-6" style={{ width: "30%" }}>
                  Department
                </th>
                <th className="fw-semibold fs-6" style={{ width: "10%" }}>
                  Action
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
        />
      )}

      {/* modal filter */}
      {isModalFilterOpen && (
        <ModalFilter
          isModalOpen={isModalFilterOpen}
          onClose={closeModal}
          accessToken={accessToken}
          dataDepartment={departments}
          onFilter={handleFilterData}
          filterData={filter}
        />
      )}
    </>
  );
};
export default SubDepartmentData;
