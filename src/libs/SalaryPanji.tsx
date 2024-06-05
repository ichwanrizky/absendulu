import prisma from "@/libs/db";
import newPph from "./NewPph";

type ReportData = {
  pegawai_id: number;
  nama: string;
  status_nikah: string;
  department_id: number;
  nama_department: string;
  sub_department_id: number;
  nama_sub_department: string;
  type_gaji: string;
  workdate_count: number;
  attend_count: number;
  attend_weekend_count: number;
  notattend_count: number;
  late_count: number;
  cuti_count: number;
  cuti_s_count: number;
  izin_count: number;
  izin_s_count: number;
  sakit_count: number;
  g1_count: number;
  g2_count: number;
  g3_count: number;
  pm_count: number;
  overtime: number;
  overtime_total: number;
};

const SalaryPanji = async (bulan: number, tahun: number, parsePegawai: any) => {
  const listDates = getDatesInMonth(Number(tahun), Number(bulan) - 1);

  const listTanggalMerah = await prisma.tanggal_merah_list.findMany({
    select: {
      tanggal: true,
    },
    where: {
      tanggal_merah: {
        department_id: 1,
        bulan: Number(bulan),
        tahun: Number(tahun),
      },
    },
    orderBy: {
      tanggal: "asc",
    },
  });

  const tanggalMerah = listTanggalMerah.map(
    (item: any) => item.tanggal.toISOString().split("T")[0]
  );

  const tanggalKerja = listDates.filter(
    (item: any) => !tanggalMerah.includes(item)
  );

  const tanggalKerjaQuery = listDates
    .map((date) => `SELECT '${date}' as tanggal`)
    .join(" UNION ");

  const pegawaiValues = parsePegawai.map((item: any) => item.value).join(",");

  const dataQuery = `
    SELECT
      p.id,
      p.nama,
      p.status_nikah,
      p.department_id,
      dp.nama_department,
      p.sub_department_id,
      sd.nama_sub_department,
      p.type_gaji,
      d.tanggal,
      tml.tanggal as tanggal_libur,
      a.tanggal AS tanggal_absen,
      a.absen_masuk,
      a.absen_pulang,
      a.late,
      i.tanggal AS tanggal_izin,
      i.jenis_izin,
      i.jumlah_hari,
      i.jumlah_jam,
      ot.tanggal AS tanggal_ot,
      ot.jam AS jam_ot,
      ot.total AS total_ot 
    FROM
      pegawai p
      CROSS JOIN (${tanggalKerjaQuery}) d
      LEFT JOIN absen a ON p.id = a.pegawai_id 
      AND d.tanggal = a.tanggal
      LEFT JOIN izin i ON p.id = i.pegawai_id 
      AND d.tanggal = i.tanggal 
      JOIN department dp ON p.department_id = dp.id
      JOIN sub_department sd ON p.sub_department_id = sd.id
      LEFT JOIN tanggal_merah tm ON dp.id = tm.department_id AND tm.bulan = ${bulan} AND tm.tahun = ${tahun}
      LEFT JOIN tanggal_merah_list tml ON tm.id = tml.tanggal_merah_id AND tml.tanggal = d.tanggal
      LEFT JOIN (
        SELECT
            pegawai_id,
            tanggal,
            jam,
            total,
            ROW_NUMBER() OVER (PARTITION BY pegawai_id, tanggal ORDER BY tanggal) AS rn
        FROM
            overtime
    ) ot ON ot.pegawai_id = p.id AND ot.tanggal = d.tanggal AND ot.rn = 1
    WHERE
      p.id IN (${pegawaiValues})
    ORDER BY
      p.nama,
      d.tanggal
  `;
  // console.log(
  //   dataQuery.replace(/'/g, '"').replace(/\n/g, "").replace(/\s+/g, " ").trim()
  // );

  const data = (await prisma.$queryRawUnsafe(dataQuery)) as any;

  let reportData: any = [];

  let pegawaiId = 0;
  let totalAttend: any = 0;
  let totalNotAttend: any = 0;
  let totalAttendWeekend: any = 0;
  let totalLate: any = 0;
  let totalC: any = 0;
  let totalCS: any = 0;
  let totalI: any = 0;
  let totalIS: any = 0;
  let totalS: any = 0;
  let totalG1: any = 0;
  let totalG2: any = 0;
  let totalG3: any = 0;
  let totalPM: any = 0;

  let overtime: number = 0;
  let overtimeTotal: number = 0;

  data?.map((item: any) => {
    if (item.id !== pegawaiId) {
      pegawaiId = item.id;
      totalAttend = 0;
      totalAttendWeekend = 0;
      totalNotAttend = 0;
      totalLate = 0;
      totalC = 0;
      totalCS = 0;
      totalI = 0;
      totalIS = 0;
      totalS = 0;
      totalG1 = 0;
      totalG2 = 0;
      totalG3 = 0;
      totalPM = 0;
      overtime = 0;
      overtimeTotal = 0;

      reportData.push({
        pegawai_id: item.id,
        nama: item.nama,
        status_nikah: item.status_nikah,
        department_id: item.department_id,
        nama_department: item.nama_department,
        sub_department_id: item.sub_department_id,
        nama_sub_department: item.nama_sub_department,
        type_gaji: item.type_gaji,
        workdate_count: tanggalKerja.length,
        attend_count: totalAttend,
        attend_weekend_count: totalAttendWeekend,
        notattend_count: totalNotAttend,
        late_count: totalLate,
        cuti_count: totalC,
        cuti_s_count: totalCS,
        izin_count: totalI,
        izin_s_count: totalIS,
        sakit_count: totalS,
        g1_count: totalG1,
        g2_count: totalG2,
        g3_count: totalG3,
        pm_count: totalPM,
        overtime: overtime,
        overtime_total: overtimeTotal,
      });
    }

    if (pegawaiId === item.id) {
      // COUNT LATE
      if (
        item.tanggal_libur === null &&
        item.tanggal_absen !== null &&
        item.late !== 0
      ) {
        if (item.jenis_izin !== null) {
          ["G2", "CS", "IS"].includes(item.jenis_izin)
            ? (totalLate += 0)
            : (totalLate += item.late);
        } else {
          totalLate += item.late;
        }
      }

      // COUNT IZIN / CUTI
      if (item.jenis_izin === "C") {
        totalC += 1;
      } else if (item.jenis_izin === "CS") {
        totalCS += 1;
      } else if (item.jenis_izin === "I") {
        totalI += 1;
      } else if (item.jenis_izin === "IS") {
        totalIS += 1;
      } else if (item.jenis_izin === "S") {
        totalS += 1;
      } else if (item.jenis_izin === "G1") {
        totalG1 += item.jumlah_jam !== null && jumlahJam(item.jumlah_jam);
      } else if (item.jenis_izin === "G2") {
        if (item.jumlah_jam !== null) {
          if (Number(jumlahJam(item.jumlah_jam)) > Number(item.late)) {
            totalG2 += jumlahJam(item.jumlah_jam);
          } else {
            totalG2 += item.late;
          }
        }
      } else if (item.jenis_izin === "G3") {
        totalG3 += item.jumlah_jam !== null && jumlahJam(item.jumlah_jam);
      } else if (item.jenis_izin === "P/M") {
        totalPM += 1;
      }

      // COUNT ATTEND WEEKDAY
      if (
        item.tanggal_absen &&
        !item.tanggal_libur &&
        item.jenis_izin !== "C" &&
        item.jenis_izin !== "I" &&
        item.jenis_izin !== "S"
      ) {
        totalAttend += 1;
      }

      // COUNT ATTEND HOLIDAY
      if (item.tanggal_absen && item.tanggal_libur) {
        totalAttendWeekend += 1;
      }

      // LUPA ABSEN
      if (!item.tanggal_absen && item.jenis_izin === "P/M") {
        totalAttend += 1;
      }

      // ABSENT
      if (!item.tanggal_absen && !item.tanggal_izin && !item.tanggal_libur) {
        totalNotAttend += 1;
      }

      // OVERTIME
      if (item.tanggal_ot) {
        overtime += Number(item.jam_ot);
        overtimeTotal += Number(item.total_ot);
      }

      reportData[reportData.length - 1].late_count = totalLate;
      reportData[reportData.length - 1].cuti_count = totalC;
      reportData[reportData.length - 1].cuti_s_count = totalCS;
      reportData[reportData.length - 1].izin_count = totalI;
      reportData[reportData.length - 1].izin_s_count = totalIS;
      reportData[reportData.length - 1].sakit_count = totalS;
      reportData[reportData.length - 1].g1_count = totalG1;
      reportData[reportData.length - 1].g2_count = totalG2;
      reportData[reportData.length - 1].g3_count = totalG3;
      reportData[reportData.length - 1].pm_count = totalPM;
      reportData[reportData.length - 1].attend_count = totalAttend;
      reportData[reportData.length - 1].notattend_count = totalNotAttend;
      reportData[reportData.length - 1].attend_weekend_count =
        totalAttendWeekend;

      reportData[reportData.length - 1].overtime = overtime;
      reportData[reportData.length - 1].overtime_total = overtimeTotal;
    }
  });

  let gajiData: any = [];

  for (const item of (reportData as ReportData[]) || []) {
    const masterGaji = await prisma.komponen_gaji.findMany({
      include: {
        master_gaji_pegawai: {
          select: {
            nominal: true,
          },
          where: {
            pegawai_id: item.pegawai_id,
          },
        },
      },
      where: {
        department_id: 1,
      },
      orderBy: {
        urut_tampil: "asc",
      },
    });

    let basic_salary: number = 0;
    let komponen_fix: number = 0;
    let basic_fix: number = 0;

    let bpjs_kes: number = 0;
    let bpjs_tk: number = 0;

    // FOR NEW PPH
    let ter: string = "";
    switch (item.status_nikah) {
      case "TK":
      case "K0":
      case "TK/0":
      case "TK/1":
        ter = "TER_A";
        break;
      case "K1":
      case "K2":
      case "TK/2":
      case "TK/3":
        ter = "TER_B";
        break;
      case "K3":
        ter = "TER_C";
        break;
      default:
        ter = ""; // or handle the default case as needed
        break;
    }

    // ADJUSTMENT PLUS // id.id = 8
    const adjustment_plus = await prisma.adjustment.aggregate({
      _sum: {
        nominal: true,
      },
      where: {
        bulan: bulan,
        tahun: tahun,
        pegawai_id: item.pegawai_id,
        jenis: "penambahan",
      },
    });
    const nominalAdjustmentPlus = adjustment_plus._sum.nominal || 0;

    // ADJUSTMENT PLUS // i.id = 17
    const adjustment_minus = await prisma.adjustment.aggregate({
      _sum: {
        nominal: true,
      },
      where: {
        bulan: bulan,
        tahun: tahun,
        pegawai_id: item.pegawai_id,
        jenis: "pengurangan",
      },
    });
    const nominalAdjustmentMinus = adjustment_minus._sum.nominal || 0;

    masterGaji.map((i: any) => {
      let nominal: number = 0;

      // BPJS KES
      if (i.id === 26) {
        bpjs_kes += i.master_gaji_pegawai[0].nominal;
      }

      // BPJS TK
      if (i.id === 27) {
        bpjs_tk += i.master_gaji_pegawai[0].nominal;
      }

      // basic only
      if (i.id === 1) {
        basic_salary += i.master_gaji_pegawai[0].nominal;
      }

      // komponen fix only
      if (i.id === 2) {
        komponen_fix += i.master_gaji_pegawai[0].nominal;
      }

      // basic fix
      if (i.id === 1 || i.id === 2) {
        basic_fix += i.master_gaji_pegawai[0].nominal;
      }

      // FIX DLL
      if (i.metode === "tetap" && i.is_master) {
        nominal = i.master_gaji_pegawai[0].nominal;
      }

      // MEAL / TRANSPORT / SHIFT
      if (i.id === 3 || i.id === 4 || i.id === 5) {
        if (item.type_gaji === "nonfixed") {
          nominal =
            i.master_gaji_pegawai[0].nominal *
            (item.attend_count + item.attend_weekend_count);
        } else {
          nominal = i.master_gaji_pegawai[0].nominal;
        }
      }

      // ATTENDANCE ALLOWANCE
      if (i.id === 28) {
        if (
          item.late_count === 0 &&
          item.cuti_count === 0 &&
          item.cuti_s_count === 0 &&
          item.izin_count === 0 &&
          item.izin_s_count === 0 &&
          item.sakit_count === 0 &&
          item.notattend_count === 0
        ) {
          nominal = i.master_gaji_pegawai[0].nominal;
        }
      }

      // OVERTIME
      if (i.id === 7 || i.id === 19) {
        if (i.tipe === "informasi") nominal = item.overtime;
        else if (i.tipe === "penambahan")
          nominal = Math.round((basic_salary / 173) * item.overtime_total);
      }

      // ABSENT
      if ((i.id === 20 || i.id === 9) && item.type_gaji === "nonfixed") {
        if (i.tipe === "informasi") nominal = item.notattend_count;
        else if (i.tipe === "pengurangan")
          nominal = Math.round((basic_fix / 22) * item.notattend_count);
      }

      // UL
      if ((i.id === 21 || i.id === 10) && item.type_gaji === "nonfixed") {
        if (i.tipe === "informasi")
          nominal = item.izin_count + item.izin_s_count;
        else if (i.tipe === "pengurangan")
          nominal = Math.round(
            (basic_fix / 22) * (item.izin_count + item.izin_s_count)
          );
      }

      // CUTI
      if (i.id === 11) {
        if (i.tipe === "informasi")
          nominal = item.cuti_count + item.cuti_s_count;
      }

      // SAKIT
      if (i.id === 25) {
        if (i.tipe === "informasi") nominal = item.sakit_count;
      }

      // LATE
      if ((i.id === 24 || i.id === 29) && item.type_gaji === "nonfixed") {
        if (i.tipe === "informasi") nominal = item.late_count;
        else if (i.tipe === "pengurangan")
          nominal = Math.round(
            (basic_salary / 22 / 8 / 60) * item.late_count +
              (komponen_fix / 22 / 8 / 60) * item.late_count
          );
      }

      // GATEPASS
      if ((i.id === 23 || i.id === 12) && item.type_gaji === "nonfixed") {
        if (i.tipe === "informasi")
          nominal = item.g1_count + item.g2_count + item.g3_count;
        else if (i.tipe === "pengurangan")
          nominal = Math.round(
            (basic_salary / 22 / 8) *
              (item.g1_count + item.g2_count + item.g3_count) +
              (komponen_fix / 22 / 8) *
                (item.g1_count + item.g2_count + item.g3_count)
          );
      }

      // BPJS KES & JP (1%)
      if (i.id === 16 || i.id === 15) {
        // BPJSKES PAK EDI

        if (item.pegawai_id === 70) {
          if (bpjs_kes > 8000000) nominal = Math.round(8000000 * 0.02);
          else nominal = Math.round(bpjs_kes * 0.02);
        } else {
          if (bpjs_kes > 8000000) nominal = Math.round(8000000 * 0.01);
          else nominal = Math.round(bpjs_kes * 0.01);
        }
      }

      // JHT (2%)
      if (i.id === 14) {
        nominal = Math.round(bpjs_kes * 0.02);
      }

      //   JUMLAH HARI KERJA
      if (i.id === 18) {
        nominal = item.attend_count + item.attend_weekend_count;
      }

      // ADJUSTMENT PLUS
      if (i.id === 8) {
        nominal = nominalAdjustmentPlus;
      }

      // ADJUSTMENT MINUS
      if (i.id === 17) {
        nominal = nominalAdjustmentMinus;
      }

      if (i.id !== 26 && i.id !== 27) {
        gajiData.push({
          pegawai_id: item.pegawai_id,
          nama: item.nama,
          status_nikah: item.status_nikah,
          department_id: item.department_id,
          tipe: i.tipe,
          komponen_id: i.id,
          komponen_name: i.komponen,
          nominal: nominal,
        });
      }
    });

    const gajiBruto = gajiData
      .filter((i: any) => i.tipe === "penambahan")
      .reduce((acc: any, item: any) => acc + item.nominal, 0);

    // new pph21
    const nominalPph21 = Math.round(newPph(ter, gajiBruto));
    if (nominalPph21 > 0) {
      gajiData = gajiData.map((i: any) => {
        if (i.komponen_id === 13) {
          return { ...i, nominal: nominalPph21 };
        }
        return i;
      });
    }
  }

  return gajiData;
};

function getDatesInMonth(year: number, month: number) {
  let dates = [];
  let date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    const formattedDate = new Date(date);
    formattedDate.setHours(formattedDate.getHours() + 7);
    dates.push(formattedDate.toISOString().split("T")[0]);
    date.setDate(date.getDate() + 1);
  }
  return dates;
}

const jumlahJam = (jumlah_jam: string | null) => {
  switch (jumlah_jam) {
    case "0.5":
      return 30;
    case "1":
      return 60;
    case "1.5":
      return 90;
    case "2":
      return 120;
    case "2.5":
      return 150;
    case "3":
      return 180;
    case "3.5":
      return 210;
  }
};

export default SalaryPanji;
