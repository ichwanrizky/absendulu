import { NextResponse } from "next/server";
import { checkSession } from "@/libs/checkSession";
import { checkRoles } from "@/libs/checkRoles";
import { handleError } from "@/libs/handleError";
import prisma from "@/libs/db";

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
    if (!actions.includes("insert")) {
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
    const pegawai_id = body.get("pegawai_id")!.toString();
    const tanggal = body.get("tanggal")!.toString();

    const tanggalAbsen = new Date(tanggal);

    const dataDepartment = await prisma.department.findFirst({
      include: {
        pegawai: {
          where: {
            id: Number(pegawai_id),
          },
          select: {
            shift: true,
          },
        },
      },
      where: {
        pegawai: {
          some: {
            id: Number(pegawai_id),
          },
        },
      },
    });

    if (!dataDepartment || !dataDepartment.pegawai[0].shift) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Shift not found",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const jam_masuk_department = dataDepartment.pegawai[0].shift
      .jam_masuk as Date;

    const jam_masuk = new Date(tanggalAbsen as Date);
    jam_masuk.setHours(
      jam_masuk_department.getHours(),
      jam_masuk_department.getMinutes(),
      jam_masuk_department.getSeconds()
    );

    const createAbsen = await prisma.absen.create({
      data: {
        pegawai_id: Number(pegawai_id),
        tanggal: tanggalAbsen,
        absen_masuk: jam_masuk,
        shift_id: dataDepartment.pegawai[0]?.shift?.id
          ? dataDepartment.pegawai[0]?.shift?.id
          : 0,
        bulan: jam_masuk.getMonth() + 1,
        tahun: jam_masuk.getFullYear(),
        ket_masuk: "Generate Absen",
        is_manual: true,
      },
    });

    if (!createAbsen) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Failed to generate absensi",
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
        message: "Success to generate absensi",
        data: createAbsen,
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
