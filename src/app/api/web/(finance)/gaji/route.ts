import { NextResponse } from "next/server";
import { checkSession } from "@/libs/checkSession";
import { checkRoles } from "@/libs/checkRoles";
import prisma from "@/libs/db";
import { handleError } from "@/libs/handleError";
import SalaryPanji from "@/libs/SalaryPanji";

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
    const bulan = searchParams.get("bulan");
    const tahun = searchParams.get("tahun");

    const data = await prisma.gaji_pegawai.findMany({
      include: {
        pegawai: {
          select: {
            id: true,
            nama: true,
          },
        },
      },
      where: {
        department_id: Number(select_dept),
        bulan: Number(bulan),
        tahun: Number(tahun),
        pegawai: {
          nama: {
            contains: search ? search : undefined,
          },
        },
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

    const body = await req.formData();
    const department = body.get("department")!.toString();
    const bulan = body.get("bulan")!.toString();
    const tahun = body.get("tahun")!.toString();
    const pegawai = body.get("pegawai");

    if (Number(department) === 1) {
      const gaji = await SalaryPanji(Number(bulan), Number(tahun), pegawai);

      for (const item of (gaji as any) || []) {
        await prisma.gaji_pegawai.create({
          data: {
            bulan: Number(item.bulan),
            tahun: Number(item.tahun),
            pegawai_id: Number(item.pegawai_id),
            nominal: Number(item.nominal),
            department_id: Number(department),
            gaji: {
              createMany: {
                data: item.gaji?.map((item2: any) => ({
                  bulan: Number(item.bulan),
                  tahun: Number(item.tahun),
                  pegawai_id: Number(item.pegawai_id),
                  tipe: item2.tipe,
                  komponen: item2.komponen_name,
                  komponen_id: item2.komponen_id,
                  nominal: Number(item2.nominal),
                  urut: item2.urut_tampil,
                })),
              },
            },
          },
        });
      }
    }

    return new NextResponse(
      JSON.stringify({
        status: true,
        message: "Success create data gaji",
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
