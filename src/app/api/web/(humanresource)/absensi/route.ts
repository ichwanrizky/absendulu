import { NextResponse } from "next/server";
import { checkSession } from "@/libs/checkSession";
import { checkRoles } from "@/libs/checkRoles";
import prisma from "@/libs/db";
import { handleError } from "@/libs/handleError";

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

    const searchParams = new URL(req.url).searchParams;
    const menu_url = searchParams.get("menu_url");

    if (!menu_url) {
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
    const roleAccess = await checkRoles(roleId, menu_url);
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

    // search
    const search = searchParams.get("search");

    // filter
    const select_dept = searchParams.get("select_dept");
    const tanggal_absen = searchParams.get("tanggal_absen");

    // format date
    const currentDate = new Date(tanggal_absen!);
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
        department_id: Number(select_dept),
        nama: {
          contains: search ? search : undefined,
        },
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

    const sortData = data.sort((a: any, b: any) => {
      const absenA = a.absen.length > 0 ? 1 : 0;
      const absenB = b.absen.length > 0 ? 1 : 0;

      if (absenB - absenA !== 0) {
        return absenB - absenA;
      } else {
        return a.nama.localeCompare(b.nama);
      }
    });

    const newData = sortData.map((item) => ({
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
    return handleError(error);
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
