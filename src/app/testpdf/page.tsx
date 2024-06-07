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

export default function Preview(): ReactElement {
  return (
    <body className="h-full w-full">
      <PDFViewer className="h-full w-full" showToolbar={false}>
        <MyDocument />
      </PDFViewer>
    </body>
  );
}
