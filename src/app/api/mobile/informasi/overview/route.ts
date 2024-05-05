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

    // check total absensi per month
    const countAbsen = await prisma.absen.count({
      where: {
        pegawai_id: session[1].pegawaiId,
        bulan: new Date().getMonth() + 1,
        tahun: new Date().getFullYear(),
      },
    });

    // check total late per month
    const countLate = await prisma.absen.aggregate({
      _sum: {
        late: true,
      },
      where: {
        pegawai_id: session[1].pegawaiId,
        bulan: new Date().getMonth() + 1,
        tahun: new Date().getFullYear(),
      },
    });

    // check total izin per month
    const countIzin = await prisma.pengajuan_izin.count({
      where: {
        pegawai_id: session[1].pegawaiId,
        bulan: new Date().getMonth() + 1,
        tahun: new Date().getFullYear(),
        status: 1,
        jenis_izin: {
          in: ["I", "IS"],
        },
      },
    });

    // check total cuti per month
    const countCuti = await prisma.pengajuan_izin.count({
      where: {
        pegawai_id: session[1].pegawaiId,
        bulan: new Date().getMonth() + 1,
        tahun: new Date().getFullYear(),
        status: 1,
        jenis_izin: {
          in: ["C", "CS"],
        },
      },
    });

    // check total sakit per month
    const countSakit = await prisma.pengajuan_izin.count({
      where: {
        pegawai_id: session[1].pegawaiId,
        bulan: new Date().getMonth() + 1,
        tahun: new Date().getFullYear(),
        status: 1,
        jenis_izin: "S",
      },
    });

    const data = {
      total_absen: countAbsen,
      total_late: countLate._sum.late ? countLate._sum.late : 0,
      total_izin: countIzin,
      total_cuti: countCuti,
      total_sakit: countSakit,
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
