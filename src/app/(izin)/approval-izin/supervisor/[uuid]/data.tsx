"use client";

import { useState } from "react";

type DataIzin = {
  id: number;
  uuid: string;
  jenis_izin: string;
  tanggal: Date;
  pegawai_id: number;
  status: number;
  bulan: number;
  tahun: number;
  keterangan: string;
  jumlah_hari: string;
  jumlah_jam: string;
  approve_by: null;
  approve_date: null;
  pegawai: Pegawai;
};

type Pegawai = {
  nama: string;
  department: Department;
  sub_department: SubDepartment;
};

type Department = {
  nama_department: string;
};

type SubDepartment = {
  nama_sub_department: string;
};

const Data = ({
  dataIzin,
  accessToken,
}: {
  dataIzin: DataIzin;
  accessToken: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(dataIzin.status);

  const handleApprove = async () => {
    if (confirm("Approve this data?")) {
      setIsLoading(true);
      try {
        const body = new FormData();

        body.append("id", dataIzin.id.toString());
        body.append("status", "1");
        body.append("metode", "supervisor");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/lib/approval_izin`,
          {
            method: "POST",
            body: body,
            headers: {
              authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const res = await response.json();
        if (!response.ok) {
          alert(res.message);
        } else {
          alert(res.message);
          setStatus(1);
        }
      } catch (error) {
        alert("something went wrong");
      }
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    if (confirm("Reject this data?")) {
      setIsLoading(true);
      try {
        const body = new FormData();
        body.append("id", dataIzin.id.toString());
        body.append("status", "2");
        body.append("metode", "supervisor");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/lib/approval_izin`,
          {
            method: "POST",
            body: body,
            headers: {
              authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const res = await response.json();
        if (!response.ok) {
          alert(res.message);
        } else {
          alert(res.message);
          setStatus(2);
        }
      } catch (error) {
        alert("something went wrong");
      }
      setIsLoading(false);
    }
  };

  if (status !== 0) {
    return (
      <div className="col-lg-5">
        <div className="card shadow-lg border-0 rounded-lg mt-5">
          <div
            className={`alert alert-success alert-solid mx-4 mt-4`}
            role="alert"
          >
            <strong>Success</strong>
            <p className="mb-0">Data has been approved / rejected.</p>
          </div>
          <div className="card-header justify-content-center text-center">
            <h3 className="fw-semibold my-4">FORM PENGAJUAN IZIN</h3>
          </div>
          <div className="card-body"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="col-lg-5">
      <form>
        <div className="card shadow-lg border-0 rounded-lg mt-5">
          <div className="card-header justify-content-center text-center">
            <h3 className="fw-semibold my-4">FORM PENGAJUAN IZIN</h3>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <label className="mb-1 fw-semibold small" htmlFor="inputUsername">
                DEPARTMENT
              </label>
              <input
                className="form-control"
                type="text"
                value={dataIzin.pegawai.department?.nama_department?.toUpperCase()}
                readOnly
              />
            </div>

            <div className="mb-3">
              <label className="mb-1 fw-semibold small" htmlFor="inputUsername">
                NAMA
              </label>
              <input
                className="form-control"
                type="text"
                value={dataIzin.pegawai.nama?.toUpperCase()}
                readOnly
              />
            </div>

            <div className="mb-3">
              <label className="mb-1 fw-semibold small" htmlFor="inputUsername">
                JENIS PENGAJUAN
              </label>
              <input
                className="form-control"
                type="text"
                value={jenisPengajuan(dataIzin.jenis_izin)}
                readOnly
              />
            </div>

            <div className="mb-3">
              <label className="mb-1 fw-semibold small" htmlFor="inputUsername">
                TANGGAL
              </label>
              <input
                className="form-control"
                type="text"
                value={new Date(dataIzin.tanggal as Date).toLocaleString(
                  "id-ID",
                  optionsDate
                )}
                readOnly
              />
            </div>

            <div className="mb-3">
              <label className="mb-1 fw-semibold small" htmlFor="inputUsername">
                JUMLAH HARI
              </label>
              <input
                className="form-control"
                type="text"
                value={dataIzin.jumlah_hari}
                readOnly
              />
            </div>

            <div className="mb-3">
              <label className="mb-1 fw-semibold small" htmlFor="inputUsername">
                JUMLAH JAM
              </label>
              <input
                className="form-control"
                type="text"
                value={dataIzin.jumlah_jam || undefined}
                readOnly
              />
            </div>

            <div className="mb-3">
              <label className="mb-1 fw-semibold small" htmlFor="inputUsername">
                KETERANGAN
              </label>
              <textarea
                className="form-control"
                value={dataIzin.keterangan}
                readOnly
                rows={4}
              />
            </div>

            {dataIzin.jenis_izin === "S" && (
              <>
                <label
                  className="mb-1 fw-semibold small"
                  htmlFor="inputUsername"
                >
                  MC
                </label>
                <img
                  src={`/izin/${dataIzin.uuid}.png`}
                  alt=""
                  style={{ width: "100%" }}
                />
              </>
            )}
          </div>
          <div className="card-footer">
            {isLoading ? (
              <button
                type="submit"
                className="btn btn-primary float-end"
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
              <>
                <button
                  type="button"
                  className="btn btn-success float-end ms-2"
                  onClick={() => handleApprove()}
                >
                  Approve Data
                </button>

                <button
                  type="button"
                  className="btn btn-danger float-end"
                  onClick={() => handleReject()}
                >
                  Reject Data
                </button>
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

const jenisPengajuan = (jenis: string) => {
  switch (jenis) {
    case "C":
      return "Cuti";

    case "CS":
      return "Cuti Setengah Hari";

    case "I":
      return "Izin";

    case "IS":
      return "Izin Setengah Hari";

    case "S":
      return "Sakit";

    case "G1":
      return "Gatepass";

    case "G2":
      return "Datang Terlambat";

    case "G3":
      return "Pulang Awal";

    case "P/M":
      return "Lupa Absen";
  }
};

const optionsDate: any = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
};

export default Data;
