"use client";

import { useState } from "react";
import Datepicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./styles.module.css";

type SessionIzin = {
  id: number;
  uuid: string;
  pegawai_id: number;
  created_at: Date;
  expired_at: Date;
  expired: boolean;
  pegawai: Pegawai;
};

type Pegawai = {
  id: number;
  nama: string;
  department: Department;
  sub_department: SubDepartment;
};

type Department = {
  id: number;
  nama_department: string;
};

type SubDepartment = {
  id: number;
  nama_sub_department: string;
  akses_izin: string;
};
type TanggalMerah = {
  id: number;
  tanggal: Date;
  tanggal_merah_id: number;
  tanggal_nomor: string;
};

const Data = ({
  session,
  tanggalMerah,
}: {
  session: SessionIzin;
  tanggalMerah: TanggalMerah[];
}) => {
  const pegawai = session?.pegawai?.nama?.toUpperCase();
  const department =
    session?.pegawai?.department?.nama_department.toUpperCase();
  const [jenisIzin, setJenisIzin] = useState("");
  const [tanggalIzin, setTanggalIzin] = useState<Date | null>(null);
  const [jumlahHari, setJumlahHari] = useState("");
  const [jumlahJam, setJumlahJam] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [base64, setBase64] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (confirm("Apakan anda yakin ingin mengajukan izin ini?")) {
      setIsLoading(true);
      try {
        const body = {
          jenis_izin: jenisIzin,
          tanggal: tanggalIzin?.toISOString() || "",
          jumlah_hari: jumlahHari,
          jumlah_jam: jumlahJam,
          keterangan: keterangan,
          mc: base64,
        };

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/lib/pengajuan-izin/${session.uuid}`,
          {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const res = await response.json();
        if (!response.ok) {
          alert(res.message);
        } else {
          alert(res.message);
          setSuccess(true);
        }
      } catch (error) {
        alert("something went wrong");
      }
      setIsLoading(false);
    }
  };

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const fileExtension = file.name.split(".").pop().toLowerCase();
      const allowedExtensions = ["png", "jpg", "jpeg"];

      if (!allowedExtensions.includes(fileExtension)) {
        alert("Only PNG, JPG, and JPEG files are allowed.");
        event.target.value = "";
        return;
      }

      const fileSize = file.size / 1024;
      if (fileSize > 2048) {
        alert("Maximum file size is 2MB.");
        event.target.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (success) {
    return (
      <div className="col-lg-5">
        <div className="card shadow-lg border-0 rounded-lg mt-5">
          <div
            className={`alert alert-success alert-solid mx-4 mt-4`}
            role="alert"
          >
            <strong>Success</strong>
            <p className="mb-0">
              Pengajuan berhasil dilakukan silahkan lihat status di dalam
              aplikasi .
            </p>
          </div>
          <div className="card-header justify-content-center text-center">
            <h3 className="fw-semibold my-4">FORM PENGAJUAN IZIN</h3>
          </div>
          <div className="card-body"></div>
        </div>
      </div>
    );
  }

  if (session === null) {
    return (
      <div className="col-lg-5">
        <div className="card shadow-lg border-0 rounded-lg mt-5">
          <div
            className={`alert alert-danger alert-solid mx-4 mt-4`}
            role="alert"
          >
            <strong>Unauthorized</strong>
            <p className="mb-0">You are not authorized to access this page.</p>
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
      <form onSubmit={handleSubmit}>
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
                value={department}
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
                value={pegawai}
                readOnly
              />
            </div>
            <hr />
            <div className="mb-3">
              <label className="mb-1 fw-semibold small" htmlFor="inputUsername">
                JENIS PENGAJUAN
              </label>
              <select
                className="form-select"
                onChange={(e) => setJenisIzin(e.target.value)}
                required
              >
                <option value="">--PILIH--</option>
                {session?.pegawai?.sub_department?.akses_izin
                  .split(",")
                  .map((item: any, index: any) => (
                    <option value={item} key={index}>
                      {jenisPengajuan(item)}
                    </option>
                  ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="mb-1 fw-semibold small" htmlFor="inputUsername">
                TANGGAL IZIN
              </label>
              <Datepicker
                wrapperClassName={styles.datePicker}
                className="form-select"
                selected={tanggalIzin}
                onChange={(e: Date) => setTanggalIzin(e)}
                dateFormat={"yyyy-MM-dd"}
                showMonthDropdown
                showYearDropdown
                scrollableYearDropdown
                dropdownMode="select"
                required
                excludeDates={tanggalMerah?.map(
                  (item) => new Date(item.tanggal)
                )}
              />
            </div>

            {(jenisIzin == "C" || jenisIzin == "I" || jenisIzin == "S") && (
              <div className="mb-3">
                <label
                  className="mb-1 fw-semibold small"
                  htmlFor="inputUsername"
                >
                  JUMLAH HARI
                </label>
                <input
                  type="number"
                  step={1}
                  className="form-control"
                  required
                  onChange={(e) => setJumlahHari(e.target.value)}
                />
              </div>
            )}

            {(jenisIzin == "G1" || jenisIzin == "G2" || jenisIzin == "G3") && (
              <div className="mb-3">
                <label
                  className="mb-1 fw-semibold small"
                  htmlFor="inputUsername"
                >
                  JUMLAH JAM IZIN
                </label>
                <select
                  className="form-select"
                  required
                  onChange={(e) => setJumlahJam(e.target.value)}
                >
                  <option key={0} value="">
                    --PILIH--
                  </option>
                  <option key={1} value="0.5">
                    Setengah Jam
                  </option>
                  <option key={2} value="1">
                    1 Jam
                  </option>
                  <option key={3} value="1.5">
                    1.5 Jam
                  </option>
                  <option key={4} value="2">
                    2 Jam
                  </option>
                  <option key={5} value="2.5">
                    2.5 Jam
                  </option>
                  <option key={6} value="3">
                    3 Jam
                  </option>
                  <option key={7} value="3.5">
                    3.5 Jam
                  </option>
                </select>
              </div>
            )}

            <div className="mb-3">
              <label className="mb-1 fw-semibold small" htmlFor="inputUsername">
                KETERANGAN
              </label>
              <textarea
                className="form-control"
                rows={3}
                required
                onChange={(e) => setKeterangan(e.target.value)}
              ></textarea>
            </div>

            {jenisIzin == "S" && (
              <div className="mb-3">
                <label
                  className="mb-1 fw-semibold small"
                  htmlFor="inputUsername"
                >
                  MC/SURAT KETERANGAN SAKIT
                </label>
                <input
                  type="file"
                  className="form-control"
                  required
                  onChange={(e) => handleFileChange(e)}
                />
              </div>
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
              <button type="submit" className="btn btn-primary float-end">
                Submit Data
              </button>
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

export default Data;
