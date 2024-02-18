import { NextResponse } from "next/server";
import prisma from "@/libs/db";

const bcrypt = require("bcrypt");

export async function POST(req: Request) {
  try {
    const body = await req.formData();
    const username = body.get("username")!.toString();
    const password = body.get("password")!.toString();
    const role = body.get("role")!.toString();

    const hashPassword = await bcrypt.hash(password, 10);
    if (!hashPassword) {
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

    // format date
    const currendDate = new Date();
    const formattedDate = new Date(currendDate);
    formattedDate.setHours(formattedDate.getHours() + 7);

    var create = await prisma.user.create({
      data: {
        username: username,
        password: hashPassword,
        roles: {
          connect: {
            id: Number(role),
          },
        },
        createdAt: formattedDate,
      },
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
    if (error instanceof Error) {
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
