import { NextResponse } from "next/server";
import { checkSession } from "@/libs/checkSession";
import { checkRoles } from "@/libs/checkRoles";
import prisma from "@/libs/db";
import { handleError } from "@/libs/handleError";
const bcrypt = require("bcrypt");

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

    // page
    const page = searchParams.get("page");

    // filter
    const select_dept = searchParams.get("select_dept");

    const condition = {
      where: {
        name: {
          contains: search ? search : undefined,
        },
        pegawai: {
          department_id: Number(select_dept),
        },
      },
    };

    const totalData = await prisma.user.count({
      ...condition,
    });

    const ITEMS_PER_PAGE = page ? 10 : totalData;
    var data = await prisma.user.findMany({
      include: {
        pegawai: {
          select: {
            id: true,
            nama: true,
            tgl_lahir: true,
          },
        },
        roles: {
          select: {
            role_name: true,
          },
        },
      },
      ...condition,
      orderBy: [
        {
          pegawai: {
            nama: "asc",
          },
        },
      ],
      skip: page ? (parseInt(page) - 1) * ITEMS_PER_PAGE : 0,
      take: ITEMS_PER_PAGE,
    });

    data = data.map((data, index) => {
      return {
        number: page
          ? (Number(page) - 1) * ITEMS_PER_PAGE + index + 1
          : index + 1,
        ...data,
      };
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
        itemsPerPage: ITEMS_PER_PAGE,
        total: totalData,
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
    const pegawai = body.get("pegawai")!.toString();
    const parsePegawai = pegawai ? JSON.parse(pegawai) : {};

    const dataPegawai = await prisma.pegawai.findMany({
      select: {
        id: true,
        nama: true,
        tgl_lahir: true,
      },
      where: {
        id: {
          in: parsePegawai?.map((item: any) => Number(item.value)),
        },
      },
    });

    // format date
    const currendDate = new Date();
    const formattedDate = new Date(currendDate);
    formattedDate.setHours(formattedDate.getHours() + 7);

    const formattedPegawai = await Promise.all(
      dataPegawai.map(async (item) => {
        const username = item.nama?.toLowerCase().split(" ")[0] + item.id;
        const rawPassword =
          item.nama?.toLowerCase().split(" ")[0] +
          (item.tgl_lahir?.getFullYear() || "");
        const password = await bcrypt.hash(rawPassword, 10);

        return {
          username,
          password,
          createdAt: formattedDate,
          pegawai_id: item.id,
          name: item.nama.toUpperCase(),
        };
      })
    );

    const create = await prisma.user.createMany({
      data: formattedPegawai,
    });

    if (!create) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Failed to create user",
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
        message: "Success to create user",
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
