"use client";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import ModalFilter from "./modalFilter";

type Absensi = {
  id: string | number;
  pegawaiId: number;
  nama: string;
  tanggal: string;
  absenMasuk: string;
  absenPulang: string;
  late: number;
  early: number;
};

type Department = {
  id: number;
  nama_department: string;
  lot: string;
  latitude: string;
  longitude: string;
  radius: string;
};

interface isLoadingProps {
  [key: number]: boolean;
}

const AttendanceData = ({
  accessToken,
  departments,
}: {
  accessToken: string;
  departments: Department[];
}) => {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  currentDate.setHours(currentDate.getHours() + 7);

  // modal state
  const [isModalFilterOpen, setIsModalFilterOpen] = useState(false);

  // filter
  const [filter, setFilter] = useState<any>({
    filter: false,
    department: departments[0].id.toString(),
    tanngalAbsen: currentDate,
  });

  const closeModal = () => {
    setIsModalFilterOpen(false);
    mutate(process.env.NEXT_PUBLIC_API_URL + "/api/web/humanresource/absensi");
  };

  const handleFilter = async () => {
    setIsModalFilterOpen(true);
  };

  const handleFilterData = (department: any, tanggalAbsen: Date) => {
    setIsModalFilterOpen(false);
    setFilter({
      filter: true,
      department: department,
      tanngalAbsen: tanggalAbsen,
    });
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
    process.env.NEXT_PUBLIC_API_URL +
      "/api/web/humanresource/absensi?filter=" +
      JSON.stringify(filter),
    fetcher
  );

  if (isLoading) {
    return (
      <div className="card-body">
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
      <div className="card-body text-center">
        something went wrong, please refresh the page
      </div>
    );
  }

  const attendance = data?.data;

  return (
    <>
      <div className="card-body">
        <div className="row">
          <div className="col-sm-12">
            <button
              type="button"
              className="btn btn-dark btn-sm fw-bold "
              onClick={() => handleFilter()}
            >
              Filter Data
            </button>
            {filter.filter && (
              <button
                type="button"
                className="btn btn-outline-dark btn-sm fw-bold ms-1"
                onClick={() =>
                  setFilter({
                    filter: false,
                    department: departments[0].id.toString(),
                    tanngalAbsen: currentDate,
                  })
                }
              >
                Reset
              </button>
            )}
          </div>
        </div>

        <div className="table-responsive mt-3">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th className="fw-semibold fs-6" style={{ width: "1%" }}>
                  No
                </th>
                <th className="fw-semibold fs-6">Nama</th>
                <th className="fw-semibold fs-6" style={{ width: "20%" }}>
                  Tanggal
                </th>
                <th className="fw-semibold fs-6" style={{ width: "10%" }}>
                  Absen Masuk
                </th>
                <th className="fw-semibold fs-6" style={{ width: "10%" }}>
                  Absen Pulang
                </th>
                <th className="fw-semibold fs-6" style={{ width: "1%" }}>
                  Terlambat
                </th>
              </tr>
            </thead>
            <tbody>
              {attendance?.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="text-center">Tidak ada data</div>
                  </td>
                </tr>
              ) : (
                attendance?.map((item: Absensi, index: number) => (
                  <tr
                    key={index}
                    style={item.id ? {} : { backgroundColor: "yellow" }}
                  >
                    <td align="center">{index + 1}</td>
                    <td align="left">{item.nama}</td>
                    <td align="center">{item.tanggal}</td>
                    <td align="center">{item.absenMasuk}</td>
                    <td align="center">{item.absenPulang}</td>
                    <td align="center">{item.late}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* modal filter */}
      {isModalFilterOpen && (
        <ModalFilter
          isModalOpen={isModalFilterOpen}
          onClose={closeModal}
          dataDepartment={departments}
          onFilter={handleFilterData}
          filterData={filter}
        />
      )}
    </>
  );
};
export default AttendanceData;
