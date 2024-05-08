"use client";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./styles.module.css";
import { usePathname } from "next/navigation";

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

type SubDepartment = {
  id: number;
  nama_sub_department: string;
  department_id: number;
  department: Department;
};

const ModalCreate = (props: Props) => {
  const { isModalOpen, onClose, accessToken, dataDepartment } = props;

  const pathname = usePathname();
  const lastSlashIndex = pathname.lastIndexOf("/");
  const menu_url = pathname.substring(lastSlashIndex + 1);

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  // sub department state
  const [subDepartments, setSubDepartments] = useState([] as SubDepartment[]);

  const [nama, setNama] = useState("");
  const [idKaryawan, setIdKaryawan] = useState("");
  const [department, setDepartment] = useState("");
  const [subDepartment, setSubDepartment] = useState("");
  const [nik, setNik] = useState("");
  const [posisi, setPosisi] = useState("");
  const [tempatLahir, setTempatLahir] = useState("");
  const [tanggalLahir, setTanggalLahir] = useState<Date | null>(null);
  const [jenisKelamin, setJenisKelamin] = useState("");
  const [agama, setAgama] = useState("");
  const [kebangsaan, setKebangsaan] = useState("indonesia");
  const [alamat, setAlamat] = useState("");
  const [rt, setRt] = useState("");
  const [rw, setRw] = useState("");
  const [kelurahan, setKelurahan] = useState("");
  const [kecamatan, setKecamatan] = useState("");
  const [kota, setKota] = useState("");
  const [telp, setTelp] = useState("");
  const [email, setEmail] = useState("");
  const [statusNikah, setStatusNikah] = useState("");
  const [tanggalJoin, setTanggalJoin] = useState<Date | null>(null);
  const [npwp, setNpwp] = useState("");
  const [jenisBank, setJenisBank] = useState("");
  const [noRekening, setNoRekening] = useState("");
  const [bpjstk, setBpjstk] = useState("");
  const [bpjkskes, setBpjkskes] = useState("");

  const changeDepartment = async (department: number) => {
    if (department === 0) {
      setSubDepartments([]);
      return;
    }

    try {
      setSubDepartments([]);

      const body = new FormData();
      body.append("department", department.toString());

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/lib/listsubdepartment`,
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
        setSubDepartments(res.data);
      }
    } catch (error) {
      alert("something went wrong");
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (confirm("Add this data?")) {
      setIsLoading(true);
      try {
        const body = new FormData();
        body.append("nama", nama);
        body.append("id_karyawan", idKaryawan);
        body.append("department", department);
        body.append("sub_department", subDepartment);
        body.append("nik", nik);
        body.append("posisi", posisi);
        body.append("tempat_lahir", tempatLahir);
        body.append("jenis_kelamin", jenisKelamin);
        body.append("agama", agama);
        body.append("kebangsaan", kebangsaan);
        body.append("alamat", alamat);
        body.append("rt", rt);
        body.append("rw", rw);
        body.append("kelurahan", kelurahan);
        body.append("kecamatan", kecamatan);
        body.append("kota", kota);
        body.append("telp", telp);
        body.append("email", email);
        body.append("status_nikah", statusNikah);
        body.append("npwp", npwp);
        body.append("jenis_bank", jenisBank);
        body.append("no_rekening", noRekening);
        body.append("bpjstk", bpjstk);
        body.append("bpjkskes", bpjkskes);

        body.append("tanggal_lahir", tanggalLahir?.toISOString() || "");
        body.append("tanggal_join", tanggalJoin?.toISOString() || "");

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/web/datakaryawan?menu_url=${menu_url}`,
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
          className="modal modal-lg fade show"
          tabIndex={-1}
          role="dialog"
          style={{ display: "block" }}
        >
          <div className="modal-dialog">
            <form onSubmit={handleSubmit}>
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5 fw-semibold   ">
                    ADD KARYAWAN
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
                    <div className="row">
                      <div className="col-sm-9">
                        <label className="mb-1 fw-semibold small">
                          NAMA KARYAWAN
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          style={{ textTransform: "uppercase" }}
                          onChange={(e) => setNama(e.target.value)}
                          value={nama}
                          required
                        />
                      </div>

                      <div className="col-sm-3">
                        <label className="mb-1 fw-semibold small">
                          ID KARYAWAN
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          style={{ textTransform: "uppercase" }}
                          onChange={(e) => setIdKaryawan(e.target.value)}
                          value={idKaryawan}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group mb-3">
                    <div className="row">
                      <div className="col-sm-6">
                        <label className="mb-1 fw-semibold small">
                          DEPARTMENT
                        </label>
                        <select
                          className="form-select"
                          onChange={(e) => {
                            setDepartment(e.target.value);
                            changeDepartment(Number(e.target.value));
                          }}
                          value={department}
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

                      <div className="col-sm-6">
                        <label className="mb-1 fw-semibold small">
                          SUB DEPARTMENT
                        </label>
                        <select
                          className="form-select"
                          onChange={(e) => setSubDepartment(e.target.value)}
                          value={subDepartment}
                          required
                        >
                          <option value="">--PILIH--</option>
                          {subDepartments?.map(
                            (item: SubDepartment, index: number) => (
                              <option value={item.id} key={index}>
                                {item.nama_sub_department.toUpperCase()}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="form-group mb-3">
                    <div className="row">
                      <div className="col-sm-6">
                        <label className="mb-1 fw-semibold small">NIK</label>
                        <input
                          type="number"
                          className="form-control"
                          onChange={(e) => setNik(e.target.value)}
                          value={nik}
                          required
                        />
                      </div>

                      <div className="col-sm-6">
                        <label className="mb-1 fw-semibold small">POSISI</label>
                        <input
                          type="text"
                          className="form-control"
                          onChange={(e) => setPosisi(e.target.value)}
                          value={posisi}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group mb-3">
                    <div className="row">
                      <div className="col-sm-6">
                        <label className="mb-1 fw-semibold small">
                          TEMPAT LAHIR
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          onChange={(e) => setTempatLahir(e.target.value)}
                          value={tempatLahir}
                        />
                      </div>

                      <div className="col-sm-6">
                        <label className="mb-1 fw-semibold small">
                          TANGGAL LAHIR
                        </label>
                        <br />
                        <DatePicker
                          wrapperClassName={styles.datePicker}
                          className="form-select"
                          selected={tanggalLahir}
                          onChange={(e: Date) => setTanggalLahir(e)}
                          dateFormat={"yyyy-MM-dd"}
                          showMonthDropdown
                          showYearDropdown
                          scrollableYearDropdown
                          dropdownMode="select"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group mb-3">
                    <div className="row">
                      <div className="col-sm-6">
                        <label className="mb-1 fw-semibold small">
                          JENIS KELAMIN
                        </label>
                        <select
                          className="form-select"
                          required
                          onChange={(e) => setJenisKelamin(e.target.value)}
                          value={jenisKelamin}
                        >
                          <option value="">--PILIH--</option>
                          <option value="L">LAKI-LAKI</option>
                          <option value="P">PEREMPUAN</option>
                        </select>
                      </div>

                      <div className="col-sm-6">
                        <label className="mb-1 fw-semibold small">AGAMA</label>
                        <select
                          className="form-select"
                          onChange={(e) => setAgama(e.target.value)}
                          value={agama}
                          required
                        >
                          <option value="">--PILIH--</option>
                          <option value="Islam">Islam</option>
                          <option value="Kristen Protestan">
                            Kristen Protestan
                          </option>
                          <option value="Kristen Katolik">
                            Kristen Katolik
                          </option>
                          <option value="Hindu">Hindu</option>
                          <option value="Buddha">Buddha</option>
                          <option value="Konghucu">Konghucu</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="form-group mb-3">
                    <label className="mb-1 fw-semibold small">
                      KEBANGSAAAN
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      onChange={(e) => setKebangsaan(e.target.value)}
                      value={kebangsaan}
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label className="mb-1 fw-semibold small">ALAMAT</label>
                    <textarea
                      className="form-control"
                      rows={5}
                      onChange={(e) => setAlamat(e.target.value)}
                      value={alamat}
                    ></textarea>
                  </div>

                  <div className="form-group mb-3">
                    <div className="row">
                      <div className="col-sm-6">
                        <label className="mb-1 fw-semibold small">RT</label>
                        <input
                          type="text"
                          className="form-control"
                          onChange={(e) => setRt(e.target.value)}
                          value={rt}
                        />
                      </div>

                      <div className="col-sm-6">
                        <label className="mb-1 fw-semibold small">RW</label>
                        <input
                          type="text"
                          className="form-control"
                          onChange={(e) => setRw(e.target.value)}
                          value={rw}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group mb-3">
                    <div className="row">
                      <div className="col-sm-6">
                        <label className="mb-1 fw-semibold small">
                          KELURAHAN
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          onChange={(e) => setKelurahan(e.target.value)}
                          value={kelurahan}
                        />
                      </div>

                      <div className="col-sm-6">
                        <label className="mb-1 fw-semibold small">
                          KECAMATAN
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          onChange={(e) => setKecamatan(e.target.value)}
                          value={kecamatan}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group mb-3">
                    <label className="mb-1 fw-semibold small">KOTA</label>
                    <input
                      type="text"
                      className="form-control"
                      onChange={(e) => setKota(e.target.value)}
                      value={kota}
                    />
                  </div>

                  <div className="form-group mb-3">
                    <div className="row">
                      <div className="col-sm-6">
                        <label className="mb-1 fw-semibold small">
                          TELP/HP/WA
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          onChange={(e) => setTelp(e.target.value)}
                          value={telp}
                        />
                      </div>

                      <div className="col-sm-6">
                        <label className="mb-1 fw-semibold small">EMAIL</label>
                        <input
                          type="email"
                          className="form-control"
                          onChange={(e) => setEmail(e.target.value)}
                          value={email}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group mb-3">
                    <label className="mb-1 fw-semibold small">
                      STATUS NIKAH
                    </label>
                    <select
                      className="form-select"
                      onChange={(e) => setStatusNikah(e.target.value)}
                      value={statusNikah}
                      required
                    >
                      <option value="">--PILIH--</option>
                      <option value="TK">TK</option>
                      <option value="K0">K0</option>
                      <option value="K1">K1</option>
                      <option value="K2">K2</option>
                      <option value="K3">K3</option>
                      <option value="TK/0">TK/0</option>
                      <option value="TK/1">TK/1</option>
                      <option value="TK/2">TK/2</option>
                      <option value="TK/3">TK/3</option>
                    </select>
                  </div>

                  <div className="form-group mb-3">
                    <label className="mb-1 fw-semibold small">
                      TANGGAL JOIN
                    </label>
                    <br />
                    <DatePicker
                      wrapperClassName={styles.datePicker}
                      className="form-select"
                      selected={tanggalJoin}
                      onChange={(e: Date) => setTanggalJoin(e)}
                      dateFormat={"yyyy-MM-dd"}
                      showMonthDropdown
                      showYearDropdown
                      scrollableYearDropdown
                      dropdownMode="select"
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label className="mb-1 fw-semibold small">NPWP</label>
                    <input
                      type="text"
                      className="form-control"
                      onChange={(e) => setNpwp(e.target.value)}
                      value={npwp}
                    />
                  </div>

                  <div className="form-group mb-3">
                    <div className="row">
                      <div className="col-sm-6">
                        <label className="mb-1 fw-semibold small">
                          JENIS BANK
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          onChange={(e) => setJenisBank(e.target.value)}
                          value={jenisBank}
                        />
                      </div>

                      <div className="col-sm-6">
                        <label className="mb-1 fw-semibold small">
                          NO. REKENING
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          onChange={(e) => setNoRekening(e.target.value)}
                          value={noRekening}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group mb-3">
                    <div className="row">
                      <div className="col-sm-6">
                        <label className="mb-1 fw-semibold small">
                          BPJS TK
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          onChange={(e) => setBpjstk(e.target.value)}
                          value={bpjstk}
                        />
                      </div>

                      <div className="col-sm-6">
                        <label className="mb-1 fw-semibold small">
                          BPJS KES
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          onChange={(e) => setBpjkskes(e.target.value)}
                          value={bpjkskes}
                        />
                      </div>
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
