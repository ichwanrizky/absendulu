"use client";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import ModalFilter from "./modalFilter";

type ShiftActive = {
  id: number;
  nama: string;
  shift_id: number;
};

type Department = {
  id: number;
  nama_department: string;
  lot: string;
  latitude: string;
  longitude: string;
  radius: string;
};

type Shift = {
  id: number;
  jam_masuk: Date;
  jam_pulang: Date;
  different_day: boolean;
  department_id: number;
  keterangan: string;
  cond_friday: number;
  department: Department;
};

const ShiftActiveData = ({
  accessToken,
  departments,
  shifts,
}: {
  accessToken: string;
  departments: Department[];
  shifts: Shift[];
}) => {
  // loading state
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);

  // modal state
  const [isModalFilterOpen, setIsModalFilterOpen] = useState(false);

  // data state
  const [dataShiftKaryawan, setDataShiftKaryawan] = useState<any>([]);
  const [dataShift, setDataShift] = useState<Shift[]>(shifts);

  // filter
  const [filter, setFilter] = useState<any>({
    filter: false,
    department: departments[0].id.toString(),
  });

  const handleCreate = async () => {
    if (confirm("Save this data?")) {
      setIsLoadingCreate(true);
      try {
        const body = new FormData();
        body.append("shift_active", JSON.stringify(dataShiftKaryawan));

        const response = await fetch(
          process.env.NEXT_PUBLIC_API_URL +
            "/api/web/humanresource/shiftactive",
          {
            method: "POST",
            headers: {
              authorization: `Bearer ${accessToken}`,
            },
            body: body,
          }
        );

        const res = await response.json();
        if (!response.ok) {
          alert(res.message);
        } else {
          alert(res.message);
          mutate(
            process.env.NEXT_PUBLIC_API_URL +
              "/api/web/humanresource/shiftactive?filter=" +
              JSON.stringify(filter)
          );
        }
      } catch (error) {
        alert("something went wrong");
      }
      setIsLoadingCreate(false);
    }
  };

  const closeModal = () => {
    setIsModalFilterOpen(false);
    mutate(
      process.env.NEXT_PUBLIC_API_URL +
        "/api/web/humanresource/shiftactive?filter=" +
        JSON.stringify(filter)
    );
  };

  const handleFilter = async () => {
    setIsModalFilterOpen(true);
  };

  const handleFilterData = (department: any, dataShift: any) => {
    setIsModalFilterOpen(false);
    setFilter({ filter: true, department: department });
    setDataShift(dataShift);
  };

  const toggleShiftActive = (karyawan: number, shift: number) => {
    setDataShiftKaryawan(
      dataShiftKaryawan.map((item: ShiftActive) =>
        item.id === karyawan ? { ...item, shift_id: shift } : item
      )
    );
  };

  const toogleSelectAll = (shift: number) => {
    setDataShiftKaryawan(
      dataShiftKaryawan.map((item: ShiftActive) => {
        return { ...item, shift_id: shift };
      })
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
    process.env.NEXT_PUBLIC_API_URL +
      "/api/web/humanresource/shiftactive?filter=" +
      JSON.stringify(filter),
    fetcher
  );

  useEffect(() => {
    if (data?.data) {
      setDataShiftKaryawan(
        data?.data?.map((d: ShiftActive) => ({
          id: d.id,
          nama: d.nama,
          shift_id: d.shift_id,
        }))
      );
    }
  }, [data]);

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

  const shiftActives = data?.data;
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
                  ></span>
                  Loading...
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary btn-sm fw-bold"
                  onClick={() => handleCreate()}
                >
                  Save Changes
                </button>
              ))}

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
                onClick={() => {
                  setFilter({
                    filter: false,
                    department: departments[0].id.toString(),
                  });
                  setDataShift(shifts);
                }}
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
                <th
                  className="fw-semibold fs-6 align-middle"
                  style={{ width: "1%" }}
                >
                  No
                </th>
                <th className="fw-semibold fs-6 align-middle">Nama</th>
                {dataShift?.map((item: Shift, index: number) => (
                  <th
                    className="fw-semibold fs-6 text-center"
                    key={index}
                    style={{ width: "20%" }}
                  >
                    SHIFT {index + 1} <br />(
                    {new Date(item.jam_masuk).toLocaleString(
                      "id-ID",
                      optionsDate
                    )}
                    {" - "}
                    {new Date(item.jam_pulang).toLocaleString(
                      "id-ID",
                      optionsDate
                    )}
                    ) <br />
                    <a href="#!" onClick={() => toogleSelectAll(item.id)}>
                      CHECK ALL
                    </a>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shiftActives?.length === 0 ? (
                <tr>
                  <td colSpan={2}>
                    <div className="text-center">Tidak ada data</div>
                  </td>
                </tr>
              ) : (
                dataShiftKaryawan?.map((item: ShiftActive, index: number) => (
                  <tr key={index}>
                    <td align="center">{index + 1}</td>
                    <td align="left">{item.nama.toUpperCase()}</td>
                    {dataShift?.map((item2: Shift, index: number) => (
                      <td align="center">
                        <input
                          key={index}
                          type="radio"
                          name={item.id.toString()}
                          onChange={() => toggleShiftActive(item.id, item2.id)}
                          checked={item.shift_id === item2.id ? true : false}
                        />
                      </td>
                    ))}
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
          dataDepartment={departments}
          onFilter={handleFilterData}
          filterData={filter}
          accessToken={accessToken}
          shifts={shifts}
        />
      )}
    </>
  );
};
export default ShiftActiveData;

const optionsDate: any = {
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  timeZone: "UTC",
};
