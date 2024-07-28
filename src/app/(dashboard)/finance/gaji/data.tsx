"use client";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import ModalCreate from "./modalCreate";
import { usePathname } from "next/navigation";
import * as XLSX from "xlsx";

type Department = {
  id: number;
  nama_department: string;
  lot: string;
  latitude: string;
  longitude: string;
  radius: string;
};

interface Pegawai {
  id: number;
  nama: string;
  status_nikah: string;
  no_rek: string;
  position: string;
  department: Department;
  sub_department: SubDepartment;
}

interface Gaji {
  id: number;
  uuid: string;
  bulan: number;
  tahun: number;
  pegawai_id: number;
  nominal: string;
  publish: boolean;
  department_id: number;
  pegawai: Pegawai;
  komponen_id: number;
  tipe: string;
}

type ListKomponen = {
  id: number;
  komponen: string;
  tipe: string;
};

type ListGaji = {
  id: number;
  nama: string;
  status_nikah: string;
  no_rek: string;
  position: string;
  department: Department;
  sub_department: SubDepartment;
  gaji: Gaji[];
};

type SubDepartment = {
  nama_sub_department: string;
};

interface isLoadingProps {
  [key: number]: boolean;
}

const Data = ({
  accessToken,
  departments,
}: {
  accessToken: string;
  departments: Department[];
}) => {
  const pathname = usePathname();
  const lastSlashIndex = pathname.lastIndexOf("/");
  const menu_url = pathname.substring(lastSlashIndex + 1);

  // loading state
  const [isLoadingDelete, setIsLoadingDelete] = useState<isLoadingProps>({});
  const [isLoadingExport, setIsLoadingExport] = useState(false);

  // modal state
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);

  // filter
  const [search, setSearch] = useState("");
  const [bulan, setBulan] = useState((new Date().getMonth() + 1).toString());
  const [tahun, setTahun] = useState(new Date().getFullYear().toString());
  const [selectDept, setSelectDept] = useState(departments[0].id.toString());

  const handleCreate = async () => {
    setIsModalCreateOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Delete this data?")) {
      setIsLoadingDelete((prev) => ({ ...prev, [id]: true }));
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/web/gaji/${id}?menu_url=${menu_url}`,
          {
            method: "DELETE",
            headers: {
              authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const res = await response.json();
        alert(res.message);
        if (response.ok) {
          mutate(
            search === ""
              ? `${process.env.NEXT_PUBLIC_API_URL}/api/web/gaji?menu_url=${menu_url}&select_dept=${selectDept}&bulan=${bulan}&tahun=${tahun}`
              : `${process.env.NEXT_PUBLIC_API_URL}/api/web/gaji?menu_url=${menu_url}&select_dept=${selectDept}&bulan=${bulan}&tahun=${tahun}&search=${search}`
          );
        }
      } catch (error) {
        alert("something went wrong");
      }
      setIsLoadingDelete((prev) => ({ ...prev, [id]: false }));
    }
  };

  const closeModal = () => {
    setIsModalCreateOpen(false);
    mutate(
      search === ""
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/web/gaji?menu_url=${menu_url}&select_dept=${selectDept}&bulan=${bulan}&tahun=${tahun}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/web/gaji?menu_url=${menu_url}&select_dept=${selectDept}&bulan=${bulan}&tahun=${tahun}&search=${search}`
    );
  };

  const exportToExcel = async (dataSalary: Gaji[]) => {
    setIsLoadingExport(true);
    try {
      const body = new FormData();
      body.append("department", selectDept);
      body.append("tahun", tahun);
      body.append("bulan", bulan);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/lib/exportexcel_gaji`,
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
        // export here
        const headers = res.data.listKomponen;
        const data = res.data.listGaji;

        const headerTitles = [
          "NO",
          "NAMA",
          "POSITION",
          "DEPARTMENT",
          "SUB DEPARTMENT",
          "STATUS NIKAH",
          "REKENING",
          ...headers.map((item: ListKomponen) => item.komponen),
          "TOTAL SALARY",
        ];

        const exportData = data.map((item: ListGaji, index: number) => {
          const komponenValues = headers.reduce((acc: any, header: any) => {
            const komponenItem = item.gaji.find(
              (item2: Gaji) => item2.komponen_id === header.id
            );
            if (komponenItem) {
              acc[header.komponen] =
                komponenItem.tipe === "penambahan" ||
                komponenItem.tipe === "pengurangan"
                  ? Number(komponenItem.nominal)
                  : komponenItem.nominal?.toString();
            } else {
              acc[header.komponen] = "INVALID DATA";
            }
            return acc;
          }, {});

          return {
            NO: index + 1,
            NAMA: item.nama?.toUpperCase(),
            POSITION: item.position?.toUpperCase(),
            DEPARTMENT: item.department.nama_department?.toUpperCase(),
            "SUB DEPARTMENT":
              item.sub_department.nama_sub_department?.toUpperCase(),
            "STATUS NIKAH": item.status_nikah?.toUpperCase(),
            REKENING: item.no_rek?.toUpperCase(),
            ...komponenValues,
            "TOTAL SALARY": item.gaji.reduce((acc: number, item2: Gaji) => {
              const nominal = Number(item2.nominal);
              if (item2.tipe === "penambahan") {
                return acc + nominal;
              } else if (item2.tipe === "pengurangan") {
                return acc - nominal;
              } else {
                return acc;
              }
            }, 0),
          };
        });

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.aoa_to_sheet([headerTitles]);
        XLSX.utils.sheet_add_json(worksheet, exportData, {
          skipHeader: true,
          origin: "A2",
        });
        const colWidths = headerTitles.map((title, index) => {
          const maxContentWidth = Math.max(
            ...exportData.map((row: any) =>
              row[title] ? row[title].toString().length : 0
            )
          );
          return { wch: Math.max(title.length, maxContentWidth) };
        });
        worksheet["!cols"] = colWidths;
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, `GajiExportHeadersOnly.xlsx`);
      }
    } catch (error) {
      alert("something went wrong");
    }
    setIsLoadingExport(false);
  };

  const fetcher = (url: RequestInfo) => {
    return fetch(url, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
      next: {
        revalidate: 60,
      },
    }).then((res) => res.json());
  };

  const { data, error, isLoading } = useSWR(
    search === ""
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/web/gaji?menu_url=${menu_url}&select_dept=${selectDept}&bulan=${bulan}&tahun=${tahun}`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/web/gaji?menu_url=${menu_url}&select_dept=${selectDept}&bulan=${bulan}&tahun=${tahun}&search=${search}`,
    fetcher
  );

  if (isLoading) {
    return (
      <div className="card-body">
        <div className="row">
          <div className="col-sm-12 d-flex justify-content-between align-items-center">
            <div></div>

            <input
              type="text"
              placeholder="Search..."
              aria-label="Search"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              className="form-control-sm ms-2"
              id="search"
              style={{
                width: "200px",
                float: "right",
                border: "1px solid #ced4da",
              }}
            />
          </div>
        </div>

        <div className="text-center">
          <span
            className="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true"
          />{" "}
          Loading...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-body">
        <div className="text-center">
          {data?.message && `Err: ${data?.message} - `} please refresh the page
        </div>
      </div>
    );
  }

  if (!data.status) {
    return (
      <div className="card-body">
        <div className="text-center">
          {data?.message} please refresh the page
        </div>
      </div>
    );
  }

  const salarys = data?.data;
  const actions = data?.actions;

  return (
    <>
      <div className="card-body">
        <div className="row">
          <div className="col-sm-12 d-flex justify-content-between align-items-center">
            <div>
              {actions?.includes("insert") && (
                <button
                  type="button"
                  className="btn btn-primary btn-sm fw-bold"
                  onClick={() => handleCreate()}
                >
                  ADD DATA
                </button>
              )}
              <select
                className="form-select-sm ms-2"
                value={selectDept}
                onChange={(e) => setSelectDept(e.target.value)}
              >
                {departments?.map((item: Department, index: number) => (
                  <option value={item.id} key={index}>
                    {item.nama_department?.toUpperCase()}
                  </option>
                ))}
              </select>

              <select
                className="form-select-sm ms-2"
                value={bulan}
                onChange={(e) => setBulan(e.target.value)}
              >
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

              <select
                className="form-select-sm ms-2"
                required
                value={tahun}
                onChange={(e) => setTahun(e.target.value)}
              >
                {Array.from({ length: 2 }, (_, i) => (
                  <option value={new Date().getFullYear() + i} key={i}>
                    {new Date().getFullYear() + i}
                  </option>
                ))}
              </select>
            </div>

            <input
              type="text"
              placeholder="Search..."
              aria-label="Search"
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              className="form-control-sm ms-2"
              id="search"
              style={{
                width: "200px",
                float: "right",
                border: "1px solid #ced4da",
              }}
            />
          </div>
        </div>

        <div className="row">
          <div className="col-sm-12 d-flex justify-content-between align-items-center mt-2">
            <div>
              {salarys?.length > 0 &&
                (isLoadingExport ? (
                  <button
                    type="button"
                    className="btn btn-success btn-sm fw-bold"
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
                  <button
                    type="button"
                    className="btn btn-success btn-sm fw-bold"
                    onClick={() => exportToExcel(salarys)}
                  >
                    EXPORT TO EXCEL
                  </button>
                ))}
            </div>
          </div>
        </div>

        <div className="table-responsive mt-3" style={{ maxHeight: "500px" }}>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th className="fw-semibold fs-6" style={{ width: "1%" }}>
                  NO
                </th>
                <th className="fw-semibold fs-6">NAMA</th>
                <th className="fw-semibold fs-6" style={{ width: "15%" }}>
                  NOMINAL
                </th>
                <th className="fw-semibold fs-6" style={{ width: "15%" }}>
                  SLIP
                </th>
                <th className="fw-semibold fs-6" style={{ width: "10%" }}>
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody>
              {salarys?.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className="text-center">Tidak ada data</div>
                  </td>
                </tr>
              ) : (
                salarys?.map((item: Gaji, index: number) => (
                  <tr key={index}>
                    <td align="center">{index + 1}</td>
                    <td align="left">{item.pegawai?.nama?.toUpperCase()}</td>
                    <td align="right">
                      {Number(item.nominal).toLocaleString("id-ID")}
                    </td>
                    <td align="center">
                      <a
                        href={`/slipgaji/${item.uuid}`}
                        className="btn btn-success btn-sm"
                        target="_blank"
                      >
                        <i
                          className="fa fa-file-text me-2"
                          aria-hidden="true"
                        />
                        SLIP GAJI
                      </a>
                    </td>
                    <td align="center">
                      {actions?.includes("delete") &&
                        (isLoadingDelete[item.id] ? (
                          <button className="btn btn-danger btn-sm" disabled>
                            <span
                              className="spinner-border spinner-border-sm"
                              role="status"
                              aria-hidden="true"
                            />
                          </button>
                        ) : (
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(item.id)}
                          >
                            DELETE
                          </button>
                        ))}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* modal create */}
      {isModalCreateOpen && (
        <ModalCreate
          isModalOpen={isModalCreateOpen}
          onClose={closeModal}
          accessToken={accessToken}
          dataDepartment={departments}
        />
      )}
    </>
  );
};

export default Data;
