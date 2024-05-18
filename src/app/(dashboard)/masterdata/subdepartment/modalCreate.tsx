"use client";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Select from "react-select";

type Props = {
  isModalOpen: any;
  onClose: any;
  accessToken?: string;
  dataDepartment: Department[];
  dataManager: User[];
};
type Department = {
  id: number;
  nama_department: string;
  lot: string;
  latitude: string;
  longitude: string;
  radius: string;
};

type User = {
  id: number;
  name: string;
  roles: {
    role_name: string;
  };
};

const ModalCreate = (props: Props) => {
  const { isModalOpen, onClose, accessToken, dataDepartment, dataManager } =
    props;

  const pathname = usePathname();
  const lastSlashIndex = pathname.lastIndexOf("/");
  const menu_url = pathname.substring(lastSlashIndex + 1);

  // lodaing state
  const [isLoading, setIsLoading] = useState(false);

  const [department, setDepartment] = useState("");
  const [namaSubDepartment, setNamaSubDepartment] = useState("");
  const [aksesIzin, setAksesIzin] = useState([
    {
      value: null,
      label: null,
    },
  ]);
  const [manager, setManager] = useState("");
  const [supervisor, setSupervisor] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (confirm("Add this data?")) {
      setIsLoading(true);
      try {
        const body = new FormData();
        body.append("department", department);
        body.append("nama_sub_department", namaSubDepartment);
        body.append(
          "akses_izin",
          aksesIzin?.map((item) => item.value).join(",")
        );
        body.append("manager", manager);
        body.append("supervisor", supervisor);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/web/subdepartment?menu_url=${menu_url}`,
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
                  <h1 className="modal-title fs-5 fw-semibold   ">
                    ADD SUB DEPARTMENT
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
                    <label className="mb-1 fw-semibold small">DEPARTMENT</label>
                    <select
                      className="form-select"
                      required
                      onChange={(e) => {
                        setDepartment(e.target.value);
                      }}
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
                    <label className="mb-1 fw-semibold small">
                      NAMA SUB DEPARTMENT
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      style={{ textTransform: "uppercase" }}
                      required
                      onChange={(e) => setNamaSubDepartment(e.target.value)}
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label className="mb-1 fw-semibold small">SUPERVISOR</label>
                    <select
                      className="form-select"
                      onChange={(e) => setSupervisor(e.target.value)}
                      value={supervisor}
                    >
                      <option value="">--PILIH--</option>
                      {dataManager?.map((item: User, index: number) => (
                        <option value={item.id} key={index}>
                          {item.name.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group mb-3">
                    <label className="mb-1 fw-semibold small">ATASAN</label>
                    <select
                      className="form-select"
                      onChange={(e) => setManager(e.target.value)}
                      value={manager}
                    >
                      <option value="">--PILIH--</option>
                      {dataManager?.map((item: User, index: number) => (
                        <option value={item.id} key={index}>
                          {item.name.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group mb-3">
                    <label className="mb-1 fw-semibold small">AKSES IZIN</label>
                    <Select
                      options={[
                        { value: "C", label: "Cuti" },
                        { value: "CS", label: "Cuti Setengah Hari" },
                        { value: "I", label: "Izin" },
                        { value: "IS", label: "Izin Setengah Hari" },
                        { value: "S", label: "Sakit" },
                        { value: "G1", label: "Gatepass" },
                        { value: "G2", label: "Datang Terlambat" },
                        { value: "G3", label: "Pulang Awal" },
                        { value: "P/M", label: "Lupa Absen" },
                      ]}
                      onChange={(e: any) => setAksesIzin(e)}
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
                    CLOSE
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
                      LOADING...
                    </button>
                  ) : (
                    <button type="submit" className="btn btn-primary btn-sm">
                      SAVE CHANGES
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
