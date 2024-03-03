"use client";
import { useState } from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./styles.module.css";

type Props = {
  isModalOpen: any;
  onClose: any;
  dataDepartment: Department[];
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

const ModalFilter = (props: Props) => {
  const { isModalOpen, onClose, dataDepartment, onFilter, filterData } = props;

  const [department, setDepartment] = useState(
    filterData === "" ? "" : filterData.department
  );
  const [tanggalAbsen, setTanggalAbsen] = useState<Date>(
    filterData.tanngalAbsen
  );

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    onFilter(department, tanggalAbsen);
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
                      Tanggal Absensi
                    </label>
                    <br />
                    <DatePicker
                      wrapperClassName={styles.datePicker}
                      className="form-select"
                      selected={tanggalAbsen}
                      onChange={(e: Date) => setTanggalAbsen(e)}
                      dateFormat={"yyyy-MM-dd"}
                      showMonthDropdown
                      showYearDropdown
                      scrollableYearDropdown
                      dropdownMode="select"
                      required
                    />
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
