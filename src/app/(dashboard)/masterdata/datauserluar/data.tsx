"use client";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import ModalCreate from "./modalCreate";
import ModalEdit from "./modalEdit";
import { usePathname } from "next/navigation";

type User = {
  number: number;
  id: number;
  username: string;
  password: string;
  name: null | string;
  createdAt: Date;
  roles: Roles;
  telp: string;
};

type Roles = {
  id: number;
  role_name: string;
};

interface isLoadingProps {
  [key: number]: boolean;
}

const Data = ({ accessToken }: { accessToken: string }) => {
  const pathname = usePathname();
  const lastSlashIndex = pathname.lastIndexOf("/");
  const menu_url = pathname.substring(lastSlashIndex + 1);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);

  // loading state
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState<isLoadingProps>({});
  const [isLoadingEdit, setIsLoadingEdit] = useState<isLoadingProps>({});

  // modal state
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);

  // data state
  const [dataEdit, setDataEdit] = useState({} as User);
  const [dataRoles, setDataRoles] = useState<Roles[]>();

  //search state
  const [search, setSearch] = useState("");

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
      if (!responseRoles.ok) {
        alert(resRoles.message);
      } else {
        setDataRoles(resRoles.data);
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
      // get edit data
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/web/datauserluar/${id}?menu_url=${menu_url}`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const res = await response.json();

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

      if (!response.ok || !responseRoles.ok) {
        alert(!response.ok ? res.message : resRoles.message);
      } else {
        setDataEdit(res.data);
        setDataRoles(resRoles.data);
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
          `${process.env.NEXT_PUBLIC_API_URL}/api/web/datauserluar/${id}?menu_url=${menu_url}`,
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
            `${process.env.NEXT_PUBLIC_API_URL}/api/web/datauserluar?menu_url=${menu_url}&page=${currentPage}`
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
    setSearch("");
    mutate(
      `${process.env.NEXT_PUBLIC_API_URL}/api/web/datauserluar?menu_url=${menu_url}&page=${currentPage}`
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
    search === ""
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/web/datauserluar?menu_url=${menu_url}&page=${currentPage}`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/web/datauserluar?menu_url=${menu_url}&page=${currentPage}&search=${search}`,
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
              value={search}
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

  const users = data?.data;
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

            <input
              type="text"
              placeholder="Search..."
              aria-label="Search"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
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
                <th className="fw-semibold fs-6">NAMA</th>
                <th className="fw-semibold fs-6" style={{ width: "15%" }}>
                  USERNAME
                </th>
                <th className="fw-semibold fs-6" style={{ width: "15%" }}>
                  ROLE
                </th>
                <th className="fw-semibold fs-6" style={{ width: "10%" }}>
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody>
              {users?.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="text-center">Tidak ada data</div>
                  </td>
                </tr>
              ) : (
                users?.map((item: User, index: number) => (
                  <tr key={index}>
                    <td align="center">{item.number}</td>
                    <td align="left">{item.name?.toUpperCase()}</td>
                    <td align="left">{item.username.toLowerCase()}</td>
                    <td align="left">{item.roles?.role_name.toUpperCase()}</td>
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
          dataRoles={dataRoles}
        />
      )}

      {/* modal edit */}
      {isModalEditOpen && (
        <ModalEdit
          isModalOpen={isModalEditOpen}
          onClose={closeModal}
          accessToken={accessToken}
          data={dataEdit}
          dataRoles={dataRoles}
        />
      )}
    </>
  );
};

export default Data;
