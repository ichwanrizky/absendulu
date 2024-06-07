import React from "react";

type GajiPegawai = {
  tahun: number;
  bulan: number;
  pegawai: {
    id: number;
    nama: string;
    status_nikah: string;
    position: string;
  };
  department: {
    nama_department: string;
  };
  gaji: Gaji[];
};

type Gaji = {
  id: number;
  bulan: number;
  tahun: number;
  pegawai_id: number;
  tipe: string;
  komponen: string;
  komponen_id: number;
  nominal: number;
  urut: number;
  gaji_pegawai_id: number;
};

const Data = ({ gajiPegawai }: { gajiPegawai: GajiPegawai }) => {
  const totalA: number = 0;
  const totalB: number = 0;
  return (
    <div className="col-lg-8">
      <div className="card shadow-lg border-0 rounded-lg mt-5">
        <div className="card-header justify-content-center text-center">
          <h3 className="fw-semibold my-4">SLIP</h3>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <div className="d-flex justify-content-between">
              <span>Nama:</span>
              <span>{gajiPegawai.pegawai.nama?.toUpperCase()}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>Posisi:</span>
              <span>{gajiPegawai.pegawai.position?.toUpperCase()}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>Bulan:</span>
              <span>{gajiPegawai.bulan}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>Tahun:</span>
              <span>{gajiPegawai.tahun}</span>
            </div>
          </div>
          <hr />
          <div className="mb-3">
            <h5 className="fw-semibold">Income</h5>
            {gajiPegawai?.gaji
              .filter((item: Gaji) => item.tipe === "penambahan")
              .map((item: Gaji, index: number) => (
                <div
                  className="d-flex justify-content-between"
                  style={{
                    fontSize: "10pt",
                    borderBottom: "1px solid #ccc",
                    padding: "5px 0",
                    wordWrap: "break-word",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                  key={index}
                >
                  <span
                    style={{
                      flex: 1,
                      marginRight: "70px",
                      wordBreak: "break-word",
                    }}
                  >
                    {toUpperCaseEachWord(item.komponen?.toLowerCase())}
                  </span>
                  <span style={{ flexShrink: 0 }}>
                    {item.nominal.toLocaleString()}
                  </span>
                </div>
              ))}
            <div className="d-flex justify-content-between fw-semibold mt-2">
              <span>Total Income (A)</span>
              <span>{totalA.toLocaleString()}</span>
            </div>
          </div>
          <hr />
          <div className="mb-3">
            <h5 className="fw-semibold">Deduction</h5>
            {gajiPegawai?.gaji
              .filter((item: Gaji) => item.tipe === "pengurangan")
              .map((item: Gaji, index: number) => (
                <div
                  className="d-flex justify-content-between"
                  style={{
                    fontSize: "10pt",
                    borderBottom: "1px solid #ccc",
                    padding: "5px 0",
                    wordWrap: "break-word",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                  key={index}
                >
                  <span
                    style={{
                      flex: 1,
                      marginRight: "70px",
                      wordBreak: "break-word",
                    }}
                  >
                    {toUpperCaseEachWord(item.komponen?.toLowerCase())}
                  </span>
                  <span style={{ flexShrink: 0 }}>
                    {item.nominal.toLocaleString()}
                  </span>
                </div>
              ))}
            <div className="d-flex justify-content-between fw-semibold mt-2">
              <span>Total Deduction (B)</span>
              <span>{totalB.toLocaleString()}</span>
            </div>
          </div>
          <hr />
          <div className="mb-3">
            <div className="d-flex justify-content-between fw-semibold">
              <span>Total Salary (A-B)</span>
              <span>{(totalA - totalB).toLocaleString()}</span>
            </div>
          </div>
          <hr />
          <div className="mb-3">
            <h5 className="fw-semibold">Additional Info</h5>
            {/* {employee.ul.map((item, index) => (
              <div key={index} className="d-flex justify-content-between">
                <span>{item.component}</span>
                <span>{item.amount.toLocaleString()}</span>
              </div>
            ))} */}
          </div>
        </div>
      </div>
    </div>
  );
};

const toUpperCaseEachWord = (str: string) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

export default Data;
