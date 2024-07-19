"use client";

import React, { ReactElement } from "react";
import dynamic from "next/dynamic";
import {
  Document,
  Page,
  View,
  Image,
  Text,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

Font.register({
  family: "OpenSans",
  fonts: [
    { src: "/fonts/OpenSans-Regular.ttf", fontWeight: "normal" },
    {
      src: "/fonts/OpenSans-SemiBold.ttf",
      fontWeight: "semibold",
    },
  ],
});

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  }
);

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingLeft: 40,
    paddingRight: 40,
    paddingBottom: 40,
    fontFamily: "OpenSans",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
    paddingBottom: 10,
    marginBottom: 20,
  },
  logoTitleContainer: {
    marginLeft: 125,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flexGrow: 1,
  },
  logo: {
    width: 100,
    height: "auto",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  certificatesContainer: {
    display: "flex",
    flexDirection: "row",
  },
  certificates: {
    width: 60,
    height: "auto",
    marginLeft: 10,
  },
  detailRow: {
    fontSize: 12,
    display: "flex",
    flexDirection: "row",
    marginBottom: 5,
  },
  detailTitle: {
    width: 100,
    fontWeight: "bold",
  },
  detailContent: {
    flex: 1,
  },
  detailsSection: {
    marginBottom: 20,
  },
  horizontalLine: {
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    borderBottomStyle: "solid",
  },
  details: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailColumn: {
    width: "48%",
  },
  columnTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  detailRow2: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  boldText: {
    fontWeight: "bold",
  },
  noBorderTable: {
    width: "100%",
  },
  noBorderTableRow: {
    fontSize: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  noBorderTableRow2: {
    fontWeight: "bold",
    marginTop: 10,
    fontSize: 11,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  noBorderTableRow3: {
    fontSize: 11,
    fontWeight: "bold",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  noBorderTableCol: {
    fontWeight: "bold",
    width: "110%",
    textAlign: "left",
  },
  noBorderTableColWide: {
    width: "45%",
    textAlign: "right",
  },
  typeSalary: {
    fontSize: 12,
    fontWeight: "bold",
  },
});

const MyDocument = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View style={styles.logoTitleContainer}>
          <Image src="/img/panji.png" style={styles.logo} />
          <Text style={styles.title}>PT. PANJI JAYA</Text>
        </View>
        <View style={styles.certificatesContainer}>
          <Image src="/img/iso_9001.jpg" style={styles.certificates} />
          <Image src="/img/iso_14001.jpg" style={styles.certificates} />
        </View>
      </View>
      <View style={styles.detailsSection}>
        <View style={styles.detailRow}>
          <Text style={styles.detailTitle}>Name</Text>
          <Text style={styles.detailContent}>: Sri Rahayu</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailTitle}>Position</Text>
          <Text style={styles.detailContent}>: Leader</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailTitle}>Month</Text>
          <Text style={styles.detailContent}>: April</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailTitle}>Year</Text>
          <Text style={styles.detailContent}>: 2024</Text>
        </View>
      </View>
      <View style={styles.details}>
        <View style={styles.detailColumn}>
          <Text style={styles.columnTitle}>INCOME</Text>
          {[
            ["Absent", "-"],
            ["Unpaid Leave", "-"],
            ["Unpaid Leave Home", "-"],
            ["Permission", "-"],
            ["Late", "-"],
            ["JHT (2%)", "92.009"],
            ["JP (1%)", "46.004"],
            ["BPJS Kesehatan (1%)", "46.851"],
            ["Adjustment Min", "-"],
            ["PPH 21", "-"],
          ].map(([title, content], idx) => (
            <View key={idx} style={styles.noBorderTableRow}>
              <Text style={styles.noBorderTableCol}>{title}</Text>
              <Text>:</Text>
              <Text style={styles.noBorderTableColWide}>{content}</Text>
            </View>
          ))}

          <View style={styles.noBorderTableRow2}>
            <Text style={styles.noBorderTableCol}>INCOME (A)</Text>
            <Text>:</Text>
            <Text style={styles.noBorderTableColWide}>awdawd</Text>
          </View>
        </View>
        <View style={styles.detailColumn}>
          <Text style={styles.columnTitle}>DEDUCTION</Text>
          {[
            ["Absent", "-"],
            ["Unpaid Leave", "-"],
            ["Unpaid Leave Home", "-"],
            ["Permission", "-"],
            ["Late", "-"],
            ["JHT (2%)", "92.009"],
            ["JP (1%)", "46.004"],
            ["BPJS Kesehatan (1%)", "46.851"],
            ["Adjustment Min", "-"],
            ["PPH 21", "-"],
          ].map(([title, content], idx) => (
            <View key={idx} style={styles.noBorderTableRow}>
              <Text style={styles.noBorderTableCol}>{title}</Text>
              <Text>:</Text>
              <Text style={styles.noBorderTableColWide}>{content}</Text>
            </View>
          ))}
          <View style={styles.noBorderTableRow2}>
            <Text style={styles.noBorderTableCol}>DEDUCTION (B)</Text>
            <Text>:</Text>
            <Text style={styles.noBorderTableColWide}>awdawd</Text>
          </View>
          <View style={styles.noBorderTableRow3}>
            <Text style={styles.noBorderTableCol}>TOTAL SALARY (A-B)</Text>
            <Text>:</Text>
            <Text style={styles.noBorderTableColWide}>awdawd</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

export default function Preview({ params }: any): ReactElement {
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
