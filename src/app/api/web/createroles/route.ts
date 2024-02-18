import { NextResponse } from "next/server";
import prisma from "@/libs/db";

export async function POST(req: Request) {
  try {
    const body = await req.formData();
    const role_name = body.get("role_name")!.toString();
    const password = body.get("password")!.toString();

    if (password != process.env.PASSWORD_BYPASS) {
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

    var create = await prisma.roles.create({
      data: {
        role_name: role_name,
      },
    });

    if (!create) {
      return new NextResponse(
        JSON.stringify({
          status: false,
          message: "Failed to create roles",
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
        message: "Success to create roles",
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
