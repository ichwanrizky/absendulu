"use client";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import { usePathname } from "next/navigation";
import ModalCreate from "./modalCreate";

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
};

type PengajuanOvertime = {
  id: number;
  tanggal: string;
  jam_from: string;
  jam_to: string;
  job_desc: string;
  remark: string;
  status: number;
  pengajuan_overtime_pegawai: Array<{
    pegawai: {
      nama: string;
    };
  }>;
  sub_department: SubDepartment;
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

  // modal state
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);

  // loading state
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState<isLoadingProps>({});
  const [isLoadingApprove, setIsLoadingApprove] = useState<isLoadingProps>({});

  // filter
  const [selectDept, setSelectDept] = useState(departments[0].id.toString());

  //search state
  const [search, setSearch] = useState("");

  const [subDepartments, setSubDepartments] = useState([] as SubDepartment[]);

  const handleCreate = async () => {
    setIsLoadingCreate(true);
    try {
      const body = new FormData();
      body.append("department", selectDept);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/lib/listsubdepartment`,
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
        setSubDepartments(res.data);
        setIsModalCreateOpen(true);
      }
    } catch (error) {
      alert("something went wrong");
    }
    setIsLoadingCreate(false);
  };

  const closeModal = () => {
    setIsModalCreateOpen(false);
    setSearch("");
  };

  const handleDelete = async (id: number) => {
    if (confirm("Delete this data?")) {
      setIsLoadingDelete((prev) => ({ ...prev, [id]: true }));
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/web/pengajuanizin/${id}?menu_url=${menu_url}`,
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
          setSearch("");
          mutate(
            `${process.env.NEXT_PUBLIC_API_URL}/api/web/pengajuanizin?menu_url=${menu_url}&select_dept=${selectDept}`
          );
        }
      } catch (error) {
        alert("something went wrong");
      }
      setIsLoadingDelete((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleApprove = async (id: number) => {
    if (confirm("Approve this data?")) {
      setIsLoadingApprove((prev) => ({ ...prev, [id]: true }));
      try {
        const body = new FormData();
        body.append("status", "1");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/web/pengajuanizin/${id}?menu_url=${menu_url}`,
          {
            method: "POST",
            body: body,
            headers: {
              authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const res = await response.json();
        if (!response.ok) {
          alert(res.message);
        } else {
          alert(res.message);
          setSearch("");
          mutate(
            `${process.env.NEXT_PUBLIC_API_URL}/api/web/pengajuanizin?menu_url=${menu_url}&select_dept=${selectDept}`
          );
        }
      } catch (error) {
        alert("something went wrong");
      }
      setIsLoadingApprove((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleReject = async (id: number) => {
    if (confirm("Reject this data?")) {
      setIsLoadingApprove((prev) => ({ ...prev, [id]: true }));
      try {
        const body = new FormData();
        body.append("status", "2");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/web/pengajuanizin/${id}?menu_url=${menu_url}`,
          {
            method: "POST",
            body: body,
            headers: {
              authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const res = await response.json();
        if (!response.ok) {
          alert(res.message);
        } else {
          alert(res.message);
          setSearch("");
          mutate(
            `${process.env.NEXT_PUBLIC_API_URL}/api/web/pengajuanizin?menu_url=${menu_url}&select_dept=${selectDept}`
          );
        }
      } catch (error) {
        alert("something went wrong");
      }
      setIsLoadingApprove((prev) => ({ ...prev, [id]: false }));
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
    search === ""
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/web/pengajuanovertime?menu_url=${menu_url}&select_dept=${selectDept}`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/web/pengajuanovertime?menu_url=${menu_url}&select_dept=${selectDept}&search=${search}`,
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
              onChange={(e) => setSearch(e.target.value)}
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
  const overtimes = data?.data;
  console.log(overtimes);

  const actions = data?.actions;

  return (
    <>
      <div className="card-body">
        <div className="row">
          <div className="col-sm-12 d-flex justify-content-between align-items-center">
            <div>
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

            <input
              type="text"
              placeholder="Search..."
              aria-label="Search"
              onChange={(e) => setSearch(e.target.value)}
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
                  NO
                </th>
                <th className="fw-semibold fs-6" style={{ width: "15%" }}>
                  SUB DEPARTMENT
                </th>
                <th className="fw-semibold fs-6">PEGAWAI</th>
                <th className="fw-semibold fs-6" style={{ width: "15%" }}>
                  TANGGAL
                </th>
                <th className="fw-semibold fs-6" style={{ width: "5%" }}>
                  JAM
                </th>
                <th className="fw-semibold fs-6" style={{ width: "10%" }}>
                  JOB DESK
                </th>
                <th className="fw-semibold fs-6" style={{ width: "10%" }}>
                  REMARKS
                </th>
                <th className="fw-semibold fs-6" style={{ width: "10%" }}>
                  PERSETUJUAN
                </th>
                <th className="fw-semibold fs-6" style={{ width: "5%" }}>
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody>
              {overtimes?.length === 0 ? (
                <tr>
                  <td colSpan={9}>
                    <div className="text-center">Tidak ada data</div>
                  </td>
                </tr>
              ) : (
                overtimes?.map((item: PengajuanOvertime, index: number) => (
                  <tr key={index}>
                    <td align="center">{index + 1}</td>
                    <td align="left">
                      {item.sub_department.nama_sub_department?.toUpperCase()}
                    </td>
                    <td align="left">
                      {item.pengajuan_overtime_pegawai
                        ?.map(
                          (item: any) =>
                            `* ${item.pegawai?.nama?.toUpperCase()}`
                        )
                        .join("\n")}
                    </td>
                    <td>
                      <div className="d-flex gap-2 justify-content-center">
                        {actions?.includes("update") && (
                          <>
                            {isLoadingApprove[item.id] ? (
                              <button
                                className="btn btn-danger btn-sm"
                                disabled
                                type="button"
                              >
                                <span
                                  className="spinner-border spinner-border-sm"
                                  role="status"
                                  aria-hidden="true"
                                />
                              </button>
                            ) : (
                              <button
                                className="btn btn-danger btn-sm"
                                type="button"
                                onClick={() => handleReject(item.id)}
                              >
                                TIDAK
                              </button>
                            )}

                            {isLoadingApprove[item.id] ? (
                              <button
                                className="btn btn-success btn-sm"
                                disabled
                              >
                                <span
                                  className="spinner-border spinner-border-sm"
                                  role="status"
                                  aria-hidden="true"
                                />
                              </button>
                            ) : (
                              <button
                                className="btn btn-success btn-sm"
                                onClick={() => handleApprove(item.id)}
                              >
                                YA
                              </button>
                            )}
                          </>
                        )}
                      </div>
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

      {/* modal create */}
      {isModalCreateOpen && (
        <ModalCreate
          isModalOpen={isModalCreateOpen}
          onClose={closeModal}
          accessToken={accessToken}
          listSubDepartment={subDepartments}
        />
      )}
    </>
  );
};

export default Data;
