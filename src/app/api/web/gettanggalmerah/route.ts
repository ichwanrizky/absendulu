import { NextResponse } from "next/server";
import prisma from "@/libs/db";

export async function POST(req: Request) {
  try {
    const body = await req.formData();
    const uuid = body.get("uuid")?.toString();
    const department = body.get("department")!.toString();

    if (!uuid) {
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

    // format date
    const currendDate = new Date();
    const formattedDate = new Date(currendDate);
    formattedDate.setHours(formattedDate.getHours() + 7);

    const checkSession = await prisma.request_session_izin.findFirst({
      include: {
        pegawai: {
          select: {
            id: true,
            nama: true,
            department: {
              select: {
                id: true,
                nama_department: true,
              },
            },
            sub_department: {
              select: {
                id: true,
                nama_sub_department: true,
                akses_izin: true,
              },
            },
          },
        },
      },
      where: {
        uuid: uuid,
        AND: [
          {
            expired_at: {
              gte: formattedDate,
            },
          },
          {
            expired: false,
          },
        ],
      },
    });

    if (!checkSession) {
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

    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;

    const data = await prisma.tanggal_merah_list.findMany({
      where: {
        tanggal_merah: {
          department_id: Number(department),
        },
        OR: [
          {
            tanggal_merah: {
              tahun: currentYear,
            },
          },
          {
            tanggal_merah: {
              tahun: nextYear,
            },
          },
        ],
      },
    });

    return new NextResponse(
      JSON.stringify({
        status: true,
        message: "success",
        data: data,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      if (error?.name == "TokenExpiredError") {
        return new NextResponse(
          JSON.stringify({
            status: false,
            message: "Session Expired",
          }),
          {
            status: 401,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      return new NextResponse(
        JSON.stringify({
          status: false,
          message: error.name,
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
  }
}
