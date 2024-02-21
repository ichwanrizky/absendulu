"use client";
import { useState } from "react";

type Props = {
  isModalOpen: any;
  onClose: any;
  accessToken?: string;
  dataDepartment: Department[];
  dataSubDepartment: SubDepartment[];
  onFilter: any;
  filterData: any;
};

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
  department_id: number;
  department: Department;
};

const ModalFilter = (props: Props) => {
  const {
    isModalOpen,
    onClose,
    accessToken,
    dataDepartment,
    dataSubDepartment,
    onFilter,
    filterData,
  } = props;

  const [isLoading, setIsLoading] = useState(false);
  const [department, setDepartment] = useState(
    filterData === "" ? dataDepartment[0].id.toString() : filterData.department
  );
  const [subDepartment, setSubDepartment] = useState(
    filterData === "" ? "" : filterData.subDepartment
  );

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    onFilter(department, subDepartment);
  };

  return (
    isModalOpen && (
      <>
        <div
          className="modal-backdrop fade show"
          style={{ display: "block" }}
        ></div>
        <div
          className="modal fade show"
          tabIndex={-1}
          role="dialog"
          style={{ display: "block" }}
        >
          <div className="modal-dialog">
            <form onSubmit={handleSubmit}>
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5 fw-semibold   ">Filter</h1>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={onClose}
                    aria-label="Close"
                  />
                </div>
                <div className="modal-body">
                  <div className="form-group mb-3">
                    <label className="mb-1 fw-semibold small">Department</label>
                    <select
                      className="form-select"
                      onChange={(e) => setDepartment(e.target.value)}
                      value={department}
                    >
                      {dataDepartment?.map(
                        (item: Department, index: number) => (
                          <option value={item.id} key={index}>
                            {item.nama_department.toUpperCase()}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div className="form-group mb-3">
                    <label className="mb-1 fw-semibold small">
                      Sub Department
                    </label>
                    <select
                      className="form-select"
                      onChange={(e) => setSubDepartment(e.target.value)}
                      value={subDepartment}
                    >
                      <option value="">ALL</option>
                      {dataSubDepartment?.map(
                        (item: SubDepartment, index: number) => (
                          <option value={item.id} key={index}>
                            {item.nama_sub_department.toUpperCase()}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-dark btn-sm"
                    onClick={onClose}
                  >
                    Close
                  </button>
                  {isLoading ? (
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
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
                    <button type="submit" className="btn btn-primary btn-sm">
                      Filter Data
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </>
    )
  );
};

export default ModalFilter;
