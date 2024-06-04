import { NextResponse } from "next/server";
import { checkSession } from "@/libs/checkSession";
import { checkRoles } from "@/libs/checkRoles";
import prisma from "@/libs/db";
import { handleError } from "@/libs/handleError";

export async function GET(req: Request) {
  try {
    const authorization = req.headers.get("Authorization");

    const session = await checkSession(authorization);
    if (!session[0]) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Unauthorized",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const searchParams = new URL(req.url).searchParams;
    const menu_url = searchParams.get("menu_url");

    if (!menu_url) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Unauthorized",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const roleId = session[1].roleId;

    const roleAccess = await checkRoles(roleId, menu_url);
    if (!roleAccess) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Unauthorized",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const actions = roleAccess?.action ? roleAccess?.action.split(",") : [];
    if (!actions.includes("view")) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Unauthorized",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const bulan = searchParams.get("bulan");
    const tahun = searchParams.get("tahun");
    const select_dept = searchParams.get("select_dept");
    const search = searchParams.get("search");

    // loop from start of months until end of months
    const listDates = getDatesInMonth(Number(tahun), Number(bulan) - 1);

    const listTanggalMerah = await prisma.tanggal_merah_list.findMany({
      select: {
        tanggal: true,
      },
      where: {
        tanggal_merah: {
          department_id: Number(select_dept),
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
      LEFT JOIN tanggal_merah tm ON dp.id = tm.department_id
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
      p.department_id = ${Number(select_dept)} 
      AND p.is_active = 1 
      ${search ? `AND (p.nama LIKE '%${search}%')` : ""}
    ORDER BY
      p.nama,
      d.tanggal
  `;

    const data = (await prisma.$queryRawUnsafe(dataQuery)) as any;

    if (!data) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Data not found",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    let reportData: any = [];

    let pegawaiId = 0;
    let totalAttend: any = 0;
    let totalNotAttend: any = 0;
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

    data.map((item: any) => {
      if (item.id !== pegawaiId) {
        pegawaiId = item.id;
        totalAttend = 0;
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

        reportData.push({
          pegawai_id: item.id,
          nama: item.nama,
          workdate_count: tanggalKerja.length,
          attend_count: totalAttend,
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

        // COUNT ATTEND
        if (item.tanggal_absen) {
          totalAttend += 1;
        }

        // COUNT NOT ATTEND
        if (
          !item.tanggal_absen &&
          !item.tanggal_izin &&
          !item.tanggal_libur &&
          item.tanggal < new Date().toISOString().split("T")[0]
        ) {
          totalNotAttend += 1;
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
      }
    });

    return new NextResponse(
      JSON.stringify({
        status: true,
        message: "success",
        data: reportData,
        actions: actions,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    return handleError(error);
  }
}

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
