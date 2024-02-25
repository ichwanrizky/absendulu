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
      include: {
        pegawai: {
          select: {
            id: true,
            nama: true,
            department: {
              select: {
                nama_department: true,
              },
            },
            shift: {
              select: {
                jam_masuk: true,
                jam_pulang: true,
              },
            },
          },
        },
        session_mobile: {
          select: {
            expired: true,
          },
          orderBy: {
            id: "desc",
          },
          take: 1,
        },
      },
      where: {
        username: username,
        pegawai_id: {
          not: null,
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

    // session active

    if (
      getData.session_mobile.length > 0 &&
      getData.session_mobile[0].expired === false
    ) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Session active",
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

    // new json
    const newDataUser = {
      id: getData.id,
      username: getData.username,
      pegawaiId: getData.pegawai?.id,
      pegawaiName: getData.pegawai?.nama.toUpperCase(),
    };

    // generate token
    const token = await jwt.sign({ data: newDataUser }, process.env.JWT);

    // format date
    const currendDate = new Date();
    const formattedDate = new Date(currendDate);
    formattedDate.setHours(formattedDate.getHours() + 7);

    // insert session
    const session = await prisma.session_mobile.create({
      data: {
        user_id: getData.id,
        token: token,
        createdAt: formattedDate,
      },
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
