import { NextResponse } from "next/server";
import { checkSession } from "@/libs/checkSession";
import { checkRoles } from "@/libs/checkRoles";
import prisma from "@/libs/db";
import { handleError } from "@/libs/handleError";
import SalaryPanji from "@/libs/SalaryPanji";

export async function POST(req: Request) {
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

    const body = await req.formData();
    const department = body.get("department")!.toString();
    const bulan = body.get("bulan")!.toString();
    const tahun = body.get("tahun")!.toString();
    const pegawai = body.get("pegawai");

    const parsePegawai = pegawai ? JSON.parse(pegawai as string) : [];

    if (Number(department) === 1) {
      const gaji = await SalaryPanji(
        Number(bulan),
        Number(tahun),
        parsePegawai
      );

      console.log(gaji);

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
