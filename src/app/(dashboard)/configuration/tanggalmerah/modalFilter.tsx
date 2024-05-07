"use client";
import { useState } from "react";

type Props = {
  isModalOpen: any;
  onClose: any;
  onFilter: any;
  filterData: any;
};

const ModalFilter = (props: Props) => {
  const { isModalOpen, onClose, onFilter, filterData } = props;

  const [tahun, setTahun] = useState(filterData === "" ? "" : filterData.tahun);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    onFilter(tahun);
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
                    <label className="mb-1 fw-semibold small">TAHUN</label>
                    <select
                      className="form-select"
                      required
                      value={tahun}
                      onChange={(e) => setTahun(e.target.value)}
                    >
                      {Array.from({ length: 5 }, (_, i) => (
                        <option value={new Date().getFullYear() - i} key={i}>
                          {new Date().getFullYear() - i}
                        </option>
                      ))}
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
