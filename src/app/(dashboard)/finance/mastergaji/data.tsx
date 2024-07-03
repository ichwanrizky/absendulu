"use client";

import { NumericFormat } from "react-number-format";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";

type Department = {
  id: number;
  nama_department: string;
  lot: string;
  latitude: string;
  longitude: string;
  radius: string;
};

type KomponenGaji = {
  id: number;
  komponen: string;
};

type Pegawai = {
  id: number;
  nama: string;
  status_nikah: string;
  type_gaji: string;
  master_gaji_pegawai: MasterGajiPegawai[];
};

type MasterGajiPegawai = {
  id: number;
  nominal: number;
  komponen_id: number;
  komponen: KomponenGaji;
};

const Data = ({
  accessToken,
  departments,
  listKomponenGaji,
}: {
  accessToken: string;
  departments: Department[];
  listKomponenGaji: KomponenGaji[];
}) => {
  const pathname = usePathname();
  const lastSlashIndex = pathname.lastIndexOf("/");
  const menu_url = pathname.substring(lastSlashIndex + 1);

  // loading state
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);
  const [selectDept, setSelectDept] = useState(departments[0].id.toString());

  const newListKomponenGaji = listKomponenGaji as KomponenGaji[];
  const [nominalMasterGaji, setNominalMasterGaji] = useState<any>([]);
  const [selectedPegawai, setSelectedPegawai] = useState<any>([]);

  const handleChangeData = (
    pegawaiId: number,
    komponenId: number,
    value: number
  ) => {
    setNominalMasterGaji(
      nominalMasterGaji.map((item: Pegawai) => {
        return {
          ...item,
          master_gaji_pegawai: newListKomponenGaji?.map(
            (item2: KomponenGaji, index: number) => {
              if (item2.id === komponenId && item.id === pegawaiId) {
                return {
                  ...item2,
                  nominal: value,
                };
              } else {
                return {
                  ...item2,
                  nominal: item?.master_gaji_pegawai[index]?.nominal
                    ? item.master_gaji_pegawai[index].nominal
                    : 0,
                };
              }
            }
          ),
        };
      })
    );
  };

  const handleSelectPegawai = (pegawaiId: number) => {
    if (selectedPegawai.find((item: any) => item.pegawai === pegawaiId)) {
      setSelectedPegawai(
        selectedPegawai.filter((item: any) => item.pegawai !== pegawaiId)
      );
    } else {
      setSelectedPegawai([...selectedPegawai, { pegawai: pegawaiId }]);
    }
  };

  const handleSelectAllPegawai = () => {
    const allPegawaiIds = nominalMasterGaji.map((item: any) => item.id);

    const allSelected = allPegawaiIds.every((item: any) =>
      selectedPegawai.find((item2: any) => item2.pegawai === item)
    );

    if (allSelected) {
      setSelectedPegawai([]);
    } else {
      setSelectedPegawai(allPegawaiIds.map((item: any) => ({ pegawai: item })));
    }
  };

  const handleType = (pegawaiId: number, type: string) => {
    if (type === "") {
      alert("Type Gaji cannot be empty");
      return;
    }

    setNominalMasterGaji(
      nominalMasterGaji.map((item: Pegawai) =>
        item.id === pegawaiId ? { ...item, type_gaji: type } : item
      )
    );
  };

  const handleCreate = async () => {
    if (selectedPegawai.length === 0) {
      alert("Please select at least one pegawai");
      return;
    }

    if (confirm("Save this data?")) {
      setIsLoadingCreate(true);
      try {
        const selecedPegawai = selectedPegawai?.map(
          (item: any) => item.pegawai
        );

        const filteredMasterGaji = nominalMasterGaji.filter((item: any) =>
          selecedPegawai.includes(item.id)
        );

        const body = new FormData();
        body.append("selected_pegawai", JSON.stringify(selectedPegawai));
        body.append("data_master_gaji", JSON.stringify(filteredMasterGaji));

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/web/mastergaji?menu_url=${menu_url}`,
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
          setSelectedPegawai([]);
          mutate(
            `${process.env.NEXT_PUBLIC_API_URL}/api/web/mastergaji?menu_url=${menu_url}&select_dept=${selectDept}`
          );
        }
      } catch (error) {
        alert("something went wrong");
      }
      setIsLoadingCreate(false);
    }
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
    `${process.env.NEXT_PUBLIC_API_URL}/api/web/mastergaji?menu_url=${menu_url}&select_dept=${selectDept}`,
    fetcher
  );
  useEffect(() => {
    if (data?.data) {
      setNominalMasterGaji(
        data?.data.map((item: Pegawai) => ({
          id: item.id,
          nama: item.nama,
          status_nikah: item.status_nikah,
          type_gaji: item.type_gaji,
          master_gaji_pegawai:
            item.master_gaji_pegawai.length > 0
              ? item.master_gaji_pegawai.map((item2: MasterGajiPegawai) => ({
                  id: item2.komponen.id,
                  komponen: item2.komponen.komponen,
                  nominal: item2.nominal,
                }))
              : newListKomponenGaji.map((item2: KomponenGaji) => ({
                  id: item2.id,
                  komponen: item2.komponen,
                  nominal: 0,
                })),
        }))
      );
    }
  }, [data]);

  if (isLoading) return <div></div>;
  if (error) return <div></div>;

  const masterGaji = data?.data;
  const actions = data?.actions;

  return (
    <>
      <div className="card-body">
        <div className="row">
          <div className="col-sm-12">
            {actions?.includes("insert") &&
              (isLoadingCreate ? (
                <button
                  type="button"
                  className="btn btn-primary btn-sm fw-bold"
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
                  className="btn btn-primary btn-sm fw-bold"
                  onClick={() => handleCreate()}
                >
                  SAVE CHANGES
                </button>
              ))}

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
          </div>
        </div>

        <div className="table-responsive mt-3" style={{ maxHeight: "500px" }}>
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th
                  className="fw-semibold fs-6 sticky-col sticky-header"
                  style={{ width: "50px" }}
                >
                  NO
                </th>
                <th
                  className="fw-semibold fs-6 sticky-col sticky-header"
                  style={{ width: "50px" }}
                >
                  <input
                    type="checkbox"
                    onChange={handleSelectAllPegawai}
                    checked={
                      selectedPegawai.length === nominalMasterGaji.length
                    }
                  />
                </th>
                <th className="fw-semibold fs-6 sticky-col sticky-header">
                  NAMA
                </th>
                <th
                  className="fw-semibold fs-6 sticky-col sticky-header"
                  style={{ width: "10%" }}
                >
                  PTKP
                </th>
                <th className="fw-semibold fs-6 " style={{ width: "10%" }}>
                  TIPE
                </th>
                {newListKomponenGaji?.map((item, index) => (
                  <th
                    className="fw-semibold sticky-header"
                    style={{ width: "15%", fontSize: "8pt" }}
                    key={index}
                  >
                    {item.komponen?.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {masterGaji?.length === 0 ? (
                <tr>
                  <td colSpan={5 + newListKomponenGaji?.length}>
                    <div className="text-center">Tidak ada data</div>
                  </td>
                </tr>
              ) : (
                nominalMasterGaji?.map((item: Pegawai, index: number) => (
                  <tr key={index}>
                    <td
                      className="sticky-col"
                      align="center"
                      style={{ width: "50px" }}
                    >
                      {index + 1}
                    </td>
                    <td
                      className="sticky-col"
                      align="center"
                      style={{ width: "50px" }}
                    >
                      <input
                        type="checkbox"
                        onChange={() => handleSelectPegawai(item.id)}
                        checked={selectedPegawai.some(
                          (item2: any) => item2.pegawai === item.id
                        )}
                      />
                    </td>
                    <td
                      className="sticky-col"
                      align="left"
                      style={{ whiteSpace: "nowrap", width: "200px" }}
                    >
                      {item.nama.toUpperCase()}
                    </td>
                    <td className="sticky-col" align="center">
                      {item.status_nikah?.toUpperCase()}
                    </td>
                    <td align="center">
                      <select
                        value={item.type_gaji}
                        onChange={(e) => handleType(item.id, e.target.value)}
                      >
                        <option value="">SELECT</option>
                        <option value="fix">FIX</option>
                        <option value="nonfixed">NONFIXED</option>
                      </select>
                    </td>
                    {item.master_gaji_pegawai?.map(
                      (item2: MasterGajiPegawai, index: number) => (
                        <td align="left" key={index}>
                          <NumericFormat
                            defaultValue={item2.nominal}
                            thousandSeparator=","
                            displayType="input"
                            onValueChange={(values: any) => {
                              handleChangeData(
                                item.id,
                                item2.id,
                                values.floatValue
                              );
                            }}
                            onFocus={(e) =>
                              e.target.value === "0" && (e.target.value = "")
                            }
                            onBlur={(e) =>
                              e.target.value === "" && (e.target.value = "0")
                            }
                            onWheel={(e: any) => e.target.blur()}
                          />
                        </td>
                      )
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        .table-responsive {
          overflow-x: auto;
        }
        .sticky-col {
          position: -webkit-sticky;
          position: sticky;
          left: 0;
          background-color: #fff;
          z-index: 10;
        }
        .sticky-header {
          position: -webkit-sticky;
          position: sticky;
          top: 0;
          background-color: #fff;
          z-index: 10;
        }
        .sticky-col:nth-child(4) {
          z-index: 9; /* Adjust z-index for the last sticky column */
        }
      `}</style>
    </>
  );
};

export default Data;
