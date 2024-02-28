"use client";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./styles.module.css";
type Props = {
  isModalOpen: any;
  onClose: any;
  accessToken?: string;
  dataDepartment: Department[];
  data: Shift;
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

type Department = {
  id: number;
  nama_department: string;
  lot: string;
  latitude: string;
  longitude: string;
  radius: string;
};
const ModalEdit = (props: Props) => {
  const { isModalOpen, onClose, accessToken, dataDepartment, data } = props;

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  const [department, setDepartment] = useState(data.department_id.toString());
  const [jamMasuk, setJamMasuk] = useState<Date | null>(
    addHoursToDate(new Date(data.jam_masuk), -7)
  );
  const [jamPulang, setJamPulang] = useState<Date | null>(
    addHoursToDate(new Date(data.jam_pulang), -7)
  );
  const [keterangan, setKeterangan] = useState(data.keterangan);
  const [condFriday, setCondFriday] = useState(data.cond_friday);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (confirm("Edit this data?")) {
      setIsLoading(true);
      try {
        const body = new FormData();
        body.append("jam_masuk", formatTimeUTC(jamMasuk));
        body.append("jam_pulang", formatTimeUTC(jamPulang));
        body.append("department", department);
        body.append("keterangan", keterangan);
        body.append("cond_friday", condFriday.toString());

        const response = await fetch(
          process.env.NEXT_PUBLIC_API_URL +
            "/api/web/masterdata/shift/" +
            data.id,
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
                  <h1 className="modal-title fs-5 fw-semibold">Edit Shift</h1>
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
                      onChange={(e) => setDepartment(e.target.value)}
                    >
                      <option value="">--PILIH--</option>
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
                    <label className="mb-1 fw-semibold small">Jam Masuk</label>
                    <DatePicker
                      wrapperClassName={styles.datePicker}
                      className="form-select"
                      selected={jamMasuk}
                      onChange={(date: Date) => setJamMasuk(date)}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={30}
                      timeCaption="Time"
                      dateFormat="h:mm aa"
                      timeFormat="HH:mm"
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label className="mb-1 fw-semibold small">Jam Pulang</label>
                    <DatePicker
                      wrapperClassName={styles.datePicker}
                      className="form-select"
                      selected={jamPulang}
                      onChange={(date: Date) => setJamPulang(date)}
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={30}
                      timeCaption="Time"
                      dateFormat="h:mm aa"
                      timeFormat="HH:mm"
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label className="mb-1 fw-semibold small">Keterangan</label>
                    <input
                      type="text"
                      className="form-control"
                      onChange={(e) => setKeterangan(e.target.value)}
                      value={keterangan}
                      required
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label className="mb-1 fw-semibold small">
                      Cond Friday
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      onChange={(e) => setCondFriday(Number(e.target.value))}
                      value={condFriday}
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

export default ModalEdit;

function formatTimeUTC(date: any) {
  if (!date) return ""; // Return an empty string if the date is not provided

  const newDate = addHoursToDate(date, 7);

  const hours = newDate.getUTCHours().toString().padStart(2, "0");
  const minutes = newDate.getUTCMinutes().toString().padStart(2, "0");
  const seconds = newDate.getUTCSeconds().toString().padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
}

function addHoursToDate(date: Date, hours: number) {
  return new Date(date.getTime() + hours * 3600000);
}
