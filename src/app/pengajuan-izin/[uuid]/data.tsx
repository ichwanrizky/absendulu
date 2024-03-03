"use client";

import { useState } from "react";

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

const PengajuanIzinPegawaiData = ({ session }: { session: SessionIzin }) => {
  console.log(session);

  const [pegawai, setPegawai] = useState(session.pegawai?.nama?.toUpperCase());
  const [idPegawai, setIdPegawai] = useState(session.pegawai_id);
  const [department, setDepartment] = useState(
    session.pegawai?.department?.nama_department.toUpperCase()
  );

  return (
    <div className="col-lg-5">
      <form>
        <div className="card shadow-lg border-0 rounded-lg mt-5">
          <div className="card-header justify-content-center text-center">
            <h3 className="fw-semibold my-4">FORM PENGAJUAN IZINN</h3>
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
            <div className="mb-3">
              <label className="mb-1 fw-semibold small" htmlFor="inputUsername">
                JENIS
              </label>
              <input
                className="form-control"
                type="text"
                value={pegawai}
                readOnly
              />
            </div>
          </div>
          <div className="card-footer">
            <button type="submit" className="btn btn-primary px-5">
              Login
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PengajuanIzinPegawaiData;
