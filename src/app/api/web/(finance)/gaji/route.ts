import { NextResponse } from "next/server";
import { checkSession } from "@/libs/checkSession";
import { checkRoles } from "@/libs/checkRoles";
import prisma from "@/libs/db";
import { handleError } from "@/libs/handleError";
import SalaryPanji from "@/libs/SalaryPanji";

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

type MasterGaji = {
  id: number;
  komponen: string;
  tipe: string;
  metode: null | string;
  is_master: boolean;
  urut: number | null;
  department_id: number;
  master_gaji_pegawai: [];
};

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

    // const searchParams = new URL(req.url).searchParams;
    // const menu_url = searchParams.get("menu_url");
    // if (!menu_url) {
    //   return new NextResponse(
    //     JSON.stringify({
    //       status: false,
    //       message: "Unauthorized",
    //     }),
    //     {
    //       status: 401,
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   );
    // }

    // const roleId = session[1].roleId;
    // const roleAccess = await checkRoles(roleId, menu_url);
    // if (!roleAccess) {
    //   return new NextResponse(
    //     JSON.stringify({
    //       status: false,
    //       message: "Unauthorized",
    //     }),
    //     {
    //       status: 401,
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   );
    // }

    // const actions = roleAccess?.action ? roleAccess?.action.split(",") : [];
    // if (!actions.includes("view")) {
    //   return new NextResponse(
    //     JSON.stringify({
    //       status: false,
    //       message: "Unauthorized",
    //     }),
    //     {
    //       status: 401,
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   );
    // }

    const select_dept = 1;
    const bulan = 5;
    const tahun = 2024;

    if (select_dept === 1) {
      const gaji = await SalaryPanji(bulan, tahun);

      // const createGaji = await prisma.gaji.createMany({
      //   data: gaji?.map((item: any) => ({
      //     bulan: bulan,
      //     tahun: tahun,
      //     pegawai_id: item.pegawai_id,
      //     tipe: item.tipe,
      //     komponen: item.komponen_name,
      //     nominal: Number(item.nominal),
      //   })),
      // });
    }
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
