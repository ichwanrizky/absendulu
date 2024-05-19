"use client";

import { pegawai } from "@prisma/client";
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

  const handleCreate = async () => {
    if (confirm("Save this data?")) {
      setIsLoadingCreate(true);
      try {
        const body = new FormData();
        body.append("selected_pegawai", JSON.stringify(selectedPegawai));
        body.append("data_master_gaji", JSON.stringify(nominalMasterGaji));

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
          mutate(
            `${process.env.NEXT_PUBLIC_API_URL}/api/web/mastergaji?menu_url=${menu_url}`
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
    `${process.env.NEXT_PUBLIC_API_URL}/api/web/mastergaji?menu_url=${menu_url}`,
    fetcher
  );
  useEffect(() => {
    if (data?.data) {
      setNominalMasterGaji(
        data?.data.map((item: Pegawai) => ({
          id: item.id,
          nama: item.nama,
          status_nikah: item.status_nikah,
          master_gaji_pegawai:
            item.master_gaji_pegawai.length > 0
              ? item.master_gaji_pegawai.map((item2: MasterGajiPegawai) => ({
                  komponen_id: item2.id,
                  nominal: item2.nominal,
                }))
              : newListKomponenGaji.map((item2: KomponenGaji) => ({
                  komponen_id: item2.id,
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
          </div>
        </div>

        <div className="table-responsive mt-3" style={{ maxHeight: "500px" }}>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th
                  className="fw-semibold fs-6 sticky-col"
                  style={{ width: "1px" }}
                >
                  NO
                </th>
                <th
                  className="fw-semibold fs-6 sticky-col"
                  style={{ width: "1px" }}
                >
                  <input type="checkbox" />
                </th>
                <th className="fw-semibold fs-6 sticky-col">NAMA</th>
                <th className="fw-semibold fs-6" style={{ width: "10%" }}>
                  PTKP
                </th>
                {newListKomponenGaji?.map((item, index) => (
                  <th
                    className="fw-semibold"
                    style={{ width: "15%", fontSize: "8pt" }}
                    key={index}
                  >
                    {item.komponen?.toUpperCase()}
                  </th>
                ))}
                <th className="fw-semibold fs-6" style={{ width: "10%" }}>
                  ACTION
                </th>
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
                nominalMasterGaji?.map((item: Pegawai, index: number) => {
                  return (
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
                        />
                      </td>
                      <td
                        className="sticky-col"
                        align="left"
                        style={{ whiteSpace: "nowrap", width: "200px" }}
                      >
                        {item.nama.toUpperCase()}
                      </td>
                      <td align="center">{item.status_nikah.toUpperCase()}</td>
                      {item.master_gaji_pegawai?.map(
                        (item2: MasterGajiPegawai, index: number) => (
                          <td align="left" key={index}>
                            <input
                              type="number"
                              onChange={(e) => {
                                handleChangeData(
                                  item.id,
                                  item2.id,
                                  Number(e.target.value)
                                );
                              }}
                              value={item2.nominal}
                            />
                          </td>
                        )
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Data;
