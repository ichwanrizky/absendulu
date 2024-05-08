"use client";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import ModalCreate from "./modalCreate";
import ModalEdit from "./modalEdit";
import ModalFilter from "./modalFilter";

type Token = {
  number: number;
  id: number;
  token: string;
  user_id: number;
  createdAt: Date;
  expired: boolean;
  user: User;
};

type User = {
  name: string;
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

const TokenData = ({
  accessToken,
  departments,
}: {
  accessToken: string;
  departments: Department[];
}) => {
  // pagination
  const [currentPage, setCurrentPage] = useState(1);

  //search state
  const [typingTimeout, setTypingTimeout] = useState<any>();
  const [search, setSearch] = useState("");

  // loading state
  const [isLoadingEdit, setIsLoadingEdit] = useState<isLoadingProps>({});

  // modal state
  const [isModalFilterOpen, setIsModalFilterOpen] = useState(false);

  // filter
  const [filter, setFilter] = useState<any>({
    filter: false,
    department: departments[0].id.toString(),
  });

  const handleEdit = async (id: number) => {
    if (confirm("Reset Token Karyawan ?")) {
      setIsLoadingEdit((prev) => ({ ...prev, [id]: true }));
      try {
        // get edit data
        const response = await fetch(
          process.env.NEXT_PUBLIC_API_URL +
            "/api/web/humanresource/token/" +
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
          alert(res.message);
          mutate(
            process.env.NEXT_PUBLIC_API_URL +
              "/api/web/humanresource/token?page=" +
              currentPage +
              "&filter=" +
              JSON.stringify(filter)
          );
        }
      } catch (error) {
        alert("something went wrong");
      }
      setIsLoadingEdit((prev) => ({ ...prev, [id]: false }));
    }
  };

  const closeModal = () => {
    setIsModalFilterOpen(false);
    mutate(
      process.env.NEXT_PUBLIC_API_URL +
        "/api/web/humanresource/token?page=" +
        currentPage +
        "&filter=" +
        JSON.stringify(filter)
    );
  };

  const handleFilter = async () => {
    setIsModalFilterOpen(true);
  };

  const handleFilterData = (department: any) => {
    setIsModalFilterOpen(false);
    setFilter({ filter: true, department: department });
  };

  const handleSearch = (search: any) => {
    if (typingTimeout) clearTimeout(typingTimeout);
    const newTimeout = setTimeout(() => {
      setSearch(search);
      setCurrentPage(1);
    }, 1000);

    // Update the timeout ID in state
    setTypingTimeout(newTimeout);
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
      ? process.env.NEXT_PUBLIC_API_URL +
          "/api/web/humanresource/token?page=" +
          currentPage +
          "&filter=" +
          JSON.stringify(filter)
      : process.env.NEXT_PUBLIC_API_URL +
          "/api/web/humanresource/token?page=" +
          1 +
          "&filter=" +
          JSON.stringify(filter) +
          "&search=" +
          search,
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
              onChange={(e) => handleSearch(e.target.value)}
              className="form-control-sm ms-2"
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
      <div className="card-body text-center">
        something went wrong, please refresh the page
      </div>
    );
  }

  const tokens = data?.data;
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
            <div>
              <button
                type="button"
                className="btn btn-dark btn-sm fw-bold ms-1"
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
                      subDepartment: "",
                      active: "1",
                    });
                  }}
                >
                  Reset
                </button>
              )}
            </div>
            <input
              type="text"
              placeholder="Search..."
              aria-label="Search"
              onChange={(e) => handleSearch(e.target.value)}
              className="form-control-sm ms-2"
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
                  No
                </th>
                <th className="fw-semibold fs-6">Token</th>
                <th className="fw-semibold fs-6" style={{ width: "20%" }}>
                  Nama
                </th>
                <th className="fw-semibold fs-6" style={{ width: "10%" }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {tokens?.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <div className="text-center">Tidak ada data</div>
                  </td>
                </tr>
              ) : (
                tokens?.map((item: Token, index: number) => (
                  <tr key={index}>
                    <td align="center">{item.number}</td>
                    <td
                      style={{
                        maxWidth: "100px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        textAlign: "center",
                      }}
                    >
                      {item.token}
                    </td>
                    <td align="left">{item?.user.name.toUpperCase()}</td>
                    <td align="center">
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
                            Reset
                          </button>
                        ))}
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
export default TokenData;

const optionsDate: any = {
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  timeZone: "UTC",
};
