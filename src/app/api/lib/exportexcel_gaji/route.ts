import { checkSession } from "@/libs/checkSession";
import { handleError } from "@/libs/handleError";
import { NextResponse } from "next/server";
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

    const body = await req.formData();
    const department = body.get("department")?.toString();
    const bulan = body.get("bulan")?.toString();
    const tahun = body.get("tahun")?.toString();

    // list komponen gaji
    const listKomponen = await prisma.komponen_gaji.findMany({
      select: {
        id: true,
        komponen: true,
        tipe: true,
      },
      where: {
        department_id: Number(department),
        urut: {
          not: 0,
        },
      },
      orderBy: {
        urut_tampil: "asc",
      },
    });

    // list gaji
    const listGaji = await prisma.pegawai.findMany({
      select: {
        id: true,
        nama: true,
        status_nikah: true,
        no_rek: true,
        position: true,
        department: { select: { nama_department: true } },
        sub_department: { select: { nama_sub_department: true } },
        gaji: {
          select: {
            id: true,
            bulan: true,
            tahun: true,
            nominal: true,
            komponen_id: true,
            tipe: true,
          },
          where: {
            bulan: Number(bulan),
            tahun: Number(tahun),
          },
          orderBy: {
            urut: "asc",
          },
        },
      },
      where: {
        department_id: Number(department),
        gaji: {
          some: {
            bulan: Number(bulan),
            tahun: Number(tahun),
          },
        },
      },
      orderBy: {
        nama: "asc",
      },
    });

    if (!listGaji || !listKomponen) {
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

    const data = {
      listKomponen: listKomponen,
      listGaji: listGaji,
    };

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
