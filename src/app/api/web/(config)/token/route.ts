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

    // page
    const page = searchParams.get("page");

    // search
    const search = searchParams.get("search");

    const condition = {
      where: {
        expired: false,
        user: {
          name: {
            contains: search ? search : undefined,
          },
          pegawai: {
            department_id: Number(select_dept),
          },
        },
      },
    };

    const totalData = await prisma.session_mobile.count({
      ...condition,
    });

    const ITEMS_PER_PAGE = page ? 10 : totalData;

    var data = await prisma.session_mobile.findMany({
      include: {
        user: {
          select: {
            name: true,
          },
        },
      },
      ...condition,
      orderBy: {
        id: "desc",
      },
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
