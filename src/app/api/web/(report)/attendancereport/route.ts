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

    // const searchParams = new URL(req.url).searchParams;
    // const menu_url = searchParams.get("menu_url");

    // if (!menu_url) {
    //   return new NextResponse(
    //     JSON.stringify({
    //       status: false,
    //       message: "Unauthorized",
    //     }),
    //     {
    //       status: 401,
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   );
    // }

    // const roleId = session[1].roleId;

    // const roleAccess = await checkRoles(roleId, menu_url);
    // if (!roleAccess) {
    //   return new NextResponse(
    //     JSON.stringify({
    //       status: false,
    //       message: "Unauthorized",
    //     }),
    //     {
    //       status: 401,
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   );
    // }

    // const actions = roleAccess?.action ? roleAccess?.action.split(",") : [];
    // if (!actions.includes("view")) {
    //   return new NextResponse(
    //     JSON.stringify({
    //       status: false,
    //       message: "Unauthorized",
    //     }),
    //     {
    //       status: 401,
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   );
    // }

    const tahun = 2024;
    const bulan = 5;

    // loop from start of months until end of months

    const listDates = getDatesInMonth(tahun, bulan - 1);

    const listTanggalMerah = await prisma.tanggal_merah_list.findMany({
      select: {
        tanggal: true,
      },
      where: {
        tanggal_merah: {
          department_id: 1,
          bulan: bulan,
          tahun: tahun,
        },
      },
      orderBy: {
        tanggal: "asc",
      },
    });

    const tanggalMerah = listTanggalMerah.map(
      (item: any) => item.tanggal.toISOString().split("T")[0]
    );

    const tanggalKerja = listDates.filter((item: any) => {
      if (!tanggalMerah.includes(item)) {
        return new Date(item + "T00:00:00.000Z");
      }
    });
    // const tanggalKerja = listDates.filter(
    //   (item: any) => !tanggalMerah.includes(item)
    // );
    console.log(tanggalKerja);

    const data = await prisma.$queryRaw`
    `;

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
        // actions: actions,
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

function getDatesInMonth(year: number, month: number) {
  let dates = [];
  let date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    const formattedDate = new Date(date);
    formattedDate.setHours(formattedDate.getHours() + 7);
    dates.push(formattedDate.toISOString().split("T")[0]);
    date.setDate(date.getDate() + 1);
  }
  return dates;
}
