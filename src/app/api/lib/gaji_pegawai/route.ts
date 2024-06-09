import { NextResponse } from "next/server";
import { checkSession } from "@/libs/checkSession";
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

    const data = await prisma.gaji_pegawai.findFirst({
      select: {
        tahun: true,
        bulan: true,
        pegawai: {
          select: {
            id: true,
            nama: true,
            status_nikah: true,
            position: true,
          },
        },
        department: {
          select: {
            nama_department: true,
          },
        },
        gaji: {
          orderBy: {
            urut: "asc",
          },
        },
      },
      where: {
        uuid: uuid,
      },
    });

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
    return handleError(error);
  }
}
