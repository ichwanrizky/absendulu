"use client";

import React from "react";

export default function BoxShimanoView() {
  return (
    <>
      <div className="card-body">
        <div className="row">
          <div className="col-sm-12 d-flex justify-content-between align-items-center">
            <div>
              <button
                type="button"
                className="btn btn-primary btn-sm fw-bold"
                // onClick={() => handleCreate()}
              >
                ADD DATA
              </button>
            </div>

            <input
              type="text"
              placeholder="Search..."
              aria-label="Search"
              //   onChange={(e) => setSearch(e.target.value)}
              //   value={search}
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
                  TELP
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
              {/* {users?.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="text-center">Tidak ada data</div>
                  </td>
                </tr>
              ) : (
                users?.map((item: User, index: number) => (
                  <tr key={index}>
                    <td align="center">{item.number}</td>
                    <td align="left">{item.name?.toUpperCase()}</td>
                    <td align="left">{item.username.toLowerCase()}</td>
                    <td align="left">{item.telp}</td>
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
              )} */}
            </tbody>
          </table>
        </div>
      </div>

      <div></div>
    </>
  );
}
