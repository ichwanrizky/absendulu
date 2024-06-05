"use client";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Select from "react-select";
import { NumericFormat } from "react-number-format";

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

type Pegawai = {
  id: number;
  nama: string;
};
const ModalCreate = (props: Props) => {
  const { isModalOpen, onClose, accessToken, dataDepartment } = props;

  const pathname = usePathname();
  const lastSlashIndex = pathname.lastIndexOf("/");
  const menu_url = pathname.substring(lastSlashIndex + 1);

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  const [listPegawai, setListPegawai] = useState([] as Pegawai[]);
  const [department, setDepartment] = useState("");
  const [pegawai, setPegawai] = useState([] as any);
  const [bulan, setBulan] = useState("");
  const [tahun, setTahun] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (confirm("Add this data?")) {
      setIsLoading(true);
      try {
        const body = new FormData();
        body.append("department", department);
        body.append("pegawai", JSON.stringify(pegawai));
        body.append("tahun", tahun);
        body.append("bulan", bulan);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/web/gaji?menu_url=${menu_url}`,
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

  const getPegawaiGaji = async (
    department: string,
    bulan: string,
    tahun: string
  ) => {
    if (!department || !bulan || !tahun) {
      setListPegawai([]);
      return;
    }

    try {
      const body = new FormData();
      body.append("department", department.toString());
      body.append("bulan", bulan);
      body.append("tahun", tahun);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/lib/listkaryawan_gaji`,
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
        setListPegawai([]);
      } else {
        setListPegawai(res.data);
      }
    } catch (error) {
      alert("something went wrong");
    }
  };

  const selectAll = () => {
    if (pegawai?.length > 0) {
      setPegawai([]);
      return;
    }

    setPegawai(
      listPegawai?.map((item: Pegawai) => ({
        label: item.nama?.toUpperCase(),
        value: item.id,
      }))
    );
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
                  <h1 className="modal-title fs-5 fw-semibold">ADD GAJI</h1>
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
                      value={department}
                      onChange={(e) => {
                        setDepartment(e.target.value);
                        getPegawaiGaji(e.target.value, bulan, tahun);
                      }}
                      required
                    >
                      <option value="">--PILIH--</option>
                      {dataDepartment?.map(
                        (item: Department, index: number) => (
                          <option value={item.id} key={index}>
                            {item.nama_department?.toUpperCase()}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div className="form-group mb-3">
                    <label className="mb-1 fw-semibold small">BULAN</label>
                    <select
                      className="form-select"
                      value={bulan}
                      onChange={(e) => {
                        setBulan(e.target.value);
                        getPegawaiGaji(department, e.target.value, tahun);
                      }}
                      required
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
                        return (
                          <option value={i + 1} key={i}>
                            {monthNames[i]}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div className="form-group mb-3">
                    <label className="mb-1 fw-semibold small">TAHUN</label>
                    <select
                      className="form-select"
                      required
                      value={tahun}
                      onChange={(e) => {
                        setTahun(e.target.value);
                        getPegawaiGaji(department, bulan, e.target.value);
                      }}
                    >
                      <option value="">--PILIH--</option>
                      {Array.from({ length: 5 }, (_, i) => (
                        <option value={new Date().getFullYear() - i} key={i}>
                          {new Date().getFullYear() - i}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group mb-3">
                    <label className="mb-1 fw-semibold small">PEGAWAI</label>
                    <Select
                      value={pegawai}
                      options={listPegawai?.map(
                        (item: Pegawai, index: number) => ({
                          value: item.id,
                          label: item.nama?.toUpperCase(),
                        })
                      )}
                      onChange={(e: any) => setPegawai(e)}
                      isClearable
                      isMulti
                      required
                    />{" "}
                    {listPegawai?.length > 0 && (
                      <>
                        select all{" "}
                        <input type="checkbox" onChange={selectAll} />
                      </>
                    )}
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
