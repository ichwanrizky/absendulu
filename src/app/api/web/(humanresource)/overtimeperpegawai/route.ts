import { NextResponse } from "next/server";
import { checkSession } from "@/libs/checkSession";
import { checkRoles } from "@/libs/checkRoles";
import { handleError } from "@/libs/handleError";
import prisma from "@/libs/db";

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

    // filter
    const select_dept = searchParams.get("select_dept");
    const bulan = searchParams.get("bulan");
    const tahun = searchParams.get("tahun");
    const pegawai = searchParams.get("pegawai");

    if (!select_dept || !bulan || !tahun) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "filter not found",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const overtimePegawai = await prisma.overtime.findMany({
      select: {
        id: true,
        tanggal: true,
        jam: true,
        total: true,
        is_holiday: true,
        pegawai: {
          select: {
            id: true,
            nama: true,
          },
        },
      },
      where: {
        pegawai_id: Number(pegawai),
        bulan: Number(bulan),
        tahun: Number(tahun),
        department_id: Number(select_dept),
      },
      orderBy: {
        tanggal: "asc",
      },
    });

    if (!overtimePegawai) {
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

    return new NextResponse(
      JSON.stringify({
        status: true,
        message: "success",
        data: overtimePegawai,
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
