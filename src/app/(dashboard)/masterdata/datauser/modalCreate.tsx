"use client";
import { usePathname } from "next/navigation";
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

  const pathname = usePathname();
  const lastSlashIndex = pathname.lastIndexOf("/");
  const menu_url = pathname.substring(lastSlashIndex + 1);

  // lodaing state
  const [isLoading, setIsLoading] = useState(false);

  const [checkAll, setCheckAll] = useState(false);
  const [optionPegawai, setOptionPegawai] = useState([]);
  const [pegawai, setPegawai] = useState<any>([]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (confirm("Add this data?")) {
      setIsLoading(true);
      try {
        const body = new FormData();
        body.append("pegawai", JSON.stringify(pegawai));

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/web/datauser?menu_url=${menu_url}`,
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

      const body = new FormData();
      body.append("department", department);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/lib/listuser`,
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
        optionPegawai.map((item: any) => ({
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
                  <h1 className="modal-title fs-5 fw-semibold">ADD DATA</h1>
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
                      onChange={(e) => getPegawai(e.target.value)}
                      required
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
                    <label className="mb-1 fw-semibold small">KARYAWAN</label>
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
