"use client";

import React, { ReactElement } from "react";
import dynamic from "next/dynamic";
import { Document, Page, View } from "@react-pdf/renderer";

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
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
    <html style={{ height: "100%", width: "100%", margin: 0, padding: 0 }}>
      <head>
        <style>{`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          html, body, #__next {
            height: 100%;
            width: 100%;
          }
          body {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          main {
            display: flex;
            height: 100%;
            width: 100%;
            flex-direction: column;
            align-items: center;
          }
          .pdf-viewer-container {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        `}</style>
      </head>
      <body>
        <main>
          <div className="pdf-viewer-container">
            <PDFViewer style={{ width: "100%", height: "100%" }}>
              <MyDocument />
            </PDFViewer>
          </div>
        </main>
      </body>
    </html>
  );
}
