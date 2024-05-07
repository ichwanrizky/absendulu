import { NextResponse } from "next/server";
import { checkSession } from "@/libs/checkSession";
import { checkRoles } from "@/libs/checkRoles";
import prisma from "@/libs/db";
import { checkDepartments } from "@/libs/checkDepartments";

export async function GET(req: Request) {
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
    const roleId = session[1].roleId;
    const roleAccess = await checkRoles(roleId, "/humanresource/absensi");
    if (!roleAccess) {
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

    const actions = roleAccess?.action ? roleAccess?.action.split(",") : [];
    if (!actions.includes("view")) {
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

    const searchParams = new URL(req.url).searchParams;

    // filter
    const filter = searchParams.get("filter");
    const parseFilter = filter ? JSON.parse(filter) : {};

    if (!filter) {
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
    const currentDate = new Date(parseFilter.tanngalAbsen);
    currentDate.setHours(0, 0, 0, 0);
    currentDate.setHours(currentDate.getHours() + 7);

    const data = await prisma.pegawai.findMany({
      select: {
        id: true,
        nama: true,
        absen: {
          select: {
            id: true,
            tanggal: true,
            absen_masuk: true,
            absen_pulang: true,
            late: true,
            early: true,
          },
          where: {
            tanggal: currentDate,
          },
        },
      },
      where: {
        is_active: true,
        sub_department_id: {
          not: 1,
        },
        department_id: Number(parseFilter.department),
      },
      orderBy: {
        nama: "asc",
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

    const newData = data.map((item) => ({
      id: item.absen.length === 0 ? "" : item.absen[0].id,
      pegawaiId: item.id,
      nama: item.nama?.toUpperCase(),
      tanggal: new Date(currentDate as Date).toLocaleString(
        "id-ID",
        optionsDate2
      ),
      absenMasuk:
        item.absen.length === 0
          ? ""
          : item.absen[0].absen_masuk
          ? new Date(item.absen[0].absen_masuk as Date)
              .toLocaleString("id-ID", optionsDate)
              .replaceAll(".", ":")
          : "",
      absenPulang:
        item.absen.length === 0
          ? ""
          : item.absen[0].absen_pulang
          ? new Date(item.absen[0].absen_pulang as Date)
              .toLocaleString("id-ID", optionsDate)
              .replaceAll(".", ":")
          : "",
      late: item.absen.length === 0 ? "" : item.absen[0].late,
      early: item.absen.length === 0 ? "" : item.absen[0].early,
    }));

    return new NextResponse(
      JSON.stringify({
        status: true,
        message: "success",
        data: newData,
        actions: actions,
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
