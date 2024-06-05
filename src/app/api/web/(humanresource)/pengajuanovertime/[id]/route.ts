import { NextResponse } from "next/server";
import { checkSession } from "@/libs/checkSession";
import { checkRoles } from "@/libs/checkRoles";
import prisma from "@/libs/db";
import { handleError } from "@/libs/handleError";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
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
    if (!actions.includes("update")) {
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

    const id = params.id;
    if (!id) {
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

    const body = await req.formData();
    const status = body.get("status")!.toString();

    // format date
    const currendDate = new Date();
    const formattedDate = new Date(currendDate);
    formattedDate.setHours(formattedDate.getHours() + 7);

    const update = await prisma.pengajuan_overtime.update({
      data: {
        status: Number(status),
        approve_by: session[1].id,
        approve_date: formattedDate,
      },
      where: {
        id: Number(id),
      },
    });

    if (!update) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Failed to update pengajuan overtime",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (status === "1") {
      const data = await prisma.pengajuan_overtime_pegawai.findMany({
        include: {
          pengajuan_overtime: true,
        },
        where: {
          pengajuan_overtime_id: Number(id),
        },
      });

      await prisma.overtime.createMany({
        data: await Promise.all(
          data?.map(async (item: any) => {
            const jam_from = item.pengajuan_overtime.jam_from;
            const jam_to = item.pengajuan_overtime.jam_to;

            const difference = jam_to - jam_from;
            const hours = difference / (1000 * 60 * 60);

            const roundedHours =
              Math.floor(hours) + (hours % 1 >= 0.5 ? 0.5 : 0);

            const checkTanggalMerah = await prisma.tanggal_merah_list.findFirst(
              {
                where: {
                  tanggal: item.pengajuan_overtime.tanggal,
                },
              }
            );

            let is_holiday;
            let total;

            let newRoundedHours;

            if (checkTanggalMerah) {
              is_holiday = true;

              if (roundedHours >= 4) {
                newRoundedHours = roundedHours - 1;
              } else {
                newRoundedHours = roundedHours;
              }
              total = holiday(newRoundedHours?.toString());
            } else {
              newRoundedHours = roundedHours;
              is_holiday = false;
              total = normalDay(roundedHours?.toString());
            }

            return {
              tanggal: item.pengajuan_overtime.tanggal as Date,
              pegawai_id: Number(item.pegawai_id),
              department_id: Number(item.pengajuan_overtime.department_id),
              jam: newRoundedHours?.toString(),
              total: total,
              is_holiday: is_holiday,
              status: 1,
              bulan: item.pengajuan_overtime.bulan,
              tahun: item.pengajuan_overtime.tahun,
              pengajuan_overtime_id: Number(item.pengajuan_overtime_id),
            };
          })
        ),
      });
    }

    return new NextResponse(
      JSON.stringify({
        status: true,
        message: "Success to update pengajuan overtime",
        data: update,
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

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
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
    if (!actions.includes("delete")) {
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

    const id = params.id;
    if (!id) {
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

    const deletes = await prisma.$transaction([
      prisma.pengajuan_overtime_pegawai.deleteMany({
        where: {
          pengajuan_overtime_id: Number(id),
        },
      }),

      prisma.pengajuan_overtime.delete({
        where: {
          id: Number(id),
        },
      }),
    ]);

    if (!deletes) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Failed to delete pengajuan overtime",
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
        message: "Success to delete pengajuan overtime",
        data: deletes,
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

const normalDay = (jam: string): string => {
  switch (jam) {
    case "0.5":
      return "0.75";
    case "1":
      return "1.5";
    case "1.5":
      return "2.5";
    case "2":
      return "3.5";
    case "2.5":
      return "4.5";
    case "3":
      return "5.5";
    case "3.5":
      return "6.5";
    case "4":
      return "7.5";
    case "4.5":
      return "8.5";
    case "5":
      return "9.5";
    case "5.5":
      return "10.5";
    case "6":
      return "11.5";
    case "6.5":
      return "12.5";
    case "7":
      return "13.5";
    default:
      return "0";
  }
};

const holiday = (jam: string): string => {
  switch (jam) {
    case "1":
      return "2";
    case "1.5":
      return "3";
    case "2":
      return "4";
    case "2.5":
      return "5";
    case "3":
      return "6";
    case "3.5":
      return "7";
    case "4":
      return "8";
    case "4.5":
      return "9";
    case "5":
      return "10";
    case "5.5":
      return "11";
    case "6":
      return "12";
    case "6.5":
      return "13";
    case "7":
      return "14";
    case "7.5":
      return "15";
    case "8":
      return "17";
    case "8.5":
      return "18.5";
    case "9":
      return "21";
    case "9.5":
      return "23";
    case "10":
      return "25";
    case "10.5":
      return "27";
    case "11":
      return "29";
    case "11.5":
      return "31";
    default:
      return jam; // Return the original jam if none of the cases match
  }
};
