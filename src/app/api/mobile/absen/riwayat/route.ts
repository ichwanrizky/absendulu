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
    const data = await prisma.absen.findMany({
      where: {
        pegawai_id: session[1].pegawaiId,
      },
      orderBy: {
        tanggal: "desc",
      },
    });

    if (!data) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Data not found",
          data: [],
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const newData = data.map((item) => ({
      tanggal: new Date(item.tanggal as Date).toLocaleString(
        "id-ID",
        optionsDate2
      ),
      absenMasuk: item.absen_masuk
        ? new Date(item.absen_masuk as Date)
            .toLocaleString("id-ID", optionsDate)
            .replaceAll(".", ":")
        : "",
      absenPulang: item.absen_pulang
        ? new Date(item.absen_pulang as Date)
            .toLocaleString("id-ID", optionsDate)
            .replaceAll(".", ":")
        : "",
      late: item.late,
    }));

    return new NextResponse(
      JSON.stringify({
        status: true,
        message: "Success",
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

    return new NextResponse(
      JSON.stringify({
        status: false,
        message: "Internal Server Error",
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

const optionsDate: any = {
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  timeZone: "UTC",
};

const optionsDate2: any = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
};
