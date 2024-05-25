"use client";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import { usePathname } from "next/navigation";

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

  // pagination
  const [currentPage, setCurrentPage] = useState(1);

  // loading state
  const [isLoadingEdit, setIsLoadingEdit] = useState<isLoadingProps>({});

  // filter
  const [selectDept, setSelectDept] = useState(departments[0].id.toString());

  //search state
  const [search, setSearch] = useState("");

  const handleEdit = async (id: number) => {
    if (confirm("Reset Token Karyawan ?")) {
      setIsLoadingEdit((prev) => ({ ...prev, [id]: true }));
      try {
        // get edit data
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/web/token/${id}?menu_url=${menu_url}`,
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
          setSearch("");
          mutate(
            `${process.env.NEXT_PUBLIC_API_URL}/api/web/token?menu_url=${menu_url}&page=${currentPage}&select_dept=${selectDept}`
          );
        }
      } catch (error) {
        alert("something went wrong");
      }
      setIsLoadingEdit((prev) => ({ ...prev, [id]: false }));
    }
  };

  const copyToken = async (token: string) => {
    await navigator.clipboard.writeText(token);
    alert("Token Copied");
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
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/web/token?menu_url=${menu_url}&page=${currentPage}&select_dept=${selectDept}`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/web/token?menu_url=${menu_url}&page=${currentPage}&select_dept=${selectDept}&search=${search}`,
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
              <select
                className="form-select-sm"
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
              value={search}
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
                  NO
                </th>
                <th className="fw-semibold fs-6">TOKEN</th>
                <th className="fw-semibold fs-6" style={{ width: "20%" }}>
                  NAMA
                </th>
                <th className="fw-semibold fs-6" style={{ width: "10%" }}>
                  ACTION
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
                      onClick={() => copyToken(item.token)}
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
    </>
  );
};

export default Data;
