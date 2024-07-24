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
    marginBottom: 5,
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
  columnTitleInfo: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "left",
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
    marginBottom: 2,
  },
  noBorderTableRow2: {
    fontWeight: "bold",
    marginTop: 10,
    fontSize: 11,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
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
    // fontWeight: "bold",
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

const SlipGajiPdf = ({ gajiPegawai }: { gajiPegawai: GajiPegawai }) => {
  let totalA: number = 0;
  let totalB: number = 0;

  return (
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
            <Text style={styles.detailContent}>
              : {gajiPegawai.pegawai.nama?.toUpperCase()}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>Position</Text>
            <Text style={styles.detailContent}>
              : {gajiPegawai.pegawai.position?.toUpperCase()}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>Month</Text>
            <Text style={styles.detailContent}>
              : {monthNames(gajiPegawai.bulan)}{" "}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailTitle}>Year</Text>
            <Text style={styles.detailContent}>: {gajiPegawai.tahun}</Text>
          </View>
        </View>
        <View style={styles.details}>
          <View style={styles.detailColumn}>
            <Text style={styles.columnTitle}>INCOME</Text>
            {gajiPegawai?.gaji
              .filter((item: Gaji) => item.tipe === "penambahan")
              .map((item: Gaji, index: number) => {
                totalA += Number(item.nominal);

                return (
                  <View key={index} style={styles.noBorderTableRow}>
                    <Text style={styles.noBorderTableCol}>{item.komponen}</Text>
                    <Text>:</Text>
                    <Text style={styles.noBorderTableColWide}>
                      {Number(item.nominal).toLocaleString("id-ID")}
                    </Text>
                  </View>
                );
              })}

            <View style={styles.noBorderTableRow2}>
              <Text style={styles.noBorderTableCol}>INCOME (A)</Text>
              <Text>:</Text>
              <Text style={styles.noBorderTableColWide}>
                {totalA.toLocaleString("id-ID")}
              </Text>
            </View>
          </View>
          <View style={styles.detailColumn}>
            <Text style={styles.columnTitle}>DEDUCTION</Text>
            {gajiPegawai?.gaji
              .filter((item: Gaji) => item.tipe === "pengurangan")
              .map((item: Gaji, index: number) => {
                totalB += Number(item.nominal);

                return (
                  <View key={index} style={styles.noBorderTableRow}>
                    <Text style={styles.noBorderTableCol}>{item.komponen}</Text>
                    <Text>:</Text>
                    <Text style={styles.noBorderTableColWide}>
                      {Number(item.nominal).toLocaleString("id-ID")}
                    </Text>
                  </View>
                );
              })}

            <View style={styles.noBorderTableRow2}>
              <Text style={styles.noBorderTableCol}>DEDUCTION (B)</Text>
              <Text>:</Text>
              <Text style={styles.noBorderTableColWide}>
                {totalB.toLocaleString("id-ID")}
              </Text>
            </View>
            <View style={styles.noBorderTableRow3}>
              <Text style={styles.noBorderTableCol}>TOTAL SALARY (A-B)</Text>
              <Text>:</Text>
              <Text style={styles.noBorderTableColWide}>
                {(totalA - totalB).toLocaleString("id-ID")}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.details}>
          <View style={styles.detailColumn}>
            <Text style={styles.columnTitleInfo}>ADDITIONAL INFO</Text>
            {gajiPegawai?.gaji
              .filter((item: Gaji) => item.tipe === "informasi")
              .map((item: Gaji, index: number) => {
                return (
                  <View key={index} style={styles.noBorderTableRow}>
                    <Text style={styles.noBorderTableCol}>{item.komponen}</Text>
                    <Text>:</Text>
                    <Text style={styles.noBorderTableColWide}>
                      {item.nominal}
                    </Text>
                  </View>
                );
              })}
          </View>
        </View>
      </Page>
    </Document>
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

export default SlipGajiPdf;
