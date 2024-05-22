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

    const select_dept = searchParams.get("select_dept");

    const data = await prisma.pegawai.findMany({
      select: {
        id: true,
        nama: true,
        status_nikah: true,
        type_gaji: true,
        master_gaji_pegawai: {
          select: {
            id: true,
            nominal: true,
            komponen: {
              select: {
                id: true,
                komponen: true,
              },
            },
          },
          orderBy: {
            komponen: {
              urut: "asc",
            },
          },
        },
      },
      where: {
        is_active: true,
        department_id: Number(select_dept),
        id: {
          in: [403, 84],
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

    return new NextResponse(
      JSON.stringify({
        status: true,
        message: "success",
        data: data,
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

export async function POST(req: Request) {
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
    if (!actions.includes("insert")) {
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
    const selected_pegawai = body.get("selected_pegawai")!.toString();
    const data_master_gaji = body.get("data_master_gaji")!.toString();
    const parseSelectedPegawai = JSON.parse(selected_pegawai);
    const parseDataMasterGaji = JSON.parse(data_master_gaji);

    const selecedPegawai = parseSelectedPegawai?.map(
      (item: any) => item.pegawai
    );

    const update = await prisma.$transaction([
      prisma.master_gaji_pegawai.deleteMany({
        where: {
          pegawai_id: {
            in: selecedPegawai,
          },
        },
      }),

      prisma.master_gaji_pegawai.createMany({
        data: parseDataMasterGaji.flatMap((item: any) =>
          item.master_gaji_pegawai.map((item2: any) => ({
            pegawai_id: item.id,
            komponen_id: item2.id,
            nominal: item2.nominal,
          }))
        ),
      }),

      ...parseDataMasterGaji.map((item: any) =>
        prisma.pegawai.update({
          where: {
            id: item.id,
          },
          data: {
            type_gaji: item.type_gaji,
          },
        })
      ),
    ]);

    if (!update) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Failed to create master gaji",
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
        message: "Success to create master gaji",
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
    console.log("🚀 ~ POST ~ error:", error);
    return handleError(error);
  }
}
