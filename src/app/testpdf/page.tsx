"use client";

import React, { ReactElement } from "react";
import dynamic from "next/dynamic";
import {
  PDFViewer,
  Document,
  Page,
  Text,
  View,
  Image,
  Font,
} from "@react-pdf/renderer";

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

const MyDocument = () => (
  <Document>
    <Page
      size="A4"
      style={{
        paddingLeft: "15mm",
        paddingRight: "15mm",
        marginTop: "10mm",
      }}
    >
      <View style={{ marginBottom: 85 }}></View>
    </Page>
  </Document>
);

export default function Preview(): ReactElement {
  return (
    <body>
      <main
        style={{
          display: "flex",
          minHeight: "100vh",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
          padding: "1rem",
        }}
      >
        <PDFViewer width="100%" height="600">
          <MyDocument />
        </PDFViewer>
      </main>
    </body>
  );
}
