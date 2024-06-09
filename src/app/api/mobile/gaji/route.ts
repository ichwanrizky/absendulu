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

    const pegawai = session[1].pegawaiId;

    const data = await prisma.gaji_pegawai.findMany({
      select: {
        tahun: true,
        bulan: true,
        nominal: true,
        publish: true,
        uuid: true,
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
        pegawai_id: pegawai,
      },
      orderBy: [
        {
          tahun: "desc",
        },
        {
          bulan: "desc",
        },
      ],
      take: 12,
    });

    const newData = data.map((item) => {
      return {
        bulan: monthNames(item.bulan),
        tahun: item.tahun,
        gaji: item.nominal,
        slipStatus: item.publish,
        url: `${process.env.IZIN_URL}/slipgaji/${item.uuid}`,
      };
    });

    return new NextResponse(
      JSON.stringify({
        status: true,
        message: "success",
        data: newData,
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

const monthNames = (month: number) => {
  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Augustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  return monthNames[month - 1];
};
