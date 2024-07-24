"use client";

import SlipGajiPdf from "@/libs/SlipGajiPdf";
import dynamic from "next/dynamic";
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
  nominal: string;
  urut: number;
  gaji_pegawai_id: number;
};

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => (
      <button type="button" className="btn btn-success btn-sm mt-3" disabled>
        <span className="spinner-border spinner-border-sm"></span>
      </button>
    ),
  }
);

const Data = ({ gajiPegawai }: { gajiPegawai: GajiPegawai }) => {
  let totalA: number = 0;
  let totalB: number = 0;

  return (
    <>
      <div className="col-lg-8">
        <div className="card shadow-lg border-0 rounded-lg mt-5">
          <div className="card-header justify-content-center text-center">
            <h3 className="fw-semibold my-4">Slip Gaji</h3>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <div className="d-flex justify-content-between fw-semibold">
                <span>Nama:</span>
                <span className="text-end">
                  {gajiPegawai.pegawai.nama?.toUpperCase()}
                </span>
              </div>
              <div className="d-flex justify-content-between fw-semibold mt-2">
                <span>Posisi:</span>
                <span>{gajiPegawai.pegawai.position?.toUpperCase()}</span>
              </div>
              <div className="d-flex justify-content-between fw-semibold mt-2">
                <span>Bulan:</span>
                <span>{monthNames(gajiPegawai.bulan)}</span>
              </div>
              <div className="d-flex justify-content-between fw-semibold mt-2">
                <span>Tahun:</span>
                <span>{gajiPegawai.tahun}</span>
              </div>

              <PDFDownloadLink
                document={<SlipGajiPdf gajiPegawai={gajiPegawai} />}
                fileName={`Slip Gaji ${gajiPegawai.pegawai.nama} (${monthNames(
                  gajiPegawai.bulan
                )} ${gajiPegawai.tahun}).pdf`}
              >
                {({ loading }) =>
                  loading ? (
                    <button
                      type="button"
                      className="btn btn-success btn-sm mt-3"
                      disabled
                    >
                      <span className="spinner-border spinner-border-sm"></span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-success btn-sm mt-3"
                    >
                      Download PDF
                    </button>
                  )
                }
              </PDFDownloadLink>
            </div>
            <hr />
            <div className="mb-3">
              <h5 className="fw-semibold">Income</h5>
              {gajiPegawai?.gaji
                .filter((item: Gaji) => item.tipe === "penambahan")
                .map((item: Gaji, index: number) => {
                  totalA += Number(item.nominal);
                  return (
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
                        {item.komponen}
                      </span>
                      <span style={{ flexShrink: 0 }}>
                        {Number(item.nominal).toLocaleString("id-ID")}
                      </span>
                    </div>
                  );
                })}
              <div
                className="d-flex justify-content-between fw-semibold mt-2"
                style={{ fontSize: "10pt" }}
              >
                <span>Total Income (A)</span>
                <span>{totalA.toLocaleString("id-ID")}</span>
              </div>
            </div>
            {/* <hr className="mt-4 mb-4" /> */}
            <div className="mb-3">
              <h5 className="fw-semibold">Deduction</h5>
              {gajiPegawai?.gaji
                .filter((item: Gaji) => item.tipe === "pengurangan")
                .map((item: Gaji, index: number) => {
                  totalB += Number(item.nominal);
                  return (
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
                        {item.komponen}
                      </span>
                      <span style={{ flexShrink: 0 }}>
                        {Number(item.nominal).toLocaleString("id-ID")}
                      </span>
                    </div>
                  );
                })}
              <div
                className="d-flex justify-content-between fw-semibold mt-2"
                style={{ fontSize: "10pt" }}
              >
                <span>Total Deduction (B)</span>
                <span>{totalB.toLocaleString("id-ID")}</span>
              </div>
            </div>
            <div className="mb-3">
              <div className="d-flex justify-content-between fw-semibold">
                <span>Total Salary</span>
                <span>{(totalA - totalB).toLocaleString("id-ID")}</span>
              </div>
            </div>
            <hr />
            <div className="mb-3">
              <h5 className="fw-semibold">Additional Info</h5>
              {gajiPegawai?.gaji
                .filter((item: Gaji) => item.tipe === "informasi")
                .map((item: Gaji, index: number) => {
                  return (
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
                        {item.komponen}
                      </span>
                      <span style={{ flexShrink: 0 }}>{item.nominal}</span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const monthNames = (month: number) => {
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

  return monthNames[month - 1];
};

export default Data;
