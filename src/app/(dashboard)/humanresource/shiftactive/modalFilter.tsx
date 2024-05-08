"use client";
import { useState } from "react";

type Props = {
  isModalOpen: any;
  onClose: any;
  dataDepartment: Department[];
  onFilter: any;
  filterData: any;
  accessToken?: string;
  shifts?: Shift[];
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

const ModalFilter = (props: Props) => {
  const {
    isModalOpen,
    onClose,
    dataDepartment,
    onFilter,
    filterData,
    accessToken,
    shifts,
  } = props;

  const [department, setDepartment] = useState(
    filterData === "" ? "" : filterData.department
  );

  const [dataShift, setDataShift] = useState(shifts as Shift[]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    onFilter(department, dataShift);
  };

  const getShift = async (department: string) => {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL +
          "/api/web/masterdata/shift?filter=" +
          JSON.stringify({ department: Number(department) }),
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
          next: {
            revalidate: 60,
          },
        }
      );

      const res = await response.json();

      if (response.ok) {
        setDataShift(res.data);
      } else {
        alert(res.message);
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
                        getShift(e.target.value);
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
