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
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Image src="assets/img/iso.png" style={{ width: 150 }} />
      </View>
      <View style={styles.title}>
        <Image src="assets/img/panji.png" style={{ width: 110 }} />
        <Text style={{ marginBottom: -5, marginTop: -2 }}>PT. PANJI JAYA</Text>
      </View>
      <View style={styles.section}>
        <Text>Name: {exampleData.name}</Text>
        <Text>Position: {exampleData.position}</Text>
        <Text>Month: {exampleData.month}</Text>
        <Text>Year: {exampleData.year}</Text>
      </View>
      <View style={styles.section}>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.bold}>INCOME</Text>
            <Text style={styles.bold}>DEDUCTION</Text>
          </View>
          {exampleData.income.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text>{item.component}</Text>
              <Text style={styles.tableCell}>
                {item.amount.toLocaleString()}
              </Text>
            </View>
          ))}
          {exampleData.deduction.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text>{item.component}</Text>
              <Text style={styles.tableCell}>
                {item.amount.toLocaleString()}
              </Text>
            </View>
          ))}
          <View style={styles.tableRow}>
            <Text style={styles.bold}>
              TOTAL INCOME (A): {totalIncome.toLocaleString()}
            </Text>
            <Text style={styles.bold}>
              TOTAL DEDUCTION (B): {totalDeduction.toLocaleString()}
            </Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.bold}>
              TOTAL SALARY (A-B): {totalSalary.toLocaleString()}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.section}>
        <View style={styles.table}>
          {exampleData.ul.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text>{item.component}</Text>
              <Text style={styles.tableCell}>
                {item.amount.toLocaleString()}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </Page>
  </Document>
);

export default MyDocument;
