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

    // filter
    const select_dept = searchParams.get("select_dept");

    // search
    const search = searchParams.get("search");

    const data = await prisma.pengajuan_overtime.findMany({
      include: {
        sub_department: {
          select: {
            id: true,
            nama_sub_department: true,
          },
        },
        pengajuan_overtime_pegawai: {
          select: {
            pegawai: {
              select: {
                nama: true,
              },
            },
          },
        },
      },
      where: {
        department_id: Number(select_dept),
        status: 0,
        pengajuan_overtime_pegawai: {
          some: {
            pegawai: {
              nama: {
                contains: search ? search : undefined,
              },
            },
          },
        },
      },
      orderBy: {
        id: "desc",
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
    const sub_department = body.get("sub_department")!.toString();
    const tanggal = body.get("tanggal")!.toString();
    const jam_from = body.get("jam_from")!.toString();
    const jam_to = body.get("jam_to")!.toString();
    const job_desc = body.get("job_desc")?.toString();
    const remarks = body.get("remarks")?.toString();

    const karyawan = body.get("karyawan")!.toString();
    const parseKaryawan = JSON.parse(karyawan as string);

    const formattedDate = new Date(tanggal);
    formattedDate.setHours(formattedDate.getHours() + 7);

    const formattedDate2 = new Date(jam_from);
    formattedDate2.setHours(formattedDate2.getHours() + 7);
    formattedDate2.setSeconds(0);

    const formattedDate3 = new Date(jam_to);
    formattedDate3.setHours(formattedDate3.getHours() + 7);
    formattedDate3.setSeconds(0);

    if (formattedDate2 >= formattedDate3) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Jam Overtime Tidak Valid",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const department = await prisma.sub_department.findFirst({
      select: {
        department_id: true,
      },
      where: {
        id: Number(sub_department),
      },
    });

    if (!department) {
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

    const create = await prisma.pengajuan_overtime.create({
      data: {
        tanggal: formattedDate,
        jam_from: formattedDate2,
        jam_to: formattedDate3,
        department_id: Number(department?.department_id),
        sub_department_id: Number(sub_department),
        job_desc: job_desc?.toUpperCase(),
        remark: remarks?.toUpperCase(),
        bulan: formattedDate.getMonth() + 1,
        tahun: formattedDate.getFullYear(),
      },
    });

    if (!create) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Failed to create pengajuan overtime",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    await prisma.pengajuan_overtime_pegawai.createMany({
      data: parseKaryawan.map((item: any) => ({
        pengajuan_overtime_id: create.id,
        pegawai_id: Number(item.value),
      })),
    });

    return new NextResponse(
      JSON.stringify({
        status: true,
        message: "Success to create pengajuan overtime",
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
    return handleError(error);
  }
}
