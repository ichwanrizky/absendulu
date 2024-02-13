import { NextResponse } from "next/server";
import prisma from "@/libs/db";
const jwt = require("jsonwebtoken");

export async function GET(req: Request) {
  try {
    const authorization = req.headers.get("Authorization");
    if (!authorization) {
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

    // check bearer or not
    if (authorization.split(" ")[0] !== "Bearer") {
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

    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT);
    if (!decoded) {
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

    const currendDate = new Date();
    const formattedDate = new Date(currendDate);
    formattedDate.setHours(formattedDate.getHours() + 7);

    // check to session
    const session = await prisma.session.findFirst({
      where: {
        token: token,
        expiredAt: {
          gte: formattedDate,
        },
        OR: [
          {
            expired: false,
          },
        ],
      },
      orderBy: {
        id: "desc",
      },
    });

    if (!session) {
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

    const roleId = decoded.data.roleId;

    const accessMenu = await prisma.menu_group.findMany({
      include: {
        menu: {
          where: {
            access_menu: {
              some: {
                role_id: roleId,
              },
            },
          },
          orderBy: {
            urut: "asc",
          },
        },
      },
      where: {
        menu: {
          some: {
            access_menu: {
              some: {
                role_id: roleId,
              },
            },
          },
        },
      },
      orderBy: {
        urut: "asc",
      },
    });

    return new NextResponse(
      JSON.stringify({
        status: true,
        message: "Success",
        data: accessMenu,
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
          message: "Internal Server Error",
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
