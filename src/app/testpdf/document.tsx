import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// Example Data
const exampleData = {
  name: "John Doe",
  position: "Software Engineer",
  month: "May",
  year: "2024",
  income: [
    { component: "Base Salary", amount: 5000 },
    { component: "Bonus", amount: 1000 },
  ],
  deduction: [
    { component: "Tax", amount: 500 },
    { component: "Insurance", amount: 200 },
  ],
  ul: [{ component: "Other", amount: 100 }],
};

const totalIncome = exampleData.income.reduce(
  (sum, item) => sum + item.amount,
  0
);
const totalDeduction = exampleData.deduction.reduce(
  (sum, item) => sum + item.amount,
  0
);
const totalSalary = totalIncome - totalDeduction;

const styles = StyleSheet.create({
  page: {
    padding: 10,
    fontSize: 10,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    marginTop: -100,
    textAlign: "center",
  },
  table: {
    width: "100%",
    marginVertical: 10,
  },
  tableRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottom: "1px solid #000",
    paddingVertical: 5,
  },
  tableCell: {
    width: "33%",
    textAlign: "right",
  },
  bold: {
    fontWeight: "bold",
  },
});

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

export default MyDocument;
