import { NextResponse } from "next/server";
import prisma from "@/libs/db";
import { handleError } from "@/libs/handleError";

export async function POST(req: Request) {
  try {
    const body = await req.formData();
    const uuid = body.get("uuid")?.toString();

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

    return new NextResponse(
      JSON.stringify({
        status: true,
        message: "Success",
        data: checkSession,
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
