import { NextResponse } from "next/server";
import prisma from "@/libs/db";

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

export async function POST(req: Request) {
  try {
    const body = await req.formData();
    const username = body.get("username")?.toString();
    const password = body.get("password")?.toString();

    // empty username & password
    if (!username || !password) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Missing username and password",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // get data by username
    const getData = await prisma.user.findFirst({
      where: {
        username: username,
      },
      include: {
        roles: {
          include: {
            access_menu: {
              include: {
                menu: {
                  select: {
                    path: true,
                  },
                },
              },
              orderBy: [
                {
                  menu: {
                    menu_group: {
                      urut: "asc",
                    },
                  },
                },
                {
                  menu: {
                    urut: "asc",
                  },
                },
              ],
              take: 1,
            },
          },
        },
        pegawai: {
          select: {
            id: true,
            nama: true,
          },
        },
      },
    });

    // invalid username
    if (!getData) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Invalid username or password",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // check password
    const checkPassword = await bcrypt.compare(password, getData.password);

    // invalid password
    if (!checkPassword) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Invalid username or password",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const path = getData.roles?.access_menu?.[0]?.menu?.path;
    if (!path) {
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

    // new json
    const newDataUser = {
      id: getData.id,
      username: getData.username,
      roleId: getData.roles?.id,
      roleName: getData.roles?.role_name,
      path: path,
      pegawaiId: getData.pegawai?.id,
      pegawaiName: getData.pegawai?.nama,
    };

    // generate token
    const token = await jwt.sign({ data: newDataUser }, process.env.JWT, {
      expiresIn: "1h",
    });

    // format date
    const currendDate = new Date();
    const formattedDate = new Date(currendDate);
    formattedDate.setHours(formattedDate.getHours() + 7);

    // expires date
    const expiredDate = new Date(formattedDate);
    expiredDate.setHours(expiredDate.getHours() + 1);

    // insert session
    const session = await prisma.$transaction(async (prisma) => {
      const existSession = await prisma.session.findFirst({
        where: {
          user_id: getData.id,
          expiredAt: {
            gte: formattedDate,
          },
          expired: false,
        },
      });

      if (!existSession) {
        return await prisma.session.create({
          data: {
            user_id: getData.id,
            token: token,
            createdAt: formattedDate,
            expiredAt: expiredDate,
          },
        });
      } else {
        return await prisma.session.update({
          data: {
            token: token,
            expiredAt: expiredDate,
          },
          where: {
            id: existSession.id,
          },
        });
      }
    });

    if (!session) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Something went wrong",
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
        message: "Login success",
        data: {
          ...newDataUser,
          accessToken: token,
        },
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
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: error.message,
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
