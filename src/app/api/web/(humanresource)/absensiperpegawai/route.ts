import { NextResponse } from "next/server";
import { checkSession } from "@/libs/checkSession";
import { checkRoles } from "@/libs/checkRoles";
import { handleError } from "@/libs/handleError";
import AttendancePegawai from "@/libs/AttendancePegawai";
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

    if (!select_dept || !bulan || !tahun || !pegawai) {
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

    const attendancePegawai = await AttendancePegawai(
      Number(select_dept),
      Number(tahun),
      Number(bulan),
      Number(pegawai)
    );

    if (!attendancePegawai) {
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
        data: attendancePegawai,
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
    if (!actions.includes("update")) {
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
    const jenis = body.get("jenis")!.toString();
    const absen_id = body.get("absen_id")!.toString();
    const absensi = body.get("absensi")!.toString();
    const tanggal = body.get("tanggal")!.toString();

    const tanggalAbsen = new Date(tanggal);
    const [hours, minutes, seconds] = absensi.split(":").map(Number);

    const currentDate = new Date();
    const formattedDate = new Date(currentDate);
    formattedDate.setHours(formattedDate.getHours() + 7);

    const jam_absen = new Date(tanggalAbsen as Date);
    jam_absen.setHours(hours, minutes, seconds);
    jam_absen.setHours(jam_absen.getHours() + 7);

    let update;

    if (jenis === "absen_masuk") {
      update = await prisma.absen.update({
        data: {
          absen_masuk: jam_absen,
        },
        where: {
          id: Number(absen_id),
        },
      });
    }

    if (jenis === "absen_pulang") {
      update = await prisma.absen.update({
        data: {
          absen_pulang: jam_absen,
        },
        where: {
          id: Number(absen_id),
        },
      });
    }

    if (!update) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Failed to update absensi",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new NextResponse(
      JSON.stringify({
        status: true,
        message: "Success to update absensi",
        data: update,
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
