"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Select from "react-select";
import { NumericFormat } from "react-number-format";

type Props = {
  isModalOpen: any;
  onClose: any;
  accessToken?: string;
  dataDepartment?: Department[];
  dataEdit: Adjustment;
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

type Adjustment = {
  id: number;
  pegawai: {
    id: number;
    nama: string;
  };
  nominal: number;
  bulan: number;
  tahun: number;
  keterangan: string;
  jenis: string;
  department_id: number;
};
const ModalEdit = (props: Props) => {
  const { isModalOpen, onClose, accessToken, dataDepartment, dataEdit } = props;

  const pathname = usePathname();
  const lastSlashIndex = pathname.lastIndexOf("/");
  const menu_url = pathname.substring(lastSlashIndex + 1);

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  const [listPegawai, setListPegawai] = useState([] as Pegawai[]);
  const [department, setDepartment] = useState(
    dataEdit.department_id.toString()
  );
  const [pegawai, setPegawai] = useState({
    value: dataEdit.pegawai.id?.toString(),
    label: dataEdit.pegawai.nama?.toUpperCase(),
  });
  const [bulan, setBulan] = useState(dataEdit.bulan.toString());
  const [tahun, setTahun] = useState(dataEdit.tahun.toString());
  const [jenis, setJenis] = useState(dataEdit.jenis);
  const [nominal, setNominal] = useState(dataEdit.nominal);
  const [keterangan, setKeterangan] = useState(dataEdit.keterangan);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (confirm("Edit this data?")) {
      setIsLoading(true);
      try {
        const body = new FormData();
        body.append("department", department);
        body.append("pegawai", pegawai.value);
        body.append("tahun", tahun);
        body.append("bulan", bulan);
        body.append("jenis", jenis);
        body.append("nominal", nominal.toString());
        body.append("keterangan", keterangan);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/web/adjustment/${dataEdit.id}?menu_url=${menu_url}`,
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

  const getPegawai = async (department: number) => {
    setPegawai({
      value: "",
      label: "",
    });
    if (!department) {
      setListPegawai([]);
      return;
    }

    try {
      const body = new FormData();
      body.append("department", department.toString());
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/lib/listkaryawan`,
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

  const getPegawaiFirst = async (department: number) => {
    if (!department) {
      setListPegawai([]);
      return;
    }

    try {
      const body = new FormData();
      body.append("department", department.toString());
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/lib/listkaryawan`,
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

  useEffect(() => {
    getPegawaiFirst(dataEdit.department_id);
  }, []);

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
                    EDIT ADJUSTMENT
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
                      value={department}
                      onChange={(e) => {
                        setDepartment(e.target.value);
                        getPegawai(Number(e.target.value));
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
                      required
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label className="mb-1 fw-semibold small">BULAN</label>
                    <select
                      className="form-select"
                      value={bulan}
                      onChange={(e) => setBulan(e.target.value)}
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
                      onChange={(e) => setTahun(e.target.value)}
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
                    <label className="mb-1 fw-semibold small">JENIS</label>
                    <select
                      className="form-select"
                      required
                      value={jenis}
                      onChange={(e) => setJenis(e.target.value)}
                    >
                      <option value="">--PILIH--</option>
                      <option value="penambahan">PENAMBAHAN / PROJECT</option>
                      <option value="pengurangan">PENGURANGAN</option>
                    </select>
                  </div>

                  <div className="form-group mb-3">
                    <label className="mb-1 fw-semibold small">NOMINAL</label>
                    <NumericFormat
                      className="form-control"
                      defaultValue={nominal}
                      thousandSeparator=","
                      displayType="input"
                      onValueChange={(values: any) => {
                        setNominal(values.floatValue);
                      }}
                      onFocus={(e) =>
                        e.target.value === "0" && (e.target.value = "")
                      }
                      onBlur={(e) =>
                        e.target.value === "" && (e.target.value = "0")
                      }
                      onWheel={(e: any) => e.target.blur()}
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label className="mb-1 fw-semibold small">KETERANGAN</label>
                    <textarea
                      className="form-control"
                      required
                      value={keterangan}
                      onChange={(e) => setKeterangan(e.target.value)}
                      rows={3}
                    ></textarea>
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

export default ModalEdit;
