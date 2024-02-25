"use client";
import { useState } from "react";
import Select from "react-select";

type Props = {
  isModalOpen: any;
  onClose: any;
  accessToken?: string;
  dataDepartment: Department[];
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

  // lodaing state
  const [isLoading, setIsLoading] = useState(false);

  const [checkAll, setCheckAll] = useState(false);
  const [optionPegawai, setOptionPegawai] = useState([
    {
      value: "",
      label: "",
    },
  ]);
  const [pegawai, setPegawai] = useState<any>([]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (confirm("Add this data?")) {
      setIsLoading(true);
      try {
        const body = new FormData();
        body.append("pegawai", JSON.stringify(pegawai));

        const response = await fetch(
          process.env.NEXT_PUBLIC_API_URL + "/api/web/masterdata/datauser",
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

  const getPegawai = async (department: string) => {
    if (!department) {
      setPegawai([]);
      setOptionPegawai([]);
      const element = document.getElementById("selectAllPegawai");
      if (element) {
        element.style.display = "none";
      }
      return;
    }

    try {
      setPegawai([]);
      setOptionPegawai([]);

      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL +
          "/api/web/masterdata/datakaryawan?filter=" +
          JSON.stringify({
            department: department,
            active: "1",
            is_user: true,
          }),
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
        const element = document.getElementById("selectAllPegawai");
        if (element) {
          element.style.display = "block";
        }
        setOptionPegawai(
          res.data.map((item: any) => ({
            value: item.id,
            label: item.nama.toUpperCase(),
          }))
        );
      }
    } catch (error) {
      alert("something went wrong");
    }
  };

  const handleSelectAll = () => {
    setCheckAll((prev) => !prev);

    if (!checkAll) {
      setPegawai(
        optionPegawai.map((item) => ({
          label: item.label,
          value: item.value,
        }))
      );
    } else {
      setPegawai([]);
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
                  <h1 className="modal-title fs-5 fw-semibold">Add User</h1>
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
                      onChange={(e) => getPegawai(e.target.value)}
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
                    <label className="mb-1 fw-semibold small">Karyawan</label>
                    <Select
                      options={optionPegawai}
                      value={pegawai}
                      onChange={(e: any) => setPegawai(e)}
                      placeholder="--PILIH--"
                      isMulti
                      required
                    />
                    <div id="selectAllPegawai" style={{ display: "none" }}>
                      <label className="mt-2 mb-1 fw-semibold small me-3">
                        Select All
                      </label>
                      <input
                        type="checkbox"
                        className="form-check-input mt-2"
                        onChange={handleSelectAll}
                      />
                    </div>
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
