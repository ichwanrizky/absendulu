"use client";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import ModalCreate from "./modalCreate";
import ModalEdit from "./modalEdit";
import ModalFilter from "./modalFilter";

type Department = {
  id: number;
  nama_department: string;
  lot: string;
  latitude: string;
  longitude: string;
  radius: string;
};

type TanggalMerah = {
  id: number;
  bulan: number;
  tahun: number;
  department_id: number;
  tanggal_merah_list: TanggalMerahList[];
  department: Department;
};

type TanggalMerahList = {
  tanggal: Date;
  tanggal_nomor: string;
};

interface isLoadingProps {
  [key: number]: boolean;
}

const TanggalMerahData = ({
  accessToken,
  departments,
}: {
  accessToken: string;
  departments: Department[];
}) => {
  // loading state
  const [isLoadingDelete, setIsLoadingDelete] = useState<isLoadingProps>({});
  const [isLoadingEdit, setIsLoadingEdit] = useState<isLoadingProps>({});

  // modal state
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [isModalFilterOpen, setIsModalFilterOpen] = useState(false);

  // data state
  const [dataEdit, setDataEdit] = useState({} as TanggalMerah);

  // filter
  const [filter, setFilter] = useState<any>({
    filter: false,
    department: departments[0].id.toString(),
    tahun: new Date().getFullYear(),
  });

  const handleCreate = async () => {
    setIsModalCreateOpen(true);
  };

  const handleEdit = async (id: number) => {
    setIsLoadingEdit((prev) => ({ ...prev, [id]: true }));
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL +
          "/api/web/configuration/tanggalmerah/" +
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
            "/api/web/configuration/tanggalmerah/" +
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
              "/api/web/configuration/tanggalmerah?filter=" +
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
    setIsModalCreateOpen(false);
    setIsModalEditOpen(false);
    setIsModalFilterOpen(false);
    mutate(
      process.env.NEXT_PUBLIC_API_URL +
        "/api/web/configuration/tanggalmerah?filter=" +
        JSON.stringify(filter)
    );
  };

  const handleFilter = async () => {
    setIsModalFilterOpen(true);
  };

  const handleFilterData = (department: any, tahun: any) => {
    setIsModalFilterOpen(false);
    setFilter({ filter: true, department: department, tahun: tahun });
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
      "/api/web/configuration/tanggalmerah?filter=" +
      JSON.stringify(filter),
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
      <div className="card-body text-center">
        something went wrong, please refresh the page
      </div>
    );
  }

  const holidays = data?.data;
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
            {filter.filter && (
              <button
                type="button"
                className="btn btn-outline-dark btn-sm fw-bold ms-1"
                onClick={() =>
                  setFilter({
                    filter: false,
                    department: departments[0].id.toString(),
                    tahun: new Date().getFullYear(),
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
                <th className="fw-semibold fs-6" style={{ width: "20%" }}>
                  Department
                </th>
                <th className="fw-semibold fs-6" style={{ width: "10%" }}>
                  Tahun
                </th>
                <th className="fw-semibold fs-6" style={{ width: "15%" }}>
                  Bulan
                </th>
                <th className="fw-semibold fs-6">Tanggal Merah</th>
                <th className="fw-semibold fs-6" style={{ width: "10%" }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {holidays?.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="text-center">Tidak ada data</div>
                  </td>
                </tr>
              ) : (
                holidays?.map((item: TanggalMerah, index: number) => (
                  <tr key={index}>
                    <td align="center">{index + 1}</td>
                    <td align="left">
                      {item.department?.nama_department?.toUpperCase()}
                    </td>
                    <td align="center">{item.tahun}</td>
                    <td>{monthNames(item.bulan)}</td>
                    <td
                      style={{
                        maxWidth: "100px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        textAlign: "left",
                      }}
                    >
                      {item.tanggal_merah_list
                        ?.map((item: TanggalMerahList) =>
                          new Date(item.tanggal as Date)
                            .toLocaleString("id-ID", optionsDate)
                            .replace(/\//g, "-")
                        )
                        .join(", ")}
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
          dataEdit={dataEdit}
        />
      )}

      {/* modal filter */}
      {isModalFilterOpen && (
        <ModalFilter
          isModalOpen={isModalFilterOpen}
          onClose={closeModal}
          dataDepartment={departments}
          onFilter={handleFilterData}
          filterData={filter}
        />
      )}
    </>
  );
};
export default TanggalMerahData;

const optionsDate: any = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: "UTC",
};

const monthNames = (month: number) => {
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

  return monthNames[month - 1];
};
