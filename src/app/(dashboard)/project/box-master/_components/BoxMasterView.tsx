"use client";

import React, { useEffect, useState } from "react";
import BoxMasterCreate from "./BoxMasterCreate";
import { BoxMasterProps, getBoxMaster } from "../_libs/action";

export type isLoadingProps = {
  [key: number]: boolean;
};

export default function BoxMasterView() {
  const [loadingPage, setLoadingPage] = useState(true);
  const [isLoadingAction, setIsLoadingAction] = useState<isLoadingProps>({});
  const [alertPage, setAlertPage] = useState({
    status: false,
    color: "",
    message: "",
    subMessage: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [boxMasterData, setBoxMasterData] = useState([] as BoxMasterProps[]);
  const [boxMasterEdit, setBoxMasterEdit] = useState({} as BoxMasterProps);

  useEffect(() => {
    if (alertPage.status) {
      const timer = setTimeout(() => {
        setAlertPage({
          status: false,
          color: "",
          message: "",
          subMessage: "",
        });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [alertPage]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    fetchData(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  const fetchData = async (search: string) => {
    setLoadingPage(true);
    try {
      const result = await getBoxMaster(search);
      if (result.status) {
        setBoxMasterData(result.data);
      } else {
        setAlertPage({
          status: true,
          color: "danger",
          message: "Failed",
          subMessage: result.message,
        });
      }
    } catch (error) {
      setAlertPage({
        status: true,
        color: "danger",
        message: "Error",
        subMessage: "Something went wrong, please refresh and try again",
      });
    } finally {
      setLoadingPage(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      <div className="card-body">
        <div className="row">
          <div className="col-sm-12 d-flex justify-content-between align-items-center">
            {/* button */}
            <div>
              <button
                type="button"
                className="btn btn-primary btn-sm fw-bold"
                onClick={() => setIsCreateOpen(true)}
              >
                ADD DATA
              </button>
            </div>

            <input
              type="text"
              placeholder="Search..."
              aria-label="Search"
              value={searchTerm}
              onChange={handleSearch}
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
                <th className="fw-semibold fs-6">BOX NAME</th>
                <th className="fw-semibold fs-6" style={{ width: "10%" }}>
                  ACTIVE
                </th>
                <th className="fw-semibold fs-6" style={{ width: "10%" }}>
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody>
              {boxMasterData?.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="text-center">Tidak ada data</div>
                  </td>
                </tr>
              ) : (
                boxMasterData?.map((item, index: number) => (
                  <tr key={index}>
                    <td align="center">{index + 1}</td>
                    <td align="left">{item.box_name}</td>
                    <td align="left">{item.active ? "ACTIVE" : "INACTIVE"}</td>
                    <td>
                      <div className="d-flex gap-2">
                        {isLoadingAction[item.id] ? (
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
                            // onClick={() => handleEdit(item.id)}
                          >
                            EDIT
                          </button>
                        )}

                        {isLoadingAction[item.id] ? (
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
                            // onClick={() => handleDelete(item.id)}
                          >
                            DELETE
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {/* {TOTAL_PAGES > 0 && (
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
          )} */}
        </div>
      </div>

      {isCreateOpen && (
        <BoxMasterCreate
          isOpen={isCreateOpen}
          onClose={() => {
            setIsCreateOpen(false);
            // fetchData("", filter);
          }}
        />
      )}
    </>
  );
}
