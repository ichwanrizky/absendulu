import { NextResponse } from "next/server";
import prisma from "@/libs/db";

export async function POST(
  req: Request,
  { params }: { params: { uuid: string } }
) {
  try {
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

    const checkPegawai = await prisma.request_session_izin.findFirst({
      include: {
        pegawai: {
          select: {
            department_id: true,
          },
        },
      },
      where: {
        uuid: uuid,
      },
    });

    if (!checkPegawai) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Unauthorized (data not found)",
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
    const jenis_izin = body.get("jenis_izin")!.toString();
    let tanggal = body.get("tanggal")!.toString();
    let jumlah_hari = body.get("jumlah_hari")!.toString();
    let jumlah_jam = body.get("jumlah_jam")!.toString();
    const keterangan = body.get("keterangan")!.toString();

    if (
      jenis_izin == "C" ||
      jenis_izin == "CS" ||
      jenis_izin == "I" ||
      jenis_izin == "IS" ||
      jenis_izin == "S" ||
      jenis_izin == "P/M"
    ) {
      jumlah_jam = "";
    }

    if (
      jenis_izin == "G1" ||
      jenis_izin == "G2" ||
      jenis_izin == "G3" ||
      jenis_izin == "CS" ||
      jenis_izin == "IS" ||
      jenis_izin == "P/M"
    ) {
      jumlah_hari = "1";
    }

    const formattedDate = new Date(tanggal);
    formattedDate.setHours(formattedDate.getHours() + 7);

    const create = await prisma.pengajuan_izin.create({
      data: {
        jenis_izin: jenis_izin,
        tanggal: formattedDate,
        jumlah_hari: jumlah_hari,
        jumlah_jam: jumlah_jam,
        keterangan: keterangan,
        bulan: formattedDate.getMonth(),
        tahun: formattedDate.getFullYear(),
        pegawai_id: checkPegawai.pegawai_id,
        department_id: checkPegawai.pegawai.department_id,
      },
    });

    if (!create) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Gagal mengajukan izin",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const expiredSession = await prisma.request_session_izin.update({
      data: {
        expired: true,
      },
      where: {
        uuid: uuid,
      },
    });

    if (!expiredSession) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Gagal mengajukan izin (expired session)",
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
        message: "Berhasil mengajukan izin",
        data: create,
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
