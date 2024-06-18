import prisma from "@/libs/db";

const AttendancePegawai = async (
  department: number,
  tahun: number,
  bulan: number,
  pegawai: number
) => {
  const listDates = getDatesInMonth(Number(tahun), Number(bulan) - 1);

  const tanggalKerjaQuery = listDates
    .map((date) => `SELECT '${date}' as tanggal`)
    .join(" UNION ");

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
      a.id AS absen_id,
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
      p.id = ${pegawai}
    ORDER BY
      p.nama,
      d.tanggal
  `;

  const data = (await prisma.$queryRawUnsafe(dataQuery)) as any;

  const newData = data?.map((item: any) => ({
    id: item.id,
    nama: item.nama?.toUpperCase(),
    tanggal: item.tanggal,
    hari: new Date(item?.tanggal as Date).getDay(),
    tanggal_libur: item.tanggal_libur,
    absen_id: item.absen_id,
    tanggal_absen: item.tanggal_absen,
    absen_masuk: item.absen_masuk
      ? new Date(item?.absen_masuk as Date)
          .toLocaleString("id-ID", optionsDate)
          .replaceAll(".", ":")
      : "",
    absen_pulang: item.absen_pulang
      ? new Date(item?.absen_pulang as Date)
          .toLocaleString("id-ID", optionsDate)
          .replaceAll(".", ":")
      : "",
    late: item.late,
    tanggal_izin: item.tanggal_izin,
    jenis_izin: item.jenis_izin,
    jumlah_hari: item.jumlah_hari,
    jumlah_jam: item.jumlah_jam,
    tanggal_ot: item.tanggal_ot,
    jam_ot: item.jam_ot,
    total_ot: item.total_ot,
  }));

  return newData;
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

const optionsDate: any = {
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  timeZone: "UTC",
};

export default AttendancePegawai;
