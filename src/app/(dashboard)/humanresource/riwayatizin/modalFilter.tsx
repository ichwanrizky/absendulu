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

  // department state
  const [department, setDepartment] = useState(
    filterData === "" ? dataDepartment[0].id.toString() : filterData.department
  );

  // sub department state
  const [subDepartment, setSubDepartment] = useState(
    filterData === "" ? "" : filterData.subDepartment
  );

  // sub department data state
  const [subDepartments, setSubDepartments] =
    useState<SubDepartment[]>(dataSubDepartment);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    onFilter(department, subDepartment);
  };

  const changeDepartment = async (department: number) => {
    if (department === 0) {
      setSubDepartments([]);
      return;
    }

    try {
      setSubDepartments([]);

      const filter = { department: department };
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL +
          "/api/web/masterdata/subdepartment?filter=" +
          JSON.stringify(filter),
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
        setSubDepartments(res.data);
      }
    } catch (error) {
      alert("something went wrong");
    }
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
                  <h1 className="modal-title fs-5 fw-semibold">Filter</h1>
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
                      onChange={(e) => {
                        setDepartment(e.target.value);
                        changeDepartment(Number(e.target.value));
                      }}
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
                      {subDepartments?.map(
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

                  <button type="submit" className="btn btn-primary btn-sm">
                    Filter Data
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
