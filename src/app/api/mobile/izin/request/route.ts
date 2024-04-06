import { NextResponse } from "next/server";
import prisma from "@/libs/db";
import { checkSessionMobile } from "@/libs/checkSessionMobile";

export async function GET(req: Request) {
  try {
    const authorization = req.headers.get("Authorization");

    const session = await checkSessionMobile(authorization);
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

    const checkAksesIzin = await prisma.pegawai.findFirst({
      select: {
        sub_department: true,
      },
      where: {
        id: session[1].pegawaiId,
        sub_department: {
          akses_izin: {
            not: null,
          },
        },
      },
    });

    if (!checkAksesIzin) {
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

    // expires date
    const expiredDate = new Date(formattedDate);
    expiredDate.setHours(expiredDate.getHours() + 1);

    const existSession = await prisma.request_session_izin.findFirst({
      where: {
        pegawai_id: session[1].pegawaiId,
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

    if (existSession) {
      return new NextResponse(
        JSON.stringify({
          status: true,
          message: "Request Success",
          data: {
            ...existSession,
            url:
              "http://192.168.10.110:3000/pengajuan-izin/" + existSession.uuid,
          },
        }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const createSession = await prisma.request_session_izin.create({
      data: {
        pegawai_id: session[1].pegawaiId,
        created_at: formattedDate,
        expired_at: expiredDate,
      },
    });

    if (!createSession) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Request Failed",
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
        message: "Request Success",
        data: {
          ...createSession,
          url: "http://localhost:3000/pengajuan-izin/" + createSession.uuid,
        },
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
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: error.message,
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
