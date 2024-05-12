"use client";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Select from "react-select";
import Datepicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./styles.module.css";

type Props = {
  isModalOpen: any;
  onClose: any;
  accessToken?: string;
  listSubDepartment?: SubDepartment[];
};

type SubDepartment = {
  id: number;
  nama_sub_department: string;
};

type Karyawan = {
  id: number;
  nama: string;
};

const ModalCreate = (props: Props) => {
  const pathname = usePathname();
  const lastSlashIndex = pathname.lastIndexOf("/");
  const menu_url = pathname.substring(lastSlashIndex + 1);

  const { isModalOpen, onClose, accessToken, listSubDepartment } = props;

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  const [listKaryawan, setListKaryawan] = useState([]);

  const [subDepartment, setSubDepartment] = useState("");
  const [karyawan, setKaryawan] = useState<any>([]);
  const [tanggal, setTanggal] = useState<Date | null>(null);

  const selectAll = () => {
    if (karyawan?.length > 0) {
      setKaryawan([]);
      return;
    }

    setKaryawan(
      listKaryawan?.map((item: Karyawan) => ({
        label: item.nama?.toUpperCase(),
        value: item.id,
      }))
    );
  };

  const handlePegawai = async (sub_department: Number) => {
    if (!sub_department) {
      setListKaryawan([]);
      setKaryawan([]);
      return;
    }

    try {
      const body = new FormData();
      body.append("sub_department", sub_department?.toString());
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
      } else {
        setListKaryawan(res.data);
      }
    } catch (error) {
      alert("something went wrong");
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // if (confirm("Add this data?")) {
    //   setIsLoading(true);
    //   try {
    //     const body = new FormData();
    //     body.append("nama_department", namaDepartment);
    //     body.append("lot", lot);
    //     body.append("latitude", latitude);
    //     body.append("longitude", longitude);
    //     body.append("radius", radius);

    //     const response = await fetch(
    //       `${process.env.NEXT_PUBLIC_API_URL}/api/web/department?menu_url=${menu_url}`,
    //       {
    //         method: "POST",
    //         headers: {
    //           authorization: `Bearer ${accessToken}`,
    //         },
    //         body: body,
    //       }
    //     );

    //     const res = await response.json();
    //     if (!response.ok) {
    //       alert(res.message);
    //     } else {
    //       alert(res.message);
    //       onClose();
    //     }
    //   } catch (error) {
    //     alert("something went wrong");
    //   }
    //   setIsLoading(false);
    // }
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
                    ADD OVERTIME
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
                    <label className="mb-1 fw-semibold small">
                      SUB DEPARTMENT
                    </label>
                    <select
                      className="form-select"
                      onChange={(e) => {
                        handlePegawai(Number(e.target.value));
                      }}
                    >
                      <option value="">--SELECT--</option>
                      {listSubDepartment?.map(
                        (item: SubDepartment, index: number) => (
                          <option value={item.id} key={index}>
                            {item.nama_sub_department?.toUpperCase()}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div className="form-group mb-3">
                    <label className="mb-1 fw-semibold small">KARYAWAN</label>
                    <Select
                      options={listKaryawan?.map((item: Karyawan) => ({
                        value: item.id,
                        label: item.nama?.toUpperCase(),
                      }))}
                      onChange={(e: any) => setKaryawan(e)}
                      value={karyawan}
                      closeMenuOnSelect={false}
                      isMulti
                      isClearable
                      required
                    />{" "}
                    {listKaryawan?.length > 0 && (
                      <>
                        select all{" "}
                        <input type="checkbox" onChange={selectAll} />
                      </>
                    )}
                  </div>

                  <div className="mb-3">
                    <label
                      className="mb-1 fw-semibold small"
                      htmlFor="inputUsername"
                    >
                      TANGGAL
                    </label>
                    <Datepicker
                      wrapperClassName={styles.datePicker}
                      className="form-select"
                      selected={tanggal}
                      onChange={(e: Date) => setTanggal(e)}
                      dateFormat={"yyyy-MM-dd"}
                      showMonthDropdown
                      showYearDropdown
                      scrollableYearDropdown
                      dropdownMode="select"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label
                      className="mb-1 fw-semibold small"
                      htmlFor="inputUsername"
                    >
                      FROM
                    </label>
                    <input type="text" className="form-control" required />
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
