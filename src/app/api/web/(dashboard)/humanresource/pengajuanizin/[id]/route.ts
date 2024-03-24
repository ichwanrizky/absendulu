import { NextResponse } from "next/server";
import { checkSession } from "@/libs/checkSession";
import { checkRoles } from "@/libs/checkRoles";
import prisma from "@/libs/db";
import { checkDepartments } from "@/libs/checkDepartments";

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

    const roleId = session[1].roleId;
    const roleAccess = await checkRoles(roleId, "/humanresource/pengajuanizin");
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

    const departmentAccess = await checkDepartments(roleId);

    const update = await prisma.pengajuan_izin.update({
      data: {
        status: Number(status),
        approve_by: session[1].id,
        approve_date: formattedDate,
      },
      where: {
        id: Number(id),
        pegawai: {
          department_id: {
            in: departmentAccess.map((item) => item.department_id),
          },
        },
      },
    });

    if (!update) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Failed to update pengajuan izin",
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
      const currentYear = new Date().getFullYear();
      const nextYear = currentYear + 1;

      const tanggalMerah = await prisma.tanggal_merah_list.findMany({
        where: {
          tanggal_merah: {
            department_id: Number(update.department_id),
          },
          OR: [
            {
              tanggal_merah: {
                tahun: currentYear,
              },
            },
            {
              tanggal_merah: {
                tahun: nextYear,
              },
            },
          ],
        },
      });

      const tanggalMerahSet = new Set(
        tanggalMerah.map(
          (item: any) => item.tanggal.toISOString().split("T")[0]
        )
      );

      const jumlahHari =
        update.jumlah_hari === "" ? 1 : Number(update.jumlah_hari);

      const izinData = [];
      let tanggalIzin = new Date(update.tanggal as Date);
      let i = 0;

      while (izinData.length < jumlahHari) {
        if (i > 0) {
          tanggalIzin.setDate(tanggalIzin.getDate() + 1);
        }

        if (!tanggalMerahSet.has(tanggalIzin.toISOString().split("T")[0])) {
          const izinEntry = {
            jenis_izin: update.jenis_izin,
            tanggal: new Date(tanggalIzin),
            pegawai_id: update.pegawai_id,
            bulan: update.bulan,
            tahun: update.tahun,
            keterangan: update.keterangan,
            pengajuan_izin_id: update.id,
            department_id: update.department_id,
          };

          izinData.push(izinEntry);
        }

        i++;
      }

      const insertIzin = await prisma.izin.createMany({
        data: izinData,
      });

      if (!insertIzin) {
        return new NextResponse(
          JSON.stringify({
            status: false,
            message: "Failed to update pengajuan izin",
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

    return new NextResponse(
      JSON.stringify({
        status: true,
        message: "Success to update pengajuan izin",
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

    const roleId = session[1].roleId;
    const roleAccess = await checkRoles(roleId, "/humanresource/pengajuanizin");
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

    const departmentAccess = await checkDepartments(roleId);
    const deletes = await prisma.pengajuan_izin.delete({
      where: {
        id: Number(id),
        pegawai: {
          department_id: {
            in: departmentAccess.map((item) => item.department_id),
          },
        },
      },
    });

    if (!deletes) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Failed to delete data pengajuan izin",
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
        message: "Success to delete pengajuan izin",
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
