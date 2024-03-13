"use client";
import { useState } from "react";
import Select from "react-select";

type Props = {
  isModalOpen: any;
  onClose: any;
  accessToken?: string;
  dataDepartment?: Department[];
};
type Department = {
  id: number;
  nama_department: string;
  lot: string;
  latitude: string;
  longitude: string;
  radius: string;
};
const ModalCreate = (props: Props) => {
  const { isModalOpen, onClose, accessToken, dataDepartment } = props;

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  const [department, setDepartment] = useState("");
  const [bulan, setBulan] = useState("");
  const [tahun, setTahun] = useState("");
  const [tanggalMerah, setTanggalMerah] = useState([
    {
      label: "",
      value: "",
    },
  ]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (confirm("Add this data?")) {
      setIsLoading(true);
      try {
        const body = new FormData();
        body.append("department", department);
        body.append("bulan", bulan);
        body.append("tahun", tahun);
        body.append("tanggal_merah", JSON.stringify(tanggalMerah));
        const response = await fetch(
          process.env.NEXT_PUBLIC_API_URL +
            "/api/web/configuration/tanggalmerah",
          {
            method: "POST",
            headers: {
              authorization: `Bearer ${accessToken}`,
            },
            body: body,
          }
        );

        const res = await response.json();
        if (!response.ok) {
          alert(res.message);
        } else {
          alert(res.message);
          onClose();
        }
      } catch (error) {
        alert("something went wrong");
      }
      setIsLoading(false);
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
                  <h1 className="modal-title fs-5 fw-semibold">
                    Add Tanggal Merah
                  </h1>
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
                      required
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                    >
                      <option value="">--PILIH--</option>
                      {dataDepartment?.map(
                        (item: Department, index: number) => (
                          <option value={item.id}>
                            {item.nama_department?.toUpperCase()}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div className="form-group mb-3">
                    <label className="mb-1 fw-semibold small">Bulan</label>
                    <select
                      className="form-select"
                      required
                      value={bulan}
                      onChange={(e) => setBulan(e.target.value)}
                    >
                      <option value="">--PILIH--</option>
                      {Array.from({ length: 12 }, (_, i) => {
                        const monthNames = [
                          "Januari",
                          "Februari",
                          "Maret",
                          "April",
                          "Mei",
                          "Juni",
                          "Juli",
                          "Augustus",
                          "September",
                          "Oktober",
                          "November",
                          "Desember",
                        ];
                        return <option value={i + 1}>{monthNames[i]}</option>;
                      })}
                    </select>
                  </div>

                  <div className="form-group mb-3">
                    <label className="mb-1 fw-semibold small">Tahun</label>
                    <select
                      className="form-select"
                      required
                      value={tahun}
                      onChange={(e) => setTahun(e.target.value)}
                    >
                      <option value="">--PILIH--</option>
                      {Array.from({ length: 5 }, (_, i) => (
                        <option value={new Date().getFullYear() - i}>
                          {new Date().getFullYear() - i}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group mb-3">
                    <label className="mb-1 fw-semibold small">Tanggal</label>
                    <Select
                      options={Array.from({ length: 31 }, (_, i) => ({
                        label: `${(i + 1).toString().padStart(2, "0")}`,
                        value: `${(i + 1).toString().padStart(2, "0")}`,
                      }))}
                      onChange={(e: any) => setTanggalMerah(e)}
                      required
                      isMulti
                      isClearable
                      closeMenuOnSelect={false}
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
                      Save changes
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

export default ModalCreate;
