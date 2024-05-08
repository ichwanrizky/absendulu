"use client";
import { useState } from "react";

type Props = {
  isModalOpen: any;
  onClose: any;
  dataSubDepartment: SubDepartment[];
  onFilter: any;
  filterData: any;
};

type SubDepartment = {
  id: number;
  nama_sub_department: string;
  department_id: number;
};

const ModalFilter = (props: Props) => {
  const { isModalOpen, onClose, dataSubDepartment, onFilter, filterData } =
    props;

  // sub department state
  const [subDepartment, setSubDepartment] = useState(
    filterData === "" ? "" : filterData.subDepartment
  );

  // status active state
  const [active, setActive] = useState(
    filterData === "" ? "" : filterData.active
  );

  // sub department data state
  const [subDepartments, setSubDepartments] =
    useState<SubDepartment[]>(dataSubDepartment);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    onFilter(subDepartment, active);
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
                  <h1 className="modal-title fs-5 fw-semibold">FILTER</h1>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={onClose}
                    aria-label="Close"
                  />
                </div>

                <div className="modal-body">
                  <div className="form-group mb-3">
                    <label className="mb-1 fw-semibold small">
                      SUB DEPARTMENT
                    </label>
                    <select
                      className="form-select"
                      onChange={(e) => setSubDepartment(e.target.value)}
                      value={subDepartment}
                    >
                      <option value="">ALL</option>
                      {subDepartments?.map(
                        (item: SubDepartment, index: number) => (
                          <option value={item.id} key={index}>
                            {item.nama_sub_department.toUpperCase()}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div className="form-group mb-3">
                    <label className="mb-1 fw-semibold small">
                      STATUS ACTIVE
                    </label>
                    <select
                      className="form-select"
                      onChange={(e) => setActive(e.target.value)}
                      value={active}
                    >
                      <option value="1">AKTIF</option>
                      <option value="0">TIDAK AKTIF</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-dark btn-sm"
                    onClick={onClose}
                  >
                    CLOSE
                  </button>

                  <button type="submit" className="btn btn-primary btn-sm">
                    FILTER DATA
                  </button>
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
