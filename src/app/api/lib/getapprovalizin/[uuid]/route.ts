import { NextResponse } from "next/server";
import prisma from "@/libs/db";
import { checkSession } from "@/libs/checkSession";
import { handleError } from "@/libs/handleError";

export async function GET(
  req: Request,
  { params }: { params: { uuid: string } }
) {
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

    const uuid = params.uuid;
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

    const getData = await prisma.pengajuan_izin.findFirst({
      include: {
        pegawai: {
          select: {
            nama: true,
            department: {
              select: {
                nama_department: true,
              },
            },
            sub_department: {
              select: {
                nama_sub_department: true,
              },
            },
          },
        },
      },
      where: {
        uuid: uuid,
      },
    });

    if (!getData) {
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
        data: getData,
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
