"use client";

import React, { ReactElement } from "react";
import dynamic from "next/dynamic";
import MyDocument from "./document";

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  }
);

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  }
);

export default function Preview(): ReactElement {
  return (
    <body>
      <div
        style={{
          height: "100vh",
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <PDFViewer
          style={{ height: "100%", width: "100%" }}
          showToolbar={false}
        >
          <MyDocument />
        </PDFViewer>
        <div style={{ marginTop: 20 }}>
          <PDFDownloadLink
            document={<MyDocument />}
            fileName="document.pdf"
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "#fff",
              textDecoration: "none",
              borderRadius: "4px",
            }}
          >
            {({ blob, url, loading, error }) =>
              loading ? "Loading document..." : "Download PDF"
            }
          </PDFDownloadLink>
        </div>
      </div>
    </body>
  );
}
