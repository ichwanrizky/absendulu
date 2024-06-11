import { NextResponse } from "next/server";
import prisma from "@/libs/db";
import { checkSessionMobile } from "@/libs/checkSessionMobile";
import { handleError } from "@/libs/handleError";

export async function POST(req: Request) {
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

    const body = await req.formData();
    const latitude = body.get("latitude")?.toString();
    const longitude = body.get("longitude")?.toString();

    const dataDepartment = await prisma.department.findFirst({
      include: {
        pegawai: {
          where: {
            id: session[1].pegawaiId,
          },
          select: {
            shift: true,
          },
        },
      },
      where: {
        pegawai: {
          some: {
            id: session[1].pegawaiId,
          },
        },
      },
    });

    if (!dataDepartment || !dataDepartment.pegawai[0].shift) {
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

    const distance = calculateDistance(
      dataDepartment.latitude,
      dataDepartment.longitude,
      latitude,
      longitude
    );

    const lokasiTambahan = await prisma.izin_lokasi_tambahan.findMany({
      select: {
        lokasi_tambahan: true,
      },
      where: {
        pegawai_id: Number(session[1].pegawaiId),
      },
      orderBy: {
        id: "desc",
      },
    });

    if (lokasiTambahan.length > 0) {
      let inZone = false;
      let shouldContinue = true;
      if (distance > Number(dataDepartment.radius)) {
        inZone = false;
      }

      lokasiTambahan?.map((item: any) => {
        if (!shouldContinue) return;

        const newDistance = calculateDistance(
          item.lokasi_tambahan.latitude,
          item.lokasi_tambahan.longitude,
          latitude,
          longitude
        );

        if (newDistance > Number(item.lokasi_tambahan.radius)) {
          inZone = false;
        } else {
          inZone = true;
          shouldContinue = false;
        }
      });

      if (!inZone) {
        return new NextResponse(
          JSON.stringify({
            status: false,
            message: "Gagal, Anda belum berada di dalam zona absen",
          }),
          {
            status: 401,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }
    } else {
      if (distance > Number(dataDepartment.radius)) {
        return new NextResponse(
          JSON.stringify({
            status: false,
            message: "Gagal, Anda belum berada di dalam zona absen",
          }),
          {
            status: 401,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }
    }

    // format date
    const currentDate = new Date();
    const formattedDate = new Date(currentDate);
    formattedDate.setHours(formattedDate.getHours() + 7);
    formattedDate.setUTCHours(0, 0, 0, 0);
    const year = formattedDate.getUTCFullYear();
    const month = formattedDate.getUTCMonth() + 1;

    // time format
    const currentDate2 = new Date();
    const formattedDate2 = new Date(currentDate2);
    formattedDate2.setHours(formattedDate2.getHours() + 7);

    // late
    const jam_pulang_department = dataDepartment.pegawai[0].shift
      .jam_pulang as Date;

    const jam_pulang = new Date();
    jam_pulang.setDate(jam_pulang.getDate() + 1);
    jam_pulang.setHours(
      jam_pulang_department.getHours(),
      jam_pulang_department.getMinutes(),
      jam_pulang_department.getSeconds()
    );

    const difference = (formattedDate2 as any) - (jam_pulang as any);
    const differenceInMinutes = Math.round(difference / 60000);

    if (differenceInMinutes < -300) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Gagal, anda belum dapat melakukan absensi pulang",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (differenceInMinutes >= 420) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Gagal, anda melewati batas jam absensi pulang",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const getAbsen = await prisma.absen.findFirst({
      where: {
        pegawai_id: session[1].pegawaiId,
        tanggal: formattedDate,
      },
    });

    if (getAbsen?.absen_pulang) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Gagal, absen sudah dilakukan",
        }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (getAbsen) {
      var createAbsen = await prisma.absen.update({
        data: {
          absen_pulang: formattedDate2,
        },
        where: {
          id: getAbsen.id,
        },
      });
    } else {
      var createAbsen = await prisma.absen.create({
        data: {
          pegawai_id: session[1].pegawaiId,
          tanggal: formattedDate,
          absen_pulang: formattedDate2,
          shift_id: dataDepartment.pegawai[0]?.shift?.id
            ? dataDepartment.pegawai[0]?.shift?.id
            : 0,
          bulan: month,
          tahun: year,
          latitude: latitude,
          longitude: longitude,
        },
      });
    }

    if (!createAbsen) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Gagal melakukan absen",
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
        message: "Berhasil absen pulang",
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

function calculateDistance(lat1: any, lon1: any, lat2: any, lon2: any) {
  function toRad(x: any) {
    return (x * Math.PI) / 180;
  }

  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance * 1000;
}
